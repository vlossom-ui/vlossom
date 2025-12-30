import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsInput from '../VsInput.vue';

describe('VsInput', () => {
    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    styleSet: {
                        backgroundColor: '#f0f0f0',
                        height: '50px',
                        fontSize: '16px',
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style).toEqual({
                '--vs-input-backgroundColor': '#f0f0f0',
                '--vs-input-height': '50px',
                '--vs-input-fontSize': '16px',
            });
        });
    });

    describe('v-model', () => {
        it('input 값 변경 시 update:modelValue 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: '',
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('new value');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
        });

        it('modelValue의 타입이 string이 아니면 string 타입으로 가공해준다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: 123,
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.element.value).toBe('123');
        });

        it('modelValue에 null을 할당하면 빈 문자열로 가공해준다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: null,
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.element.value).toBe('');
        });
    });

    describe('props', () => {
        it('disabled prop이 true일 때 vs-disabled 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    disabled: true,
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-disabled');
        });

        it('readonly prop이 true일 때 vs-readonly 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    readonly: true,
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-readonly');
        });

        it('disabled나 readonly가 아닐 때 vs-focus-visible 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    disabled: false,
                    readonly: false,
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-focus-visible');
        });

        it('small prop이 true일 때 vs-small 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    small: true,
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-small');
        });

        it('placeholder를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    placeholder: 'Enter text here',
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('placeholder')).toBe('Enter text here');
        });

        it('name을 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    name: 'username',
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('name')).toBe('username');
        });

        it('required 상태를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    required: true,
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('aria-required')).toBe('true');
        });

        it('autocomplete을 설정할 수 있다', () => {
            // given
            const wrapperOff = mount(VsInput, {
                props: {
                    autocomplete: false,
                },
            });
            const wrapperOn = mount(VsInput, {
                props: {
                    autocomplete: true,
                },
            });

            // then
            expect(wrapperOff.find('input').attributes('autocomplete')).toBe('off');
            expect(wrapperOn.find('input').attributes('autocomplete')).toBe('on');
        });
    });

    describe('state', () => {
        it('state를 error로 설정하면 vs-state-error 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    state: 'error',
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-state-error');
        });

        it('state를 warning으로 설정하면 vs-state-warning 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    state: 'warning',
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-state-warning');
        });

        it('state를 success로 설정하면 vs-state-success 클래스가 추가되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    state: 'success',
                },
            });

            // then
            const vsInput = wrapper.find('.vs-input');
            expect(vsInput.classes()).toContain('vs-state-success');
        });
    });

    describe('validation (rules)', () => {
        it('required 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsInput, {
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

        it('validation 성공 시 메시지가 없고 에러 상태가 아니어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
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
            const customRule = (value: string | number | null) => {
                if (value === 'test') {
                    return 'custom error message';
                }
                return '';
            };

            const wrapper = mount(VsInput, {
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
            const wrapper = mount(VsInput, {
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
            const wrapper = mount(VsInput, {
                props: {
                    required: true,
                    modelValue: '',
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });
    });

    describe('clear() 메서드', () => {
        it('clear 메서드 호출 시 input 값이 초기화되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: 'test value',
                },
            });

            // when
            wrapper.vm.clear();

            // then
            expect(wrapper.vm.inputValue).toBe('');
        });
    });

    describe('prepend/append styleSet', () => {
        it('prepend와 append styleSet이 주어지면 해당 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    styleSet: {
                        prepend: {
                            backgroundColor: '#e0e0e0',
                            padding: '0 1.5rem',
                            opacity: 0.8,
                        },
                        append: {
                            backgroundColor: '#d0d0d0',
                            padding: '0 2rem',
                            opacity: 0.9,
                        },
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style).toEqual({
                '--vs-input-prepend-backgroundColor': '#e0e0e0',
                '--vs-input-prepend-padding': '0 1.5rem',
                '--vs-input-prepend-opacity': 0.8,
                '--vs-input-append-backgroundColor': '#d0d0d0',
                '--vs-input-append-padding': '0 2rem',
                '--vs-input-append-opacity': 0.9,
            });
        });
    });

    describe('type별 동작', () => {
        it('type이 number일 때 숫자 문자열을 숫자로 변환해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    modelValue: null,
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('123');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([123]);
        });

        it('type이 number이고 빈 문자열이 입력되면 null을 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    modelValue: 123,
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
        });

        it('input type이 number가 아닐 때 max 길이 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'text',
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

        it('input type이 number가 아닐 때 min 길이 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'text',
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

        it('input type이 number 일 때 max 값 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    max: 100,
                    modelValue: 150,
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(false);
            expect(wrapper.vm.computedMessages.length).toBeGreaterThan(0);
            expect(wrapper.vm.computedMessages[0].state).toBe('error');
            expect(wrapper.vm.computedMessages[0].text).toBe('max value: 100');
            expect(wrapper.vm.shake).toBe(true);
        });

        it('input type이 number 일 때 min 값 체크가 가능하다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    min: 10,
                    modelValue: 5,
                },
            });

            // when
            const isValid = wrapper.vm.validate();

            // then
            expect(isValid).toBe(false);
            expect(wrapper.vm.computedMessages.length).toBeGreaterThan(0);
            expect(wrapper.vm.computedMessages[0].state).toBe('error');
            expect(wrapper.vm.computedMessages[0].text).toBe('min value: 10');
            expect(wrapper.vm.shake).toBe(true);
        });
    });

    describe('clear 버튼', () => {
        it('noClear prop이 true이면 clear 버튼이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    noClear: true,
                },
            });

            // then
            const clearButton = wrapper.find('.vs-clear-button');
            expect(clearButton.exists()).toBe(false);
        });

        it('readonly 상태일 때 clear 버튼이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    readonly: true,
                    modelValue: 'test',
                },
            });

            // then
            const clearButton = wrapper.find('.vs-clear-button');
            expect(clearButton.exists()).toBe(false);
        });

        it('disabled 상태일 때 clear 버튼이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    disabled: true,
                    modelValue: 'test',
                },
            });

            // then
            const clearButton = wrapper.find('.vs-clear-button');
            expect(clearButton.exists()).toBe(false);
        });

        it('clear 버튼 클릭 시 text type은 빈 문자열로 초기화되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'text',
                    modelValue: 'test value',
                },
            });

            // when
            const clearButton = wrapper.find('.vs-clear-button');
            await clearButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
        });

        it('clear 버튼 클릭 시 number type은 null로 초기화되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    modelValue: 123,
                },
            });

            // when
            const clearButton = wrapper.find('.vs-clear-button');
            await clearButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
        });
    });

    describe('focus/blur/select 메서드', () => {
        it('focus() 메서드 호출 시 input element에 focus가 적용되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                attachTo: document.body,
            });
            const input = wrapper.find('input').element;

            // when
            wrapper.vm.focus();

            // then
            expect(document.activeElement).toBe(input);

            // cleanup
            wrapper.unmount();
        });

        it('blur() 메서드 호출 시 input element에서 focus가 해제되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                attachTo: document.body,
            });
            const input = wrapper.find('input').element;
            wrapper.vm.focus();

            // when
            wrapper.vm.blur();

            // then
            expect(document.activeElement).not.toBe(input);

            // cleanup
            wrapper.unmount();
        });

        it('select() 메서드 호출 시 input의 텍스트가 선택되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: 'test value',
                },
                attachTo: document.body,
            });
            const input = wrapper.find('input').element;

            // when
            wrapper.vm.select();

            // then
            expect(input.selectionStart).toBe(0);
            expect(input.selectionEnd).toBe(input.value.length);

            // cleanup
            wrapper.unmount();
        });
    });

    describe('이벤트 emit', () => {
        it('input에 focus 이벤트가 발생하면 focus 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                attachTo: document.body,
            });
            const input = wrapper.find('input');

            // when
            await input.trigger('focus');

            // then
            const focusEvents = wrapper.emitted('focus');
            expect(focusEvents).toBeTruthy();
            expect(focusEvents?.length).toBe(1);
            expect(focusEvents?.[0][0]).toBeInstanceOf(FocusEvent);

            // cleanup
            wrapper.unmount();
        });

        it('input에 blur 이벤트가 발생하면 blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                attachTo: document.body,
            });
            const input = wrapper.find('input');

            // when
            await input.trigger('focus');
            await input.trigger('blur');

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
            const wrapper = mount(VsInput, {
                props: {
                    disabled: true,
                },
                attachTo: document.body,
            });
            const input = wrapper.find('input');

            // when
            await input.trigger('focus');
            await input.trigger('blur');

            // then
            expect(wrapper.emitted('focus')).toBeUndefined();
            expect(wrapper.emitted('blur')).toBeUndefined();

            // cleanup
            wrapper.unmount();
        });

        it('readonly 상태에서는 focus/blur 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    readonly: true,
                },
                attachTo: document.body,
            });
            const input = wrapper.find('input');

            // when
            await input.trigger('focus');
            await input.trigger('blur');

            // then
            expect(wrapper.emitted('focus')).toBeTruthy();
            expect(wrapper.emitted('blur')).toBeTruthy();

            // cleanup
            wrapper.unmount();
        });

        it('focus() 메서드 호출 시에도 네이티브 focus 이벤트가 발생하여 focus 이벤트를 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
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
            const wrapper = mount(VsInput, {
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
    });

    describe('외부에서 modelValue 변경 시 convertValue 적용', () => {
        it('type이 number일 때 외부에서 문자열을 전달하면 숫자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    modelValue: 0,
                },
            });

            // when
            await wrapper.setProps({ modelValue: '456' });

            // then
            const input = wrapper.find('input');
            expect(wrapper.vm.inputValue).toBe(456);
            expect(input.element.value).toBe('456');
        });

        it('type이 number일 때 외부에서 null을 전달하면 null로 유지되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    modelValue: 123,
                },
            });

            // when
            await wrapper.setProps({ modelValue: null });

            // then
            expect(wrapper.vm.inputValue).toBe(null);
        });

        it('type이 number일 때 외부에서 빈 문자열을 전달하면 null로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'number',
                    modelValue: 123,
                },
            });

            // when
            await wrapper.setProps({ modelValue: '' });

            // then
            expect(wrapper.vm.inputValue).toBe(null);
        });

        it('upper modifier가 있을 때 외부에서 소문자를 전달하면 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
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
            const wrapper = mount(VsInput, {
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
            const wrapper = mount(VsInput, {
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

        it('type이 text일 때 외부에서 숫자를 전달하면 문자열로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'text',
                    modelValue: '',
                },
            });

            // when
            await wrapper.setProps({ modelValue: 999 });

            // then
            expect(wrapper.vm.inputValue).toBe('999');
            expect(typeof wrapper.vm.inputValue).toBe('string');
        });
    });
});
