<template>
    <component :is="tag" ref="rootRef" class="vs-infinite-scroll">
        <slot />
    </component>
</template>

<script lang="ts">
import {
    defineComponent,
    toRefs,
    onMounted,
    onBeforeUnmount,
    watch,
    useTemplateRef,
    nextTick,
    type TemplateRef,
    type PropType,
} from 'vue';
import { VsComponent } from '@/declaration';

const name = VsComponent.VsInfiniteScroll;

export default defineComponent({
    name,
    props: {
        disabled: { type: Boolean, default: false },
        initialIndex: { type: Number, default: 0 },
        rootMargin: { type: String, default: '0px' },
        tag: { type: String, default: 'div' },
        threshold: {
            type: [Number, Array] as PropType<number | number[]>,
            default: 0,
        },
    },
    setup(props) {
        const { disabled, rootMargin, threshold, initialIndex } = toRefs(props);
        const rootRef: TemplateRef<HTMLDivElement> = useTemplateRef('rootRef');
        let io: IntersectionObserver | null = null;
        let mo: MutationObserver | null = null;

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
            if (!el || !io) {
                return;
            }
            const children = Array.from(el.children) as HTMLElement[];
            for (const child of children) {
                child.dataset.ioVisible = 'false';
            }
            // observe 호출 시 즉시 콜백이 실행되어 상태 업데이트
            for (const child of children) {
                io.observe(child);
            }
        }

        function disposeObserver() {
            if (io) {
                io.disconnect();
                io = null;
            }
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

            // initialIndex로 스크롤
            if (initialIndex.value !== undefined) {
                // DOM이 완전히 렌더링된 후 스크롤
                requestAnimationFrame(() => {
                    scrollToIndex(initialIndex.value);
                });
            }
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
        };
    },
});
</script>

<style lang="css" src="./VsInfiniteScroll.css" />
