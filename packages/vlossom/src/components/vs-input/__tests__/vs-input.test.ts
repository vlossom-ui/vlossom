import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VsInput from '../VsInput.vue';

describe('VsInput', () => {
    describe('기본 props', () => {
        it('type prop이 주어지면 해당 type 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    type: 'email',
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('type')).toBe('email');
        });

        it('placeholder prop이 주어지면 placeholder 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    placeholder: '이름을 입력하세요',
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('placeholder')).toBe('이름을 입력하세요');
        });

        it('disabled prop이 true이면 disabled 속성과 vs-disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    disabled: true,
                },
            });

            // then
            const input = wrapper.find('input');
            const inputDiv = wrapper.find('.vs-input');
            expect(input.attributes('disabled')).toBeDefined();
            expect(inputDiv.classes()).toContain('vs-disabled');
        });

        it('readonly prop이 true이면 readonly 속성과 vs-readonly 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    readonly: true,
                },
            });

            // then
            const input = wrapper.find('input');
            const inputDiv = wrapper.find('.vs-input');
            expect(input.attributes('readonly')).toBeDefined();
            expect(inputDiv.classes()).toContain('vs-readonly');
        });

        it('required prop이 true이면 aria-required 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    required: true,
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('aria-required')).toBe('true');
        });

        it('small prop이 true이면 vs-small 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    small: true,
                },
            });

            // then
            const inputDiv = wrapper.find('.vs-input');
            expect(inputDiv.classes()).toContain('vs-small');
        });

        it('autocomplete prop이 true이면 autocomplete 속성이 on으로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    autocomplete: true,
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('autocomplete')).toBe('on');
        });

        it('autocomplete prop이 false이면 autocomplete 속성이 off로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    autocomplete: false,
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('autocomplete')).toBe('off');
        });

        it('name prop이 주어지면 name 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    name: 'username',
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.attributes('name')).toBe('username');
        });

        it('colorScheme이 주어지면 해당 colorScheme 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    colorScheme: 'blue',
                },
            });

            // then
            const inputDiv = wrapper.find('.vs-input');
            expect(inputDiv.classes()).toContain('vs-color-scheme-blue');
        });

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
            const inputDiv = wrapper.find('.vs-input');
            const style = inputDiv.attributes('style');
            expect(style).toContain('--vs-input-backgroundColor: #f0f0f0');
            expect(style).toContain('--vs-input-height: 50px');
            expect(style).toContain('--vs-input-fontSize: 16px');
        });
    });

    describe('v-model', () => {
        it('modelValue prop이 주어지면 input의 value가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: 'test value',
                },
            });

            // then
            const input = wrapper.find('input');
            expect(input.element.value).toBe('test value');
        });

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

        it('type이 text이고 빈 문자열이 입력되면 빈 문자열을 emit해야 한다', async () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    type: 'text',
                    modelValue: 'test',
                },
            });

            // when
            const input = wrapper.find('input');
            await input.setValue('');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
        });
    });

    describe('clear 버튼', () => {
        it('기본적으로 clear 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput);

            // then
            const clearButton = wrapper.find('.vs-clear-button');
            expect(clearButton.exists()).toBe(true);
        });

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

    describe('이벤트', () => {
        it('input focus 시 focus 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput);

            // when
            const input = wrapper.find('input');
            await input.trigger('focus');

            // then
            expect(wrapper.emitted('focus')).toBeTruthy();
        });

        it('input blur 시 blur 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput);

            // when
            const input = wrapper.find('input');
            await input.trigger('blur');

            // then
            expect(wrapper.emitted('blur')).toBeTruthy();
        });

        it('Enter 키 입력 시 enter 이벤트가 emit되어야 한다', async () => {
            // given
            const wrapper = mount(VsInput);

            // when
            const input = wrapper.find('input');
            await input.trigger('keyup.enter');

            // then
            expect(wrapper.emitted('enter')).toBeTruthy();
        });
    });

    describe('슬롯', () => {
        it('prepend 슬롯이 있으면 vs-prepend 영역이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                slots: {
                    prepend: '<span class="icon">🔍</span>',
                },
            });

            // then
            const prepend = wrapper.find('.vs-prepend');
            expect(prepend.exists()).toBe(true);
            expect(prepend.html()).toContain('🔍');
        });

        it('append 슬롯이 있으면 vs-append 영역이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                slots: {
                    append: '<span class="suffix">$</span>',
                },
            });

            // then
            const append = wrapper.find('.vs-append');
            expect(append.exists()).toBe(true);
            expect(append.html()).toContain('$');
        });

        it('label 슬롯이 있으면 커스텀 라벨이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                slots: {
                    label: '<span class="custom-label">커스텀 라벨</span>',
                },
            });

            // then
            expect(wrapper.html()).toContain('커스텀 라벨');
        });

        it('messages 슬롯이 있으면 커스텀 메시지가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                slots: {
                    messages: '<div class="custom-message">커스텀 메시지</div>',
                },
            });

            // then
            expect(wrapper.html()).toContain('커스텀 메시지');
        });
    });

    describe('methods', () => {
        it('focus() 메서드 호출 시 input에 focus가 되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, { attachTo: document.body });
            const focusSpy = vi.spyOn(wrapper.vm.inputRef as HTMLInputElement, 'focus');

            // when
            wrapper.vm.focus();

            // then
            expect(focusSpy).toHaveBeenCalled();

            wrapper.unmount();
        });

        it('blur() 메서드 호출 시 input에서 blur가 되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, { attachTo: document.body });
            const blurSpy = vi.spyOn(wrapper.vm.inputRef as HTMLInputElement, 'blur');

            // when
            wrapper.vm.blur();

            // then
            expect(blurSpy).toHaveBeenCalled();

            wrapper.unmount();
        });

        it('select() 메서드 호출 시 input 텍스트가 선택되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: 'test',
                },
                attachTo: document.body,
            });
            const selectSpy = vi.spyOn(wrapper.vm.inputRef as HTMLInputElement, 'select');

            // when
            wrapper.vm.select();

            // then
            expect(selectSpy).toHaveBeenCalled();

            wrapper.unmount();
        });

        it('clear() 메서드 호출 시 값이 초기화되어야 한다', () => {
            // given
            const wrapper = mount(VsInput, {
                props: {
                    modelValue: 'test',
                },
            });

            // when
            wrapper.vm.clear();

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
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

    describe('hidden prop', () => {
        it('hidden prop이 true이면 컴포넌트가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInput, {
                props: {
                    hidden: true,
                },
            });

            // then
            const inputWrapper = wrapper.find('.vs-input-wrapper');
            expect(inputWrapper.isVisible()).toBe(false);
        });
    });
});
