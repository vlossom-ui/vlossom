import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, defineComponent } from 'vue';
import VsFocusTrap from './../VsFocusTrap.vue';

const FocusableComponent = defineComponent({
    template: `
        <div>
            <input ref="inputRef" placeholder="input, 첫번째 요소" />
            <button ref="buttonRef">button 두번째 요소</button>
        </div>
    `,
});

function mountWith(slots: any = undefined) {
    return mount(VsFocusTrap, {
        slots,
        attachTo: document.body,
    });
}

describe('VsFocusTrap', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('컴퍼넌트가 정상적으로 마운트 되기 위해, `slots.default` 속성이 반드시 포함되어야 한다', async () => {
        // given, when
        const slotsDefault = mountWith({ default: FocusableComponent });
        const slotsUndefined = mountWith(/* empty slots */);
        await nextTick();

        // then
        expect(slotsDefault.html()).toBeTruthy();
        expect(slotsUndefined.html()).toBeFalsy();
    });
    it('컴퍼넌트가 정상적으로 마운트 되면, 컴퍼넌트 내부에 포커스 시작점(anchor) 역할을 하는 요소가 생성되어야 한다', async () => {
        // given, when
        const wrapper = mountWith({ default: FocusableComponent });
        await nextTick();

        // then
        expect(wrapper.find('#vs-focus-trap-anchor').exists()).toBe(true);
        expect(wrapper.find('#vs-focus-trap-anchor').element).toBe(document.activeElement);
    });

    describe('cycle tab focus', () => {
        it('포커스 가능한 마지막 요소에서 tab 이벤트가 동작하면, 첫번째 포커스 가능한 요소에 focus를 준다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent });
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when
            lastFocusable.element.focus();
            lastFocusable.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then
            expect(firstFocusable.element).toBe(document.activeElement);
        });

        it('포커스 가능한 첫번째 요소에서 shift + tab 이벤트가 동작하면, 마지막 포커스 가능한 요소에 focus를 준다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent });
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when
            firstFocusable.element.focus();
            firstFocusable.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                    shiftKey: true,
                }),
            );

            // then
            expect(lastFocusable.element).toBe(document.activeElement);
        });

        describe('`disabled` prop', () => {
            it('`disabled` prop이 true인 경우, tab 이벤트로 focus가 컴퍼넌트 내부에서 cycle되지 않는다', async () => {
                // given
                const wrapper = mountWith({ default: FocusableComponent });
                const firstFocusable = wrapper.find('input');
                const lastFocusable = wrapper.find('button');
                await wrapper.setProps({ disabled: true });
                await nextTick();

                // when
                firstFocusable.element.focus();
                firstFocusable.element.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'Tab',
                        shiftKey: true,
                    }),
                );

                // then
                expect(firstFocusable.element).toBe(document.activeElement);
                expect(lastFocusable.element).not.toBe(document.activeElement);
            });
        });
    });

    describe('return focus', () => {
        it('컴퍼넌트가 마운트 되기 전에 focus되었던 요소에 focus를 반환해야 한다', async () => {
            // given
            const button = document.createElement('button');
            document.body.appendChild(button);
            button.focus();

            const wrapper = mountWith({ default: FocusableComponent });
            await nextTick();

            // when
            wrapper.unmount();

            // then
            expect(button).toBe(document.activeElement);
        });
    });
});
