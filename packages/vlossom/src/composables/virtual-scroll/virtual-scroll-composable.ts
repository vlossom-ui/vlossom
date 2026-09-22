import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue';
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

export const VIRTUAL_SCROLL_THRESHOLD = 100;
export const DEFAULT_VIRTUAL_OVERSCAN = 5;

export interface VsVirtualItem {
    index: number;
    key: string;
    // 콘텐츠 엘리먼트 기준 오프셋 (scrollMargin이 이미 반영되어 있다)
    start: number;
    size: number;
}

export interface VirtualScrollOptions {
    enabled: Ref<boolean>;
    count: Ref<number>;
    estimateSize: number;
    // 스크롤 컨테이너 탐색의 시작점. 이 엘리먼트부터 조상으로 올라가며 실제 스크롤 주체를 찾는다
    getScrollContainer: () => HTMLElement | null;
    // 아이템이 배치되는 엘리먼트. 스크롤 컨테이너 안에서의 위치가 scrollMargin이 된다
    getContentElement: () => HTMLElement | null;
    overscan?: number;
    getItemKey?: (index: number) => string;
}

export interface VirtualScrollReturn {
    virtualItems: ComputedRef<VsVirtualItem[]>;
    totalSize: ComputedRef<number>;
    paddingStart: ComputedRef<number>;
    paddingEnd: ComputedRef<number>;
    measureElement: (element: HTMLElement | null) => void;
    scrollToIndex: (index: number, offset?: number) => void;
    scrollIntoView: (element: HTMLElement, offset?: number) => void;
}

type VirtualizerSetupOptions = PartialKeys<
    VirtualizerOptions<any, HTMLElement>,
    'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

const WINDOW_SCROLL_OPTIONS = {
    observeElementRect: observeWindowRect,
    observeElementOffset: observeWindowOffset,
    scrollToFn: windowScroll,
    initialOffset: () => window.scrollY,
};

const ELEMENT_SCROLL_OPTIONS = {
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
};

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

export function useVirtualScroll(options: VirtualScrollOptions): VirtualScrollReturn {
    const {
        enabled,
        count,
        estimateSize,
        getScrollContainer,
        getContentElement,
        overscan = DEFAULT_VIRTUAL_OVERSCAN,
        getItemKey,
    } = options;

    // 자기 자신이 스크롤 컨테이너가 아닐 때는 스크롤 조상을, 그마저 없으면 window를 쓴다
    const scrollElement = shallowRef<HTMLElement | null>(null);
    const isWindowScroll = ref(false);
    // 스크롤 컨테이너 안에서 콘텐츠가 시작하는 위치. 콘텐츠가 스크롤 컨테이너를 꽉 채울 때는 0
    const scrollMargin = ref(0);

    const virtualizer = useVirtualizer<any, HTMLElement>(
        computed<VirtualizerSetupOptions>(() => {
            const windowScrollMode = isWindowScroll.value;

            return {
                count: count.value,
                enabled: enabled.value,
                estimateSize: () => estimateSize,
                overscan,
                scrollMargin: scrollMargin.value,
                getScrollElement: () => (windowScrollMode ? window : scrollElement.value),
                ...(getItemKey ? { getItemKey } : {}),
                ...(windowScrollMode ? WINDOW_SCROLL_OPTIONS : ELEMENT_SCROLL_OPTIONS),
            };
        }),
    );

    let frameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let observedElements: HTMLElement[] = [];

    function observeResize(container: HTMLElement, scroller: HTMLElement | null) {
        if (typeof ResizeObserver === 'undefined') {
            return;
        }

        const targets = scroller && scroller !== container ? [container, scroller] : [container];
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
        const container = getScrollContainer();
        const content = getContentElement();
        if (!container || !content) {
            return;
        }

        const scroller = domUtil.isScrollableY(container) ? container : getScrollableParentY(container);
        scrollElement.value = scroller;
        isWindowScroll.value = scroller === null;

        const margin = getOffsetWithinScroller(content, scroller);
        if (Math.round(margin) !== Math.round(scrollMargin.value)) {
            scrollMargin.value = margin;
        }

        observeResize(container, scroller);
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

    // 콘텐츠 위쪽이 밀리면 scrollMargin이 어긋나므로, 바깥 스크롤을 쓸 때만 따라가며 보정한다
    function onOuterScroll() {
        if (enabled.value && scrollElement.value !== getScrollContainer()) {
            scheduleResolve();
        }
    }

    const virtualItems = computed<VsVirtualItem[]>(() =>
        virtualizer.value.getVirtualItems().map((item) => ({
            index: item.index,
            key: String(item.key),
            start: item.start - scrollMargin.value,
            size: item.size,
        })),
    );

    const totalSize = computed(() => virtualizer.value.getTotalSize());

    const paddingStart = computed(() => virtualItems.value[0]?.start ?? 0);

    const paddingEnd = computed(() => {
        const last = virtualItems.value[virtualItems.value.length - 1];
        return last ? Math.max(0, totalSize.value - (last.start + last.size)) : 0;
    });

    function measureElement(element: HTMLElement | null) {
        if (!element) {
            return;
        }
        virtualizer.value.measureElement(element);
    }

    function scrollToIndex(index: number, offset: number = 0) {
        const result = virtualizer.value.getOffsetForIndex(index, 'start');
        if (!result) {
            return;
        }
        virtualizer.value.scrollToOffset(Math.max(0, result[0] - offset), { align: 'start' });
    }

    function scrollIntoView(element: HTMLElement, offset: number = 0) {
        const scroller = scrollElement.value;
        const top = Math.max(0, getOffsetWithinScroller(element, scroller) - offset);

        if (scroller) {
            scroller.scrollTo({ top, behavior: 'auto' });
        } else {
            window.scrollTo({ top, behavior: 'auto' });
        }
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

    return { virtualItems, totalSize, paddingStart, paddingEnd, measureElement, scrollToIndex, scrollIntoView };
}
