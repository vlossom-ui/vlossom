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

    describe('clear', () => {
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

    describe('methods', () => {
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

        it('clear() 메서드 호출 시 input 값이 초기화되어야 한다', () => {
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

    describe('string modifiers', () => {
        it('capitalize modifier가 적용되면 첫 글자가 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: '',
                    modelModifiers: { capitalize: true },
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('test');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Test']);
        });

        it('upper modifier가 적용되면 대문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: '',
                    modelModifiers: { upper: true },
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('test');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['TEST']);
        });

        it('lower modifier가 적용되면 소문자로 변환되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: '',
                    modelModifiers: { lower: true },
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('TEST');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test']);
        });
    });

    describe('rules', () => {
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
