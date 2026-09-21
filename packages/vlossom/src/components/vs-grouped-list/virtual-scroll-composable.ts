import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref } from 'vue';
import {
    elementScroll,
    observeElementOffset,
    observeElementRect,
    observeWindowOffset,
    observeWindowRect,
    useVirtualizer,
    windowScroll,
    type PartialKeys,
    type VirtualizerOptions,
} from '@tanstack/vue-virtual';
import { domUtil } from '@/utils';
import { ESTIMATED_ITEM_SIZE, VIRTUAL_OVERSCAN } from './constants';

type VirtualScrollOptions = PartialKeys<
    VirtualizerOptions<any, HTMLElement>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

function getScrollableParentY(element: HTMLElement): HTMLElement | null {
    const { body, documentElement } = element.ownerDocument;

    let current = element.parentElement;
    while (current && current !== body && current !== documentElement) {
        if (domUtil.isScrollableY(current)) {
            return current;
        }
        current = current.parentElement;
    }

    return null;
}

// scroller가 null이면 window 기준(문서 좌표)으로 계산한다
function getOffsetWithinScroller(element: HTMLElement, scroller: HTMLElement | null): number {
    const { top } = element.getBoundingClientRect();

    if (!scroller) {
        return top + window.scrollY;
    }

    const borderTop = parseFloat(getComputedStyle(scroller).borderTopWidth) || 0;
    return top - scroller.getBoundingClientRect().top - borderTop + scroller.scrollTop;
}

export function useVirtualScroll(
    enabled: Ref<boolean>,
    count: Ref<number>,
    getInnerScrollElement: () => HTMLElement | null,
    getListElement: () => HTMLElement | null,
) {
    // 자기 자신이 스크롤 컨테이너가 아닐 때는 스크롤 조상을, 그마저 없으면 window를 쓴다
    const scrollElement = shallowRef<HTMLElement | null>(null);
    const isWindowScroll = ref(false);
    // 스크롤 컨테이너 안에서 리스트가 시작하는 위치. 리스트가 스크롤 컨테이너 자체일 때는 0
    const scrollMargin = ref(0);

    const virtualizer = useVirtualizer<any, HTMLElement>(
        computed<VirtualScrollOptions>(() => {
            const windowScrollMode = isWindowScroll.value;

            return {
                count: count.value,
                enabled: enabled.value,
                estimateSize: () => ESTIMATED_ITEM_SIZE,
                overscan: VIRTUAL_OVERSCAN,
                scrollMargin: scrollMargin.value,
                getScrollElement: () => (windowScrollMode ? window : scrollElement.value),
                ...(windowScrollMode
                    ? {
                        observeElementRect: observeWindowRect,
                        observeElementOffset: observeWindowOffset,
                        scrollToFn: windowScroll,
                        initialOffset: () => window.scrollY,
                    }
                    : {
                        observeElementRect,
                        observeElementOffset,
                        scrollToFn: elementScroll,
                    }),
            };
        }),
    );

    let frameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let observedElements: HTMLElement[] = [];

    function observeResize(inner: HTMLElement, scroller: HTMLElement | null) {
        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const targets = scroller && scroller !== inner ? [inner, scroller] : [inner];
        if (targets.length === observedElements.length && targets.every((el, i) => el === observedElements[i])) {
            return;
        }

        if (!resizeObserver) {
            resizeObserver = new ResizeObserver(scheduleResolve);
        }
        resizeObserver.disconnect();
        targets.forEach((el) => resizeObserver?.observe(el));
        observedElements = targets;
    }

    function resolveScrollElement() {
        const inner = getInnerScrollElement();
        const list = getListElement();
        if (!inner || !list) {
            return;
        }

        const scroller = domUtil.isScrollableY(inner) ? inner : getScrollableParentY(inner);
        scrollElement.value = scroller;
        isWindowScroll.value = scroller === null;

        const margin = getOffsetWithinScroller(list, scroller);
        if (Math.round(margin) !== Math.round(scrollMargin.value)) {
            scrollMargin.value = margin;
        }

        observeResize(inner, scroller);
    }

    function scheduleResolve() {
        if (frameId !== null || !domUtil.isBrowser()) {
            return;
        }
        frameId = requestAnimationFrame(() => {
            frameId = null;
            resolveScrollElement();
        });
    }

    // 리스트 위쪽 콘텐츠가 밀리면 scrollMargin이 어긋나므로, 바깥 스크롤을 쓸 때만 따라가며 보정한다
    function onOuterScroll() {
        if (enabled.value && scrollElement.value !== getInnerScrollElement()) {
            scheduleResolve();
        }
    }

    function scrollIntoView(target: HTMLElement, offset: number) {
        const scroller = scrollElement.value;
        const top = Math.max(0, getOffsetWithinScroller(target, scroller) - offset);

        if (scroller) {
            scroller.scrollTo({ top, behavior: 'auto' });
        } else {
            window.scrollTo({ top, behavior: 'auto' });
        }
    }

    function scrollToIndex(index: number, offset: number) {
        const result = virtualizer.value.getOffsetForIndex(index, 'start');
        if (!result) {
            return;
        }
        virtualizer.value.scrollToOffset(Math.max(0, result[0] - offset), { align: 'start' });
    }

    onMounted(() => {
        resolveScrollElement();
        window.addEventListener('resize', scheduleResolve, { passive: true });
        window.addEventListener('scroll', onOuterScroll, { passive: true, capture: true });
    });

    onBeforeUnmount(() => {
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
        resizeObserver?.disconnect();
        resizeObserver = null;
        observedElements = [];
        window.removeEventListener('resize', scheduleResolve);
        window.removeEventListener('scroll', onOuterScroll, { capture: true });
    });

    watch([enabled, count], scheduleResolve, { flush: 'post' });

    return { virtualizer, scrollMargin, scrollIntoView, scrollToIndex };
}
