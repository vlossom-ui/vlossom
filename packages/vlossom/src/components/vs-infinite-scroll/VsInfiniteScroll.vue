<template>
    <component :is="tag" ref="rootRef" class="vs-infinite-scroll" :style="containerStyle">
        <slot />
    </component>
</template>

<script lang="ts">
import {
    defineComponent,
    toRefs,
    computed,
    onMounted,
    onBeforeUnmount,
    watch,
    useTemplateRef,
    nextTick,
    type TemplateRef,
} from 'vue';
import { VsComponent } from '@/declaration';
import { domUtil, logUtil, stringUtil } from '@/utils';

const name = VsComponent.VsInfiniteScroll;
export default defineComponent({
    name,
    props: {
        disabled: { type: Boolean, default: false },
        height: { type: [String, Number] },
        rootMargin: { type: String, default: '0px' },
        tag: { type: String, default: 'div' },
        threshold: {
            type: Number,
            default: 0,
            validator: (value: number) => {
                const isValid = value >= 0 && value <= 1;
                if (!isValid) {
                    logUtil.propError(name, 'threshold', 'invalid threshold value');
                    return false;
                }
                return true;
            },
        },
    },
    setup(props) {
        const { disabled, height, rootMargin, threshold } = toRefs(props);
        const rootRef: TemplateRef<HTMLDivElement> = useTemplateRef('rootRef');

        let io: IntersectionObserver | null = null;
        let mo: MutationObserver | null = null;

        const containerStyle = computed(() => {
            if (!height.value) {
                return {};
            }
            return {
                height: stringUtil.toStringSize(height.value),
                overflowY: 'auto',
            };
        });

        function getScrollRoot(): Element | null {
            const el = rootRef.value;
            if (!el) {
                return null;
            }
            // 컨테이너 자체가 스크롤 가능하면 root로 사용, 아니면 viewport 사용
            return domUtil.isScrollableY(el) ? el : null;
        }

        function updateChildVisibility(child: HTMLElement, visible: boolean) {
            child.dataset.ioVisible = visible ? 'true' : 'false';
        }

        function setAllChildrenVisibility(visible: boolean) {
            const el = rootRef.value;
            if (!el) {
                return;
            }
            for (const child of Array.from(el.children) as HTMLElement[]) {
                updateChildVisibility(child, visible);
            }
        }

        // ============= IntersectionObserver 관리 =============

        function createIntersectionObserver() {
            const root = getScrollRoot();
            return new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        const target = entry.target as HTMLElement;
                        updateChildVisibility(target, entry.isIntersecting);
                    }
                },
                {
                    root,
                    rootMargin: rootMargin.value,
                    threshold: threshold.value,
                },
            );
        }

        function observeChildren() {
            const el = rootRef.value;
            if (!el || disabled.value || !io) {
                return;
            }

            const children = Array.from(el.children) as HTMLElement[];

            for (const child of children) {
                io.observe(child);
            }
        }

        function disconnectIntersectionObserver() {
            if (io) {
                io.disconnect();
                io = null;
            }
        }

        function setupIntersectionObserver() {
            disconnectIntersectionObserver();

            if (!rootRef.value || disabled.value) {
                return;
            }

            io = createIntersectionObserver();
        }

        // ============= MutationObserver 관리 =============

        function createMutationObserver() {
            return new MutationObserver(() => {
                if (disabled.value) {
                    setAllChildrenVisibility(true);
                } else if (io) {
                    // children 변경 시 observer 재설정하여 즉시 상태 반영
                    setupIntersectionObserver();
                    observeChildren();
                }
            });
        }

        function disconnectMutationObserver() {
            if (mo) {
                mo.disconnect();
                mo = null;
            }
        }

        function setupMutationObserver() {
            disconnectMutationObserver();

            const root = rootRef.value;
            if (!root) {
                return;
            }

            mo = createMutationObserver();
            mo.observe(root, { childList: true });
        }

        // ============= 초기화 및 바인딩 =============

        async function initialize() {
            if (!rootRef.value) {
                return;
            }

            if (disabled.value) {
                disconnectIntersectionObserver();
                setAllChildrenVisibility(true);
                setupMutationObserver();
                return;
            }

            setupIntersectionObserver();
            setupMutationObserver();

            // DOM children이 준비될 때까지 대기
            await nextTick();
            observeChildren();
        }

        function cleanup() {
            disconnectIntersectionObserver();
            disconnectMutationObserver();
        }

        // ============= 스크롤 제어 =============

        function waitForLayout(callback: () => void) {
            // DOM 렌더링 완료를 위해 nextTick과 requestAnimationFrame 조합 사용
            nextTick(() => {
                requestAnimationFrame(callback);
            });
        }

        function scrollTo(element: HTMLElement) {
            if (!rootRef.value || !element) {
                return;
            }

            const scrollRoot = getScrollRoot();
            const isViewportScroll = scrollRoot === null;

            updateChildVisibility(element, true);
            waitForLayout(() => {
                if (!rootRef.value || !element) {
                    return;
                }

                if (isViewportScroll) {
                    const rect = element.getBoundingClientRect();
                    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
                    const targetScrollY = currentScrollY + rect.top;

                    window.scrollTo({
                        top: targetScrollY,
                        behavior: 'auto',
                    });
                } else {
                    const containerRect = rootRef.value.getBoundingClientRect();
                    const targetRect = element.getBoundingClientRect();
                    const targetScrollTop = rootRef.value.scrollTop + targetRect.top - containerRect.top;

                    rootRef.value.scrollTo({
                        top: targetScrollTop,
                        behavior: 'auto',
                    });
                }
            });
        }

        // ============= 라이프사이클 훅 =============

        onMounted(async () => {
            await initialize();
        });

        onBeforeUnmount(() => {
            cleanup();
        });

        watch(
            () => [disabled.value, rootMargin.value, threshold.value],
            async () => {
                await initialize();
            },
        );

        return {
            rootRef,
            containerStyle,
            // expose
            scrollTo,
        };
    },
});
</script>

<style src="./VsInfiniteScroll.css" />
