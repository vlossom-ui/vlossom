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

function mountWith(slots: any = undefined, props: any = {}) {
    return mount(VsFocusTrap, {
        slots,
        props,
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

    describe('autofocus', () => {
        it('autofocus 속성을 가진 요소가 있으면, 마운트 시 앵커 대신 그 요소에 focus를 준다', async () => {
            // given, when
            const wrapper = mountWith({
                default: defineComponent({ template: '<div><input /><button autofocus>OK</button></div>' }),
            });
            await nextTick();

            // then
            expect(document.activeElement).toBe(wrapper.find('button').element);
        });

        it('autofocus 속성을 가진 요소가 focusable이 아니면, 그 안의 첫번째 포커스 가능한 요소에 focus를 준다', async () => {
            // given, when
            const wrapper = mountWith({
                default: defineComponent({
                    template: '<div><button>Cancel</button><div autofocus><input /></div></div>',
                }),
            });
            await nextTick();

            // then
            expect(document.activeElement).toBe(wrapper.find('input').element);
        });

        it('autofocus 요소가 focus를 받을 수 없으면, 앵커에 focus가 남는다', async () => {
            // given, when
            const wrapper = mountWith({
                default: defineComponent({ template: '<div><input disabled autofocus /><button>OK</button></div>' }),
            });
            await nextTick();

            // then
            expect(document.activeElement).toBe(wrapper.find('#vs-focus-trap-anchor').element);
        });

        it('중첩된 focus trap 안의 autofocus 요소는 바깥 focus trap의 autofocus 대상에서 제외한다', async () => {
            // given, when
            mountWith({
                default: defineComponent({
                    components: { VsFocusTrap },
                    template: `
                        <div>
                            <vs-focus-trap><div><button autofocus>inner</button></div></vs-focus-trap>
                            <button autofocus>outer</button>
                        </div>
                    `,
                }),
            });
            await nextTick();
            await nextTick();

            // then
            expect(document.activeElement?.textContent).toBe('outer');
        });

        it('마운트 시점에 이미 내부 요소에 focus가 있으면, autofocus 요소로 focus를 옮기지 않는다', async () => {
            // given, when
            const wrapper = mountWith({
                default: defineComponent({
                    template: '<div><textarea ref="textareaRef" /><button autofocus>OK</button></div>',
                    mounted() {
                        (this.$refs.textareaRef as HTMLTextAreaElement).focus();
                    },
                }),
            });
            await nextTick();

            // then
            expect(document.activeElement).toBe(wrapper.find('textarea').element);
        });
    });

    describe('cycle tab focus', () => {
        it('포커스 가능한 마지막 요소에서 tab 이벤트가 동작하면, 첫번째 포커스 가능한 요소에 focus를 준다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when
            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
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
            const focusTrap = wrapper.find('.vs-focus-trap');
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when
            firstFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                    shiftKey: true,
                }),
            );

            // then
            expect(lastFocusable.element).toBe(document.activeElement);
        });
    });

    describe('disabled prop', () => {
        it('disabled가 true일 때, tab 키 이벤트가 포커스 순환을 하지 않아야 한다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent }, { disabled: true });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when
            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then
            // disabled가 true이면 포커스 순환이 일어나지 않아야 함
            expect(lastFocusable.element).toBe(document.activeElement);
        });

        it('disabled가 false일 때, tab 키 이벤트가 포커스 순환을 해야 한다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent }, { disabled: false });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when
            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then
            expect(firstFocusable.element).toBe(document.activeElement);
        });

        it('disabled가 true에서 false로 변경되면 포커스 순환이 활성화되어야 한다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent }, { disabled: true });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when - disabled를 false로 변경
            await wrapper.setProps({ disabled: false });
            await nextTick();

            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then
            expect(firstFocusable.element).toBe(document.activeElement);
        });

        it('disabled가 false에서 true로 변경되면 포커스 순환이 비활성화되어야 한다', async () => {
            // given
            const wrapper = mountWith({ default: FocusableComponent }, { disabled: false });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const lastFocusable = wrapper.find('button');
            await nextTick();

            // when - disabled를 true로 변경
            await wrapper.setProps({ disabled: true });
            await nextTick();

            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then - 포커스 순환이 일어나지 않아야 함
            expect(lastFocusable.element).toBe(document.activeElement);
        });
    });

    describe('catchFocusables filter', () => {
        it('display: none인 요소는 포커스 가능한 요소에서 제외되어야 한다', async () => {
            // given
            const ComponentWithHidden = defineComponent({
                template: `
                    <div>
                        <input ref="inputRef" placeholder="첫번째 요소" />
                        <button ref="buttonRef" style="display: none;">숨겨진 버튼</button>
                        <button ref="lastButtonRef">마지막 요소</button>
                    </div>
                `,
            });
            const wrapper = mountWith({ default: ComponentWithHidden });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.findAll('button').filter((btn) => btn.element.style.display !== 'none')[0];
            await nextTick();

            // when
            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then
            expect(firstFocusable.element).toBe(document.activeElement);
        });

        it('disabled 속성을 가진 요소는 포커스 가능한 요소에서 제외되어야 한다', async () => {
            // given
            const ComponentWithDisabled = defineComponent({
                template: `
                    <div>
                        <input ref="inputRef" placeholder="첫번째 요소" />
                        <button ref="buttonRef" disabled>비활성화된 버튼</button>
                        <button ref="lastButtonRef">마지막 요소</button>
                    </div>
                `,
            });
            const wrapper = mountWith({ default: ComponentWithDisabled });
            const focusTrap = wrapper.find('.vs-focus-trap');
            const firstFocusable = wrapper.find('input');
            const lastFocusable = wrapper.findAll('button').filter((btn) => !btn.element.hasAttribute('disabled'))[0];
            await nextTick();

            // when
            lastFocusable.element.focus();
            focusTrap.element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Tab',
                }),
            );

            // then
            expect(firstFocusable.element).toBe(document.activeElement);
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
