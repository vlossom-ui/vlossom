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
        let wrapper: ReturnType<typeof mount<typeof VsTooltip>>;
        const targetId = 'test-trigger';

        beforeEach(() => {
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                },
                slots: {
                    default: 'Tooltip',
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
        });

        it('초기에는 tooltip이 노출되지 않는다', () => {
            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });

        it('trigger에 마우스를 올렸을 때 툴팁이 노출된다', async () => {
            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });

        it('trigger에 마우스를 올렸다가 뗐을 때 툴팁이 사라진다', async () => {
            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            trigger?.dispatchEvent(new Event('mouseleave'));
            await vi.advanceTimersByTimeAsync(250);

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });

        it('tooltip trigger에 focus가 잡히면 툴팁이 나타난다', async () => {
            //when
            const trigger = document.getElementById(targetId) as HTMLElement;
            trigger?.focus();
            trigger?.dispatchEvent(new Event('focusin'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
        });

        it('tooltip trigger에서 focus가 사라지면 툴팁이 사라진다', async () => {
            //when
            const trigger = document.getElementById(targetId) as HTMLElement;
            trigger?.focus();
            trigger?.dispatchEvent(new Event('focusin'));
            await vi.advanceTimersByTimeAsync(0);

            trigger?.blur();
            trigger?.dispatchEvent(new Event('focusout'));
            await vi.advanceTimersByTimeAsync(300);

            //then
            expect(wrapper.vm.isVisible).toBe(false);
        });
    });

    describe('placement', () => {
        it('placement을 설정하면 해당 위치에 tooltip이 붙는다', async () => {
            //given
            const targetId = 'test-trigger-placement';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    placement: 'bottom',
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(50); // wait for setPosition end (50ms)

            //then
            expect(wrapper.vm.computedPlacement).toBe('bottom');

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('align', () => {
        it('align을 설정하면 이에 맞게 tooltip이 정렬된다', async () => {
            //given
            const targetId = 'test-trigger-align';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    align: 'end',
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);
            const tooltip = window.document.body.querySelector('.vs-tooltip');
            expect(tooltip?.classList.contains('vs-align-end')).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('clickable', () => {
        it('clickable이 true일 때 trigger를 클릭하면 툴팁이 노출된다', async () => {
            //given
            const targetId = 'test-trigger-clickable';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Click me';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    clickable: true,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('click'));
            await vi.advanceTimersByTimeAsync(0);

            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('contents hover', () => {
        it('contentsHover가 true일 때 trigger에 hover한 후 tooltip으로 마우스를 옮겨도 툴팁이 유지된다', async () => {
            //given
            const targetId = 'test-trigger-contents-hover';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    contentsHover: true,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);
            const tooltip = window.document.body.querySelector('.vs-tooltip');
            tooltip?.dispatchEvent(new Event('mouseenter', { bubbles: true }));

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('disabled', () => {
        it('disabled가 true일 때는 trigger에 마우스를 올려도 툴팁이 노출되지 않는다', async () => {
            //given
            const targetId = 'test-trigger-disabled';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    disabled: true,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            expect(wrapper.vm.isVisible).toBe(false);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('enterDelay', () => {
        it('enterDelay가 설정되면 해당 시간만큼 지연 후 툴팁이 나타난다', async () => {
            //given
            const targetId = 'test-trigger-enter-delay';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    enterDelay: 100,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(50); // 아직 지연 시간이 지나지 않음

            //then
            expect(wrapper.vm.isVisible).toBe(false);

            //when
            await vi.advanceTimersByTimeAsync(60); // 지연 시간이 지남

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });

        it('enterDelay 중에 마우스가 벗어나면 툴팁이 나타나지 않는다', async () => {
            //given
            const targetId = 'test-trigger-enter-delay-2';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    enterDelay: 100,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(50);

            trigger?.dispatchEvent(new Event('mouseleave'));
            await vi.advanceTimersByTimeAsync(60);

            //then
            expect(wrapper.vm.isVisible).toBe(false);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('leaveDelay', () => {
        it('leaveDelay가 설정되면 해당 시간만큼 지연 후 툴팁이 사라진다', async () => {
            //given
            const targetId = 'test-trigger-leave-delay';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    leaveDelay: 100,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            trigger?.dispatchEvent(new Event('mouseleave'));
            await vi.advanceTimersByTimeAsync(50); // 아직 지연 시간이 지나지 않음

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //when
            await vi.advanceTimersByTimeAsync(60); // leaveDelay 100ms + 애니메이션 250ms = 350ms 총 필요
            await vi.advanceTimersByTimeAsync(250); // 애니메이션 대기 시간 추가

            //then
            expect(wrapper.vm.isVisible).toBe(false);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });

        it('leaveDelay 중에 마우스가 다시 들어오면 툴팁이 유지된다', async () => {
            //given
            const targetId = 'test-trigger-leave-delay-2';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    leaveDelay: 100,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            trigger?.dispatchEvent(new Event('mouseleave'));
            await vi.advanceTimersByTimeAsync(50);

            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(60);

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('noAnimation', () => {
        it('noAnimation이 true일 때 애니메이션 클래스가 적용되지 않는다', async () => {
            //given
            const targetId = 'test-trigger-no-animation';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    noAnimation: true,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip-contents');
            expect(tooltip?.classList.contains('fade-in-top')).toBe(false);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });

        it('noAnimation이 false일 때 애니메이션 클래스가 적용된다', async () => {
            //given
            const targetId = 'test-trigger-no-animation-2';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    noAnimation: false,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip-contents');
            expect(tooltip?.classList.contains('fade-in-top')).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('margin', () => {
        it('margin이 설정되면 해당 값으로 padding이 적용된다', async () => {
            //given
            const targetId = 'test-trigger-margin';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    margin: '1rem',
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip') as HTMLElement;
            expect(tooltip?.style.paddingBottom).toBe('1rem');

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });

    describe('clickable + contentsHover 조합', () => {
        it('clickable과 contentsHover가 모두 true일 때 클릭 후 툴팁으로 마우스를 옮겨도 툴팁이 유지된다', async () => {
            //given
            const targetId = 'test-trigger-clickable-contents-hover';
            const button = document.createElement('button');
            button.id = targetId;
            button.textContent = 'Hover Here!';
            document.body.appendChild(button);

            const wrapper = mount(VsTooltip, {
                props: {
                    targetId,
                    clickable: true,
                    contentsHover: true,
                },
                slots: {
                    default: 'Tooltip',
                },
                attachTo: document.body,
            });

            //when
            const trigger = document.getElementById(targetId);
            trigger?.dispatchEvent(new Event('click'));
            await vi.advanceTimersByTimeAsync(0);

            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);

            const tooltip = window.document.body.querySelector('.vs-tooltip');
            tooltip?.dispatchEvent(new Event('mouseenter', { bubbles: true }));

            //then
            expect(wrapper.vm.isVisible).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
        });
    });
});
