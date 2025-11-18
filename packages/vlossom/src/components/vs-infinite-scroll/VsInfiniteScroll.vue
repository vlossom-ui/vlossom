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
    type PropType,
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
        threshold: {
            type: [Number, Array] as PropType<number | number[]>,
            default: 0,
        },
    },
    setup(props) {
        const { disabled, height, rootMargin, threshold, initialIndex } = toRefs(props);
        const rootRef: TemplateRef<HTMLDivElement> = useTemplateRef('rootRef');
        let io: IntersectionObserver | null = null;
        let mo: MutationObserver | null = null;
        // 이전에 observe했던 children Set (메모리 릭 방지용, O(1) 검색을 위해 Set 사용)
        const previousChildrenSet = new Set<HTMLElement>();

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

        function getRoot(): Element | null {
            const el = rootRef.value;
            if (!el) {
                return null;
            }
            // If the wrapper itself is a scrolling container, use it as the root; otherwise viewport.
            return isScrollable(el) ? el : null;
        }

        function ensureObserver() {
            disposeObserver();
            if (!rootRef.value || disabled.value) {
                return;
            }

            const root = getRoot();

            io = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        const target = entry.target as HTMLElement;
                        const visible = entry.isIntersecting;
                        // 명시적으로 false로 설정 (문자열 변환)
                        target.dataset.ioVisible = visible ? 'true' : 'false';
                    }
                },
                {
                    root,
                    rootMargin: rootMargin.value,
                    threshold: Array.isArray(threshold.value) ? threshold.value : [threshold.value],
                },
            );
        }

        function observeChildren() {
            const el = rootRef.value;
            if (!el || disabled.value) {
                return;
            }
            const children = Array.from(el.children) as HTMLElement[];

            // Observer를 재생성하여 모든 children의 현재 상태를 즉시 확인
            // (일부 아이템 변경 후에도 이미 viewport에 있는 요소들이 즉시 보이도록)
            disposeObserver();
            ensureObserver();

            if (!io) {
                return;
            }

            // 모든 children을 observe (새 observer이므로 모든 요소의 현재 상태를 즉시 확인)
            for (const child of children) {
                child.dataset.ioVisible = 'false';
                io.observe(child);
            }

            // observe한 요소들을 추적 Set에 추가
            previousChildrenSet.clear();
            for (const child of children) {
                previousChildrenSet.add(child);
            }
        }

        function disposeObserver() {
            if (io) {
                io.disconnect();
                io = null;
            }
            // observe했던 요소들 추적 정보도 정리
            previousChildrenSet.clear();
        }

        function ensureMutationObserver() {
            if (mo) {
                mo.disconnect();
                mo = null;
            }
            const root = rootRef.value;
            if (!root) {
                return;
            }
            mo = new MutationObserver(() => {
                // Re-bind new children lazily
                if (!disabled.value && io) {
                    observeChildren();
                } else if (disabled.value) {
                    showAllChildren();
                }
            });
            mo.observe(root, { childList: true });
        }

        function showAllChildren() {
            const el = rootRef.value;
            if (!el) {
                return;
            }
            for (const child of Array.from(el.children) as HTMLElement[]) {
                child.dataset.ioVisible = 'true';
            }
        }

        function hideAllChildren() {
            const el = rootRef.value;
            if (!el) {
                return;
            }
            for (const child of Array.from(el.children) as HTMLElement[]) {
                child.dataset.ioVisible = 'false';
            }
        }

        async function bind() {
            if (!rootRef.value) {
                return;
            }
            if (disabled.value) {
                disposeObserver();
                showAllChildren();
                ensureMutationObserver();
                return;
            }
            // Observer 설정 전에 모든 요소를 먼저 숨김
            hideAllChildren();
            ensureObserver();
            ensureMutationObserver();
            // Wait for DOM children to be in place
            await nextTick();
            observeChildren();
        }

        function scrollToIndex(index: number) {
            if (!rootRef.value) {
                return;
            }

            const children = Array.from(rootRef.value.children) as HTMLElement[];

            // index 범위 검증
            if (index < 0 || index >= children.length) {
                return;
            }

            const targetElement = children[index] as HTMLElement | undefined;

            if (!targetElement) {
                return;
            }

            // 스크롤 전에 해당 요소가 보이도록 함
            targetElement.dataset.ioVisible = 'true';

            // 다음 프레임에서 스크롤 (레이아웃이 완료된 후)
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

        onMounted(async () => {
            await bind();

            // DOM이 완전히 렌더링된 후 스크롤
            requestAnimationFrame(() => {
                if (initialIndex.value !== undefined) {
                    scrollToIndex(initialIndex.value);
                }
            });
        });

        onBeforeUnmount(() => {
            disposeObserver();
            if (mo) {
                mo.disconnect();
                mo = null;
            }
        });

        watch(
            () => [disabled.value, rootMargin.value, JSON.stringify(threshold.value)],
            async () => {
                await bind();
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
