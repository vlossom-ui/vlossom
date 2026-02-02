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
                    target: `#${targetId}`,
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
            const overlay = document.querySelector('#vs-floating-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        });

        it('초기에는 tooltip이 노출되지 않는다', () => {
            //then
            expect(wrapper.vm.computedShow).toBe(false);
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
                    target: `#${targetId}`,
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
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            const tooltip = window.document.body.querySelector('.vs-tooltip');
            expect(tooltip?.classList.contains('vs-placement-bottom')).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
            const overlay = document.querySelector('#vs-floating-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
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
                    target: `#${targetId}`,
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
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);
            const tooltip = window.document.body.querySelector('.vs-tooltip');
            expect(tooltip?.classList.contains('vs-align-end')).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
            const overlay = document.querySelector('#vs-floating-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
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
                    target: `#${targetId}`,
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
            await wrapper.vm.$nextTick();

            trigger?.dispatchEvent(new Event('mouseenter'));
            await vi.advanceTimersByTimeAsync(0);
            await wrapper.vm.$nextTick();

            //then
            expect(wrapper.vm.computedShow).toBe(true);

            //cleanup
            wrapper.unmount();
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
            const overlay = document.querySelector('#vs-floating-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
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
                    target: `#${targetId}`,
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
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
            const overlay = document.querySelector('#vs-floating-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
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
                    target: `#${targetId}`,
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
            await wrapper.vm.$nextTick();

            trigger?.dispatchEvent(new Event('mouseenter'));
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
            const btn = document.getElementById(targetId);
            if (btn) {
                document.body.removeChild(btn);
            }
            const overlay = document.querySelector('#vs-floating-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
        });
    });
});
