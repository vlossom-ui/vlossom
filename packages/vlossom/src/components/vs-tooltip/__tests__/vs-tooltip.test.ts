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

    describe('target 모드 - 기본 렌더링', () => {
        let wrapper: ReturnType<typeof mount<typeof VsTooltip>>;
        const targetId = 'test-trigger';

        beforeEach(() => {
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            wrapper = mount(VsTooltip, {
                props: {
                    target: `#${targetId}`,
                },
                slots: {
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });
        });

        afterEach(() => {
            wrapper.unmount();
            const button = document.getElementById(targetId);
            if (button) {
                document.body.removeChild(button);
            }
            cleanupOverlay();
        });

        it('초기에는 tooltip이 노출되지 않는다', () => {
            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });

        it('target이 지정되면 wrapper 엘리먼트는 렌더링되지 않는다', () => {
            //then
            expect(wrapper.find('.vs-tooltip-trigger').exists()).toBe(false);
        });

        it('trigger에 마우스를 올렸을 때 툴팁이 노출된다', async () => {
            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
        });

        it('trigger에 마우스를 올렸다가 뗐을 때 툴팁이 사라진다', async () => {
            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            trigger?.dispatchEvent(new Event('mouseleave'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });

        it('tooltip trigger에 focus가 잡히면 툴팁이 나타난다', async () => {
            //when
            const trigger = document.getElementById(targetId) as HTMLElement;
            trigger?.focus();
            trigger?.dispatchEvent(new Event('focusin'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
        });

        it('tooltip trigger에서 focus가 사라지면 툴팁이 사라진다', async () => {
            //when
            const trigger = document.getElementById(targetId) as HTMLElement;
            trigger?.focus();
            trigger?.dispatchEvent(new Event('focusin'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            trigger?.blur();
            trigger?.dispatchEvent(new Event('focusout'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });
    });

    describe('slot 모드 - 기본 렌더링', () => {
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

        it('target이 없으면 default slot이 wrapper 엘리먼트로 감싸진다', () => {
            //then
            const wrapperEl = wrapper.find('.vs-tooltip-trigger');
            expect(wrapperEl.exists()).toBe(true);
            expect(wrapperEl.element.tagName.toLowerCase()).toBe('span');
            expect(wrapperEl.text()).toBe('Hover Here!');
        });

        it('wrapper 엘리먼트에는 인스턴스마다 유니크한 클래스가 부여된다', () => {
            //given
            const otherWrapper = mount(VsTooltip, {
                slots: {
                    default: '<button>Another</button>',
                    tooltip: 'Other tooltip',
                },
                attachTo: document.body,
            });

            //when
            const classA = wrapper.find('.vs-tooltip-trigger').classes();
            const classB = otherWrapper.find('.vs-tooltip-trigger').classes();
            const uniqueA = classA.find((c) => c.startsWith('vs-tooltip-trigger-'));
            const uniqueB = classB.find((c) => c.startsWith('vs-tooltip-trigger-'));

            //then
            expect(uniqueA).toBeTruthy();
            expect(uniqueB).toBeTruthy();
            expect(uniqueA).not.toBe(uniqueB);

            //cleanup
            otherWrapper.unmount();
        });

        it('wrapper 엘리먼트에 마우스를 올리면 툴팁이 노출된다', async () => {
            //when
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
        });

        it('wrapper 엘리먼트에 마우스를 올렸다 떼면 툴팁이 사라진다', async () => {
            //when
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.computedShow).toBe(true);

            trigger.dispatchEvent(new Event('mouseleave'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(false);
        });
    });

    describe('slot 모드 - tag prop', () => {
        it('tag prop으로 wrapper 엘리먼트의 태그를 변경할 수 있다', () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { tag: 'div' },
                slots: {
                    default: 'Trigger',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //then
            const wrapperEl = wrapper.find('.vs-tooltip-trigger');
            expect(wrapperEl.element.tagName.toLowerCase()).toBe('div');

            //cleanup
            wrapper.unmount();
            cleanupOverlay();
        });
    });

    describe('placement', () => {
        it('placement을 설정하면 해당 위치에 tooltip이 붙는다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                props: { placement: 'bottom' },
                slots: {
                    default: '<button>Hover</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('mouseenter'));
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
                    default: '<button>Hover</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('mouseenter'));
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
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('click'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            trigger.dispatchEvent(new Event('mouseenter'));
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
                    default: '<button>Hover</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('mouseenter'));
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
                    default: '<button>Hover</button>',
                    tooltip: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = wrapper.find('.vs-tooltip-trigger').element as HTMLElement;
            trigger.dispatchEvent(new Event('click'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            trigger.dispatchEvent(new Event('mouseenter'));
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
