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
import { stringUtil } from '@/utils';

const name = VsComponent.VsInfiniteScroll;
export default defineComponent({
    name,
    props: {
        disabled: { type: Boolean, default: false },
        height: { type: [String, Number] },
        initialIndex: { type: Number },
        rootMargin: { type: String, default: '0px' },
        tag: { type: String, default: 'div' },
        threshold: { type: Number, default: 0 },
    },
    setup(props) {
        const { disabled, height, rootMargin, threshold, initialIndex } = toRefs(props);
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

        function isScrollable(el: HTMLElement): boolean {
            const style = getComputedStyle(el);
            const overflowY = style.overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
                return true;
            }
            return el.scrollHeight > el.clientHeight;
        }

        function getScrollRoot(): Element | null {
            const el = rootRef.value;
            if (!el) {
                return null;
            }
            // 컨테이너 자체가 스크롤 가능하면 root로 사용, 아니면 viewport 사용
            return isScrollable(el) ? el : null;
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

            // 모든 children을 observe
            for (const child of children) {
                updateChildVisibility(child, false);
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

            // IntersectionObserver 활성화 시 초기 상태는 모두 숨김
            setAllChildrenVisibility(false);
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

        function scrollToIndex(index: number) {
            if (!rootRef.value) {
                return;
            }

            const children = Array.from(rootRef.value.children) as HTMLElement[];

            if (index < 0 || index >= children.length) {
                return;
            }

            const targetElement = children[index];
            if (!targetElement) {
                return;
            }

            // 스크롤 전에 해당 요소를 표시
            updateChildVisibility(targetElement, true);

            // 레이아웃 완료 후 스크롤
            requestAnimationFrame(() => {
                if (!rootRef.value || !targetElement) {
                    return;
                }

                targetElement.scrollIntoView({
                    behavior: 'auto',
                    block: 'start',
                    inline: 'nearest',
                });
            });
        }

        // ============= 라이프사이클 훅 =============

        onMounted(async () => {
            await initialize();

            // DOM 렌더링 완료 후 초기 인덱스로 스크롤
            requestAnimationFrame(() => {
                if (initialIndex.value !== undefined) {
                    scrollToIndex(initialIndex.value);
                }
            });
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
            scrollToIndex,
            containerStyle,
        };
    },
});
</script>

<style src="./VsInfiniteScroll.css" />
