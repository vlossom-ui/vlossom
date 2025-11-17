import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsTextarea from '../VsTextarea.vue';

describe('VsTextarea', () => {
    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTextarea, {
                props: {
                    styleSet: {
                        backgroundColor: '#f0f0f0',
                        height: '10rem',
                        fontSize: '16px',
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style).toEqual({
                '--vs-textarea-backgroundColor': '#f0f0f0',
                '--vs-textarea-height': '10rem',
                '--vs-textarea-fontSize': '16px',
            });
        });
    });

    describe('v-model', () => {
        it('textarea 값 변경 시 update:modelValue 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                },
            });

            // when
            const textarea = wrapper.find('textarea');
            await textarea.setValue('new value');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
        });

        it('modelValue의 타입이 string이 아니면 string 타입으로 가공해준다', () => {
            // given, when
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: 123 as any,
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.element.value).toBe('123');
        });

        it('modelValue에 null을 할당하면 빈 문자열로 가공해준다', () => {
            // given, when
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: null as any,
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.element.value).toBe('');
        });

        it('빈 문자열이 입력되면 빈 문자열을 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: 'some text',
                },
            });

            // when
            const textarea = wrapper.find('textarea');
            await textarea.setValue('');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
        });
    });

    describe('props', () => {
        it('disabled prop이 true일 때 vs-disabled 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    disabled: true,
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-disabled');
        });

        it('readonly prop이 true일 때 vs-readonly 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    readonly: true,
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-readonly');
        });

        it('disabled나 readonly가 아닐 때 vs-focusable 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    disabled: false,
                    readonly: false,
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-focusable');
        });

        it('small prop이 true일 때 vs-small 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    small: true,
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-small');
        });

        it('placeholder를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    placeholder: 'Enter text here',
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('placeholder')).toBe('Enter text here');
        });

        it('disabled 상태를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    disabled: true,
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('disabled')).toBeDefined();
        });

        it('readonly 상태를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    readonly: true,
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('readonly')).toBeDefined();
        });

        it('required 상태를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    required: true,
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('aria-required')).toBe('true');
        });

        it('autocomplete을 설정할 수 있다', () => {
            // given
            const wrapperOff = mount(VsTextarea, {
                props: {
                    autocomplete: false,
                },
            });
            const wrapperOn = mount(VsTextarea, {
                props: {
                    autocomplete: true,
                },
            });

            // then
            expect(wrapperOff.find('textarea').attributes('autocomplete')).toBe('off');
            expect(wrapperOn.find('textarea').attributes('autocomplete')).toBe('on');
        });

        it('name을 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    name: 'description',
                },
            });

            // then
            const textarea = wrapper.find('textarea');
            expect(textarea.attributes('name')).toBe('description');
        });
    });

    describe('state', () => {
        it('state를 error로 설정하면 vs-state-error 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    state: 'error',
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-state-error');
        });

        it('state를 warning으로 설정하면 vs-state-warning 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    state: 'warning',
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-state-warning');
        });

        it('state를 success로 설정하면 vs-state-success 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    state: 'success',
                },
            });

            // then
            const vsTextarea = wrapper.find('.vs-textarea');
            expect(vsTextarea.classes()).toContain('vs-state-success');
        });
    });

    describe('validation (rules)', () => {
        it('required 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    required: true,
                    modelValue: '',
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(false);
            expect(wrapper.vm.computedMessages.length).toBeGreaterThan(0);
            expect(wrapper.vm.computedMessages[0].state).toBe('error');
            expect(wrapper.vm.computedMessages[0].text).toBe('required');
            expect(wrapper.vm.shake).toBe(true);
        });

        it('max 길이 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    max: 5,
                    modelValue: '123456',
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(false);
            expect(wrapper.vm.computedMessages.length).toBeGreaterThan(0);
            expect(wrapper.vm.computedMessages[0].state).toBe('error');
            expect(wrapper.vm.computedMessages[0].text).toBe('max length: 5');
            expect(wrapper.vm.shake).toBe(true);
        });

        it('min 길이 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    min: 3,
                    modelValue: 'ab',
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(false);
            expect(wrapper.vm.computedMessages.length).toBeGreaterThan(0);
            expect(wrapper.vm.computedMessages[0].state).toBe('error');
            expect(wrapper.vm.computedMessages[0].text).toBe('min length: 3');
            expect(wrapper.vm.shake).toBe(true);
        });

        it('validation 성공 시 메시지가 없고 에러 상태가 아니어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    required: true,
                    min: 2,
                    max: 10,
                    modelValue: 'valid',
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(true);
            expect(wrapper.vm.shake).toBe(false);
        });

        it('custom rule 적용 시 메시지가 올바르게 표시되어야 한다', () => {
            // given
            const customRule = (value: string) => {
                if (value === 'test') {
                    return 'custom error message';
                }
                return '';
            };

            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: 'test',
                    rules: [customRule],
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(false);
            expect(wrapper.vm.computedMessages.length).toBeGreaterThan(0);
            expect(wrapper.vm.computedMessages[0].state).toBe('error');
            expect(wrapper.vm.computedMessages[0].text).toBe('custom error message');
            expect(wrapper.vm.shake).toBe(true);
        });
    });

    describe('validate() 메서드', () => {
        it('valid할 때 validate 함수를 호출하면 true를 반환한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    required: true,
                    modelValue: 'test',
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });

        it('invalid할 때 validate 함수를 호출하면 false를 반환한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    required: true,
                    modelValue: '',
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });
    });

    describe('v-model modifiers', () => {
        it('upper modifier가 있을 때 사용자 입력이 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                    modelModifiers: { upper: true },
                },
            });

            // when
            const textarea = wrapper.find('textarea');
            await textarea.setValue('hello world');

            // then
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['HELLO WORLD']);
        });

        it('lower modifier가 있을 때 사용자 입력이 소문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                    modelModifiers: { lower: true },
                },
            });

            // when
            const textarea = wrapper.find('textarea');
            await textarea.setValue('HELLO WORLD');

            // then
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['hello world']);
        });

        it('capitalize modifier가 있을 때 사용자 입력의 첫 글자가 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                    modelModifiers: { capitalize: true },
                },
            });

            // when
            const textarea = wrapper.find('textarea');
            await textarea.setValue('hello');

            // then
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello']);
        });
    });

    describe('이벤트 emit', () => {
        it('textarea에 focus 이벤트가 발생하면 focus 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea');

            // when
            await textarea.trigger('focus');

            // then
            const focusEvents = wrapper.emitted('focus');
            expect(focusEvents).toBeTruthy();
            expect(focusEvents?.length).toBe(1);
            expect(focusEvents?.[0][0]).toBeInstanceOf(FocusEvent);

            // cleanup
            wrapper.unmount();
        });

        it('textarea에 blur 이벤트가 발생하면 blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea');

            // when
            await textarea.trigger('focus');
            await textarea.trigger('blur');

            // then
            const blurEvents = wrapper.emitted('blur');
            expect(blurEvents).toBeTruthy();
            expect(blurEvents?.length).toBe(1);
            expect(blurEvents?.[0][0]).toBeInstanceOf(FocusEvent);

            // cleanup
            wrapper.unmount();
        });

        it('disabled 상태에서는 focus/blur 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    disabled: true,
                },
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea');

            // when
            await textarea.trigger('focus');
            await textarea.trigger('blur');

            // then
            expect(wrapper.emitted('focus')).toBeUndefined();
            expect(wrapper.emitted('blur')).toBeUndefined();

            // cleanup
            wrapper.unmount();
        });

        it('readonly 상태에서는 focus/blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    readonly: true,
                },
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea');

            // when
            await textarea.trigger('focus');
            await textarea.trigger('blur');

            // then
            expect(wrapper.emitted('focus')).toBeTruthy();
            expect(wrapper.emitted('blur')).toBeTruthy();

            // cleanup
            wrapper.unmount();
        });

        it('focus() 메서드 호출 시에도 네이티브 focus 이벤트가 발생하여 focus 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });

            // when
            wrapper.vm.focus();
            await wrapper.vm.$nextTick();

            // then
            const focusEvents = wrapper.emitted('focus');
            expect(focusEvents).toBeTruthy();
            expect(focusEvents?.length).toBe(1);

            // cleanup
            wrapper.unmount();
        });

        it('blur() 메서드 호출 시에도 네이티브 blur 이벤트가 발생하여 blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });
            wrapper.vm.focus();
            await wrapper.vm.$nextTick();

            // when
            wrapper.vm.blur();
            await wrapper.vm.$nextTick();

            // then
            const blurEvents = wrapper.emitted('blur');
            expect(blurEvents).toBeTruthy();
            expect(blurEvents?.length).toBe(1);

            // cleanup
            wrapper.unmount();
        });

        it('textarea에서 Enter 키를 누르면 enter 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea');

            // when
            await textarea.trigger('keyup.enter');

            // then
            const enterEvents = wrapper.emitted('enter');
            expect(enterEvents).toBeTruthy();
            expect(enterEvents?.length).toBe(1);
            expect(enterEvents?.[0][0]).toBeInstanceOf(KeyboardEvent);

            // cleanup
            wrapper.unmount();
        });
    });

    describe('focus/blur/select 메서드', () => {
        it('focus() 메서드 호출 시 textarea element에 focus가 적용되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea').element;

            // when
            wrapper.vm.focus();

            // then
            expect(document.activeElement).toBe(textarea);

            // cleanup
            wrapper.unmount();
        });

        it('blur() 메서드 호출 시 textarea element에서 focus가 해제되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea').element;
            wrapper.vm.focus();

            // when
            wrapper.vm.blur();

            // then
            expect(document.activeElement).not.toBe(textarea);

            // cleanup
            wrapper.unmount();
        });

        it('select() 메서드 호출 시 textarea의 텍스트가 선택되어야 한다', () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: 'test value',
                },
                attachTo: document.body,
            });
            const textarea = wrapper.find('textarea').element;

            // when
            wrapper.vm.select();

            // then
            expect(textarea.selectionStart).toBe(0);
            expect(textarea.selectionEnd).toBe(textarea.value.length);

            // cleanup
            wrapper.unmount();
        });
    });

    describe('외부에서 modelValue 변경 시 convertValue 적용', () => {
        it('외부에서 문자열을 전달하면 그대로 유지되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'new text' });

            // then
            const textarea = wrapper.find('textarea');
            expect(wrapper.vm.inputValue).toBe('new text');
            expect(textarea.element.value).toBe('new text');
        });

        it('외부에서 null을 전달하면 빈 문자열로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: 'some text',
                },
            });

            // when
            await wrapper.setProps({ modelValue: null as any });

            // then
            expect(wrapper.vm.inputValue).toBe('');
        });

        it('외부에서 빈 문자열을 전달하면 빈 문자열로 유지되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: 'some text',
                },
            });

            // when
            await wrapper.setProps({ modelValue: '' });

            // then
            expect(wrapper.vm.inputValue).toBe('');
        });

        it('upper modifier가 있을 때 외부에서 소문자를 전달하면 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                    modelModifiers: { upper: true },
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'hello world' });

            // then
            expect(wrapper.vm.inputValue).toBe('HELLO WORLD');
        });

        it('lower modifier가 있을 때 외부에서 대문자를 전달하면 소문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                    modelModifiers: { lower: true },
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'HELLO WORLD' });

            // then
            expect(wrapper.vm.inputValue).toBe('hello world');
        });

        it('capitalize modifier가 있을 때 외부에서 소문자를 전달하면 첫 글자가 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                    modelModifiers: { capitalize: true },
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'hello' });

            // then
            expect(wrapper.vm.inputValue).toBe('Hello');
        });

        it('외부에서 숫자를 전달하면 문자열로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextarea, {
                props: {
                    modelValue: '',
                },
            });

            // when
            await wrapper.setProps({ modelValue: 999 as any });

            // then
            expect(wrapper.vm.inputValue).toBe('999');
            expect(typeof wrapper.vm.inputValue).toBe('string');
        });
    });
});
