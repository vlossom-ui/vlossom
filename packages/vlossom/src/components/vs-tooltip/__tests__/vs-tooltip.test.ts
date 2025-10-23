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

    describe('기본 렌더링', () => {
        let wrapper = mount(VsTooltip);

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
        });

        it('초기에는 trigger만 렌더되며 contents는 노출되지 않는다', () => {
            //then
            expect(wrapper.find('.vs-tooltip-trigger').exists()).toBe(true);
            expect(wrapper.vm.isVisible).toBe(false);
        });

        it('trigger에 마우스를 올렸을 때 툴팁이 노출된다', async () => {
            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });

        it('trigger에 마우스를 올렸다가 뗐을 때 툴팁이 사라진다', async () => {
            //when
            wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            wrapper.find('.vs-tooltip-trigger').trigger('mouseleave');
            await vi.advanceTimersByTimeAsync(250);

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });

        it('tooltip trigger에 focus가 잡히면 툴팁이 나타난다', async () => {
            //when
            wrapper.find('.vs-tooltip-trigger').find('button').element.focus();
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });

        it('tooltip trigger에서 focus가 사라지면 툴팁이 사라진다', async () => {
            //when
            wrapper.find('.vs-tooltip-trigger').find('button').element.focus();
            await vi.advanceTimersByTimeAsync(0);

            wrapper.find('.vs-tooltip-trigger').find('button').element.blur();
            await vi.advanceTimersByTimeAsync(300);

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });
    });

    describe('placement', () => {
        it('placement을 설정하면 해당 위치에 tooltip이 붙는다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    placement: 'bottom',
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(50); // wait for setPosition end (50ms)

            //then
            expect(wrapper.vm.computedPlacement).toBe('bottom');
        });
    });

    describe('align', () => {
        it('align을 설정하면 이에 맞게 tooltip이 정렬된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    align: 'end',
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
            const tooltip = window.document.body.querySelector('.vs-tooltip-wrap');
            expect(tooltip?.classList.contains('vs-align-end')).toBe(true);
        });
    });

    describe('clickable', () => {
        it('clickable이 true일 때 trigger를 클릭하면 툴팁이 노출된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    clickable: true,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('click');
            await vi.advanceTimersByTimeAsync(0);

            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });
    });

    describe('contents hover', () => {
        it('contentsHover가 true일 때 trigger에 hover한 후 tooltip으로 마우스를 옮겨도 툴팁이 유지된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    contentsHover: true,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);
            const tooltip = window.document.body.querySelector('.vs-tooltip-wrap');
            tooltip?.dispatchEvent(new Event('mouseenter'));

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });
    });

    describe('disabled', () => {
        it('disabled가 true일 때는 trigger에 마우스를 올려도 툴팁이 노출되지 않는다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    disabled: true,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });
    });

    describe('enterDelay', () => {
        it('enterDelay가 설정되면 해당 시간만큼 지연 후 툴팁이 나타난다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    enterDelay: 100,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(50); // 아직 지연 시간이 지나지 않음

            //then
            expect(wrapper.vm.isVisible).toBe(false);

            //when
            await vi.advanceTimersByTimeAsync(60); // 지연 시간이 지남

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });

        it('enterDelay 중에 마우스가 벗어나면 툴팁이 나타나지 않는다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    enterDelay: 100,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(50);

            await wrapper.find('.vs-tooltip-trigger').trigger('mouseleave');
            await vi.advanceTimersByTimeAsync(60);

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });
    });

    describe('leaveDelay', () => {
        it('leaveDelay가 설정되면 해당 시간만큼 지연 후 툴팁이 사라진다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    leaveDelay: 100,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            await wrapper.find('.vs-tooltip-trigger').trigger('mouseleave');
            await vi.advanceTimersByTimeAsync(50); // 아직 지연 시간이 지나지 않음

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //when
            await vi.advanceTimersByTimeAsync(60); // leaveDelay 100ms + 애니메이션 250ms = 350ms 총 필요
            await vi.advanceTimersByTimeAsync(250); // 애니메이션 대기 시간 추가

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });

        it('leaveDelay 중에 마우스가 다시 들어오면 툴팁이 유지된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    leaveDelay: 100,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            await wrapper.find('.vs-tooltip-trigger').trigger('mouseleave');
            await vi.advanceTimersByTimeAsync(50);

            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(60);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });
    });

    describe('noAnimation', () => {
        it('noAnimation이 true일 때 애니메이션 클래스가 적용되지 않는다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    noAnimation: true,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip-contents');
            expect(tooltip?.classList.contains('fade-in-top')).toBe(false);
        });

        it('noAnimation이 false일 때 애니메이션 클래스가 적용된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    noAnimation: false,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip-contents');
            expect(tooltip?.classList.contains('fade-in-top')).toBe(true);
        });
    });

    describe('margin', () => {
        it('margin이 설정되면 해당 값으로 padding이 적용된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    margin: '1rem',
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip-wrap') as HTMLElement;
            expect(tooltip?.style.paddingBottom).toBe('1rem');
        });
    });

    describe('clickable + contentsHover 조합', () => {
        it('clickable과 contentsHover가 모두 true일 때 클릭 후 툴팁으로 마우스를 옮겨도 툴팁이 유지된다', async () => {
            //given
            const wrapper = mount(VsTooltip, {
                slots: {
                    default: 'Hover Here!',
                    tooltip: 'Tooltip',
                },
                props: {
                    clickable: true,
                    contentsHover: true,
                },
                attachTo: document.body,
            });

            //when
            await wrapper.find('.vs-tooltip-trigger').trigger('click');
            await vi.advanceTimersByTimeAsync(0);

            await wrapper.find('.vs-tooltip-trigger').trigger('mouseenter');
            await vi.advanceTimersByTimeAsync(0);

            const tooltip = window.document.body.querySelector('.vs-tooltip-wrap');
            tooltip?.dispatchEvent(new Event('mouseenter'));

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });
    });
});
