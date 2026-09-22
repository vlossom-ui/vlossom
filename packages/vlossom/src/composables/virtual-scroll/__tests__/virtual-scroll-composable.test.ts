import { describe, it, expect, afterEach, vi } from 'vitest';
import { computed, defineComponent, nextTick, ref, type Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useVirtualScroll, type VirtualScrollReturn } from './../virtual-scroll-composable';

const ESTIMATE_SIZE = 40;
const COUNT = 1000;

function mountVirtualScroll(
    contentTop: number,
    count: Ref<number> = ref(COUNT),
    getItemKey?: (index: number) => string,
) {
    let api: VirtualScrollReturn;

    const wrapper = mount(
        defineComponent({
            template: '<div ref="containerRef"><div ref="contentRef" /></div>',
            setup() {
                const containerRef = ref<HTMLElement | null>(null);
                const contentRef = ref<HTMLElement | null>(null);

                api = useVirtualScroll({
                    enabled: computed(() => true),
                    count,
                    estimateSize: ESTIMATE_SIZE,
                    getScrollContainer: () => containerRef.value,
                    getContentElement: () => contentRef.value,
                    getItemKey,
                });

                return { containerRef, contentRef };
            },
        }),
        { attachTo: document.body },
    );

    // jsdom에는 레이아웃이 없어서 콘텐츠 위치를 직접 심어준다
    vi.spyOn(wrapper.vm.$refs.contentRef as HTMLElement, 'getBoundingClientRect').mockReturnValue({
        top: contentTop,
    } as DOMRect);

    return { wrapper, api: api! };
}

describe('useVirtualScroll', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('스크롤 컨테이너가 아니라 콘텐츠 엘리먼트 기준으로 오프셋을 계산한다', async () => {
        // given
        const { wrapper, api } = mountVirtualScroll(250);

        // when
        window.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await nextTick();

        // then
        expect(api.virtualItems.value[0].index).toBe(0);
        expect(api.virtualItems.value[0].start).toBe(0);
        expect(api.paddingStart.value).toBe(0);
        wrapper.unmount();
    });

    it('앞뒤 여백과 렌더된 아이템 크기의 합이 전체 크기와 같다', async () => {
        // given
        const { wrapper, api } = mountVirtualScroll(250);

        // when
        window.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await nextTick();

        // then
        const renderedSize = api.virtualItems.value.reduce((sum, item) => sum + item.size, 0);
        expect(api.totalSize.value).toBe(COUNT * ESTIMATE_SIZE);
        expect(api.paddingStart.value + renderedSize + api.paddingEnd.value).toBe(api.totalSize.value);
        wrapper.unmount();
    });

    it('getItemKey를 주면 인덱스 대신 그 키를 쓴다', async () => {
        // given
        const { wrapper, api } = mountVirtualScroll(0, ref(COUNT), (index) => `row-${index}`);

        // when
        window.dispatchEvent(new Event('resize'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await nextTick();

        // then
        expect(api.virtualItems.value[0].key).toBe('row-0');
        wrapper.unmount();
    });

    it('아이템이 없으면 여백이 0이다', async () => {
        // given
        const { wrapper, api } = mountVirtualScroll(0, ref(0));

        // when
        await nextTick();

        // then
        expect(api.virtualItems.value).toHaveLength(0);
        expect(api.paddingStart.value).toBe(0);
        expect(api.paddingEnd.value).toBe(0);
        wrapper.unmount();
    });
});
