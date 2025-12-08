<template>
    <component :is="tag" ref="visibleRenderRef" class="vs-visible-render" :style="containerStyle">
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

const name = VsComponent.VsVisibleRender;
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

        const visibleRenderRef: TemplateRef<HTMLElement> = useTemplateRef('visibleRenderRef');

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

        // visibleRenderRef부터 부모로 올라가면서 스크롤 가능한 요소 찾기
        function getScrollRoot(): Element | null {
            let el = visibleRenderRef.value;
            while (el) {
                if (domUtil.isScrollableY(el)) {
                    return el;
                }

                if (el === document.body || el === document.documentElement) {
                    break;
                }
                el = el.parentElement;
            }

            return null;
        }

        function updateChildVisibility(child: HTMLElement, visible: boolean) {
            child.dataset.ioVisible = visible ? 'true' : 'false';
        }

        function setAllChildrenVisibility(visible: boolean) {
            const el = visibleRenderRef.value;
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
            const el = visibleRenderRef.value;
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

            if (!visibleRenderRef.value || disabled.value) {
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

            const mutationRoot = visibleRenderRef.value;
            if (!mutationRoot) {
                return;
            }

            mo = createMutationObserver();
            mo.observe(mutationRoot, { childList: true });
        }

        // ============= 초기화 및 바인딩 =============

        async function initialize() {
            if (!visibleRenderRef.value) {
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

        function scrollToElement(element: HTMLElement) {
            if (!visibleRenderRef.value || !element) {
                return;
            }

            const scrollRoot = getScrollRoot();

            updateChildVisibility(element, true);

            waitForLayout(() => {
                if (!visibleRenderRef.value || !element) {
                    return;
                }

                if (scrollRoot === null) {
                    // viewport가 스크롤 컨테이너인 경우 window.scrollTo 사용
                    const rect = element.getBoundingClientRect();
                    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
                    const targetScrollY = currentScrollY + rect.top;

                    window.scrollTo({
                        top: targetScrollY,
                        behavior: 'auto',
                    });
                } else {
                    // scrollRoot가 실제 스크롤 컨테이너이므로 scrollRoot를 사용
                    const scrollContainer = scrollRoot as HTMLElement;
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const targetRect = element.getBoundingClientRect();
                    const targetScrollTop = scrollContainer.scrollTop + targetRect.top - containerRect.top;

                    scrollContainer.scrollTo({
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
            visibleRenderRef,
            containerStyle,

            // expose
            scrollToElement,
        };
    },
});
</script>

<style src="./VsVisibleRender.css" />
