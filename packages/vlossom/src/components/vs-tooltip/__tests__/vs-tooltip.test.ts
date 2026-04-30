import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsTooltip from './../VsTooltip.vue';

describe('vs-tooltip', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    function cleanupOverlay() {
        const overlay = document.querySelector('#vs-floating-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    describe('기본 렌더링', () => {
        let wrapper: ReturnType<typeof mount<typeof VsTooltip>>;

        beforeEach(() => {
            wrapper = mount(VsTooltip, {
                slots: {
                    default: '<button>Hover Here!</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });
        });

        afterEach(() => {
            wrapper.unmount();
            cleanupOverlay();
        });

        it('초기에는 tooltip이 노출되지 않는다', () => {
            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });

        it('trigger wrapper가 default slot을 감싼다', () => {
            //then
            const trigger = wrapper.find('.vs-tooltip-trigger');
            expect(trigger.exists()).toBe(true);
            expect(trigger.find('button').exists()).toBe(true);
        });

        it('trigger에 마우스를 올렸을 때 툴팁이 노출된다', async () => {
            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
        });

        it('trigger에 마우스를 올렸다가 뗐을 때 툴팁이 사라진다', async () => {
            //when
            const trigger = wrapper.find('.vs-tooltip-trigger');
            await trigger.trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            await trigger.trigger('mouseleave');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });

        it('tooltip trigger에 focus가 잡히면 툴팁이 나타난다', async () => {
            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('focusin');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
        });

        it('tooltip trigger에서 focus가 사라지면 툴팁이 사라진다', async () => {
            //when
            const trigger = wrapper.find('.vs-tooltip-trigger');
            await trigger.trigger('focusin');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            await trigger.trigger('focusout');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });
    });

    describe('placement', () => {
        it('placement을 설정하면 해당 위치에 tooltip이 붙는다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { placement: 'bottom' },
                slots: {
                    default: '<button>Hover Here!</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip');
            expect(tooltip?.classList.contains('vs-placement-bottom')).toBe(true);

            //cleanup
            wrapper.unmount();
            cleanupOverlay();
        });
    });

    describe('align', () => {
        it('align을 설정하면 이에 맞게 tooltip이 정렬된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { align: 'end' },
                slots: {
                    default: '<button>Hover Here!</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
            const tooltip = window.document.body.querySelector('.vs-tooltip');
            expect(tooltip?.classList.contains('vs-align-end')).toBe(true);

            //cleanup
            wrapper.unmount();
            cleanupOverlay();
        });
    });

    describe('clickable', () => {
        it('clickable이 true일 때 trigger를 클릭하면 툴팁이 노출된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { clickable: true },
                slots: {
                    default: '<button>Click me</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = wrapper.find('.vs-tooltip-trigger');
            await trigger.trigger('click');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            await trigger.trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);

            //cleanup
            wrapper.unmount();
            cleanupOverlay();
        });
    });

    describe('contents hover', () => {
        it('contentsHover가 true일 때 trigger에 hover한 후 tooltip으로 마우스를 옮겨도 툴팁이 유지된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { contentsHover: true },
                slots: {
                    default: '<button>Hover Here!</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            const tooltip = window.document.body.querySelector('.vs-tooltip');
            tooltip?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);

            //cleanup
            wrapper.unmount();
            cleanupOverlay();
        });
    });

    describe('clickable + contentsHover 조합', () => {
        it('clickable과 contentsHover가 모두 true일 때 클릭 후 툴팁으로 마우스를 옮겨도 툴팁이 유지된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { clickable: true, contentsHover: true },
                slots: {
                    default: '<button>Hover Here!</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = wrapper.find('.vs-tooltip-trigger');
            await trigger.trigger('click');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            await trigger.trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            const tooltip = window.document.body.querySelector('.vs-tooltip');
            tooltip?.dispatchEvent(new Event('mouseenter', { bubbles: true }));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);

            //cleanup
            wrapper.unmount();
            cleanupOverlay();
        });
    });
});
