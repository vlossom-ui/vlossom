import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsSelect from './../VsSelect.vue';

describe('VsSelect', () => {
    const basicOptions = ['Apple', 'Banana', 'Orange'];
    const objectOptions = [
        { id: 1, name: 'Apple', disabled: false },
        { id: 2, name: 'Banana', disabled: false },
        { id: 3, name: 'Orange', disabled: true },
    ];

    describe('v-model', () => {
        it('modelValue를 변경하여 선택된 값을 업데이트할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'Apple' });

            // then
            expect(wrapper.props('modelValue')).toBe('Apple');
            expect(wrapper.vm.isEmpty).toBe(false);
        });

        it('단일 선택 모드에서 null 값을 설정할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: null });

            // then
            expect(wrapper.props('modelValue')).toBe(null);
            expect(wrapper.vm.isEmpty).toBe(true);
        });

        it('다중 선택 모드에서 배열 값을 설정할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: [],
                    multiple: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: ['Apple', 'Banana'] });

            // then
            expect(wrapper.props('modelValue')).toEqual(['Apple', 'Banana']);
            expect(wrapper.vm.isEmpty).toBe(false);
        });

        it('다중 선택 모드에서 빈 배열을 설정할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple'],
                    multiple: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: [] });

            // then
            expect(wrapper.props('modelValue')).toEqual([]);
            expect(wrapper.vm.isEmpty).toBe(true);
        });
    });

    describe('options', () => {
        it('문자열 배열 옵션을 렌더링할 수 있다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });

            // then
            expect(wrapper.vm.filteredOptions).toHaveLength(3);
            expect(wrapper.vm.filteredOptions[0].label).toBe('Apple');
            expect(wrapper.vm.filteredOptions[0].value).toBe('Apple');
        });

        it('객체 배열 옵션을 렌더링할 수 있다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: objectOptions,
                    optionLabel: 'name',
                    optionValue: 'id',
                    modelValue: null,
                },
            });

            // then
            expect(wrapper.vm.filteredOptions).toHaveLength(3);
            expect(wrapper.vm.filteredOptions[0].label).toBe('Apple');
            expect(wrapper.vm.filteredOptions[0].value).toBe(1);
        });

        it('빈 배열 옵션을 전달하면 표시할 옵션이 없다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: [],
                    modelValue: null,
                },
            });

            // then
            expect(wrapper.vm.filteredOptions).toHaveLength(0);
        });

        it('disabled 옵션이 있는 경우 disabled 속성이 설정되어야 한다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: objectOptions,
                    optionLabel: 'name',
                    optionValue: 'id',
                    modelValue: null,
                    optionsDisabled: (option: any) => option.disabled,
                },
            });

            // then
            expect(wrapper.vm.filteredOptions[2].disabled).toBe(true);
        });
    });

    describe('empty UI', () => {
        async function mountAndOpen(options: Record<string, any>) {
            const wrapper = mount(VsSelect, { attachTo: document.body, ...options });

            wrapper.vm.openOptions();
            await nextTick();
            vi.advanceTimersByTime(100);
            await nextTick();
            await nextTick();

            return wrapper;
        }

        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('options가 비어 있으면 기본 empty UI가 렌더링된다', async () => {
            // given, when
            const wrapper = await mountAndOpen({ props: { options: [], modelValue: null } });

            // then
            const empty = document.querySelector('.vs-select-empty');
            expect(empty).not.toBeNull();
            expect(empty?.textContent).toContain('No Options');

            wrapper.unmount();
        });

        it('options가 있으면 empty UI가 렌더링되지 않는다', async () => {
            // given, when
            const wrapper = await mountAndOpen({ props: { options: basicOptions, modelValue: null } });

            // then
            expect(document.querySelector('.vs-select-empty')).toBeNull();

            wrapper.unmount();
        });

        it('empty slot으로 기본 empty UI를 대체할 수 있다', async () => {
            // given, when
            const wrapper = await mountAndOpen({
                props: { options: [], modelValue: null },
                slots: { empty: '<p class="custom-empty">옵션이 없습니다</p>' },
            });

            // then
            const empty = document.querySelector('.vs-select-empty');
            expect(empty?.textContent).not.toContain('No Options');
            expect(document.querySelector('.custom-empty')?.textContent).toBe('옵션이 없습니다');

            wrapper.unmount();
        });

        it('검색 결과가 없으면 empty UI가 렌더링된다', async () => {
            // given
            const wrapper = await mountAndOpen({ props: { options: basicOptions, modelValue: null, search: true } });
            expect(document.querySelector('.vs-select-empty')).toBeNull();

            // when
            (wrapper.vm.searchInputRef as any).onInputChange('Melon');
            vi.advanceTimersByTime(400);
            await nextTick();

            // then
            expect(wrapper.vm.filteredOptions).toHaveLength(0);
            expect(document.querySelector('.vs-select-empty')).not.toBeNull();

            wrapper.unmount();
        });
    });

    describe('단일/다중 선택', () => {
        it('단일 선택 모드에서는 하나의 값만 선택할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'Apple' });

            // then
            expect(wrapper.vm.selectedOptions).toHaveLength(1);
            expect(wrapper.vm.selectedOptions[0].value).toBe('Apple');
        });

        it('다중 선택 모드에서는 여러 값을 선택할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: [],
                    multiple: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: ['Apple', 'Banana'] });

            // then
            expect(wrapper.vm.selectedOptions).toHaveLength(2);
            expect(wrapper.vm.selectedOptions[0].value).toBe('Apple');
            expect(wrapper.vm.selectedOptions[1].value).toBe('Banana');
        });
    });

    describe('isEmpty', () => {
        it('선택된 값이 없으면 isEmpty가 true여야 한다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });

            // then
            expect(wrapper.vm.isEmpty).toBe(true);
        });

        it('선택된 값이 있으면 isEmpty가 false여야 한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // then
            expect(wrapper.vm.isEmpty).toBe(false);
        });

        it('다중 선택 모드에서 빈 배열이면 isEmpty가 true여야 한다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: [],
                    multiple: true,
                },
            });

            // then
            expect(wrapper.vm.isEmpty).toBe(true);
        });
    });

    describe('isSelected', () => {
        it('선택된 옵션에 대해 true를 반환해야 한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            await nextTick();

            // then
            const appleOption = wrapper.vm.filteredOptions.find((o: any) => o.value === 'Apple');
            expect(wrapper.vm.isSelected(appleOption?.id ?? '')).toBe(true);
        });

        it('선택되지 않은 옵션에 대해 false를 반환해야 한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            await nextTick();

            // then
            const bananaOption = wrapper.vm.filteredOptions.find((o: any) => o.value === 'Banana');
            expect(wrapper.vm.isSelected(bananaOption?.id ?? '')).toBe(false);
        });
    });

    describe('disabled / readonly', () => {
        it('disabled 상태에서는 선택할 수 없어야 한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    disabled: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'Apple' });

            // then
            expect(wrapper.vm.computedDisabled).toBe(true);
        });

        it('readonly 상태에서는 선택할 수 없어야 한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    readonly: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'Apple' });

            // then
            expect(wrapper.vm.computedReadonly).toBe(true);
        });
    });

    describe('search', () => {
        it('search prop이 true일 때 검색 기능을 사용할 수 있다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    search: true,
                },
            });

            // then
            expect(wrapper.vm.isUsingSearch).toBe(true);
        });

        it('search prop이 false일 때 검색 기능을 사용할 수 없다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    search: false,
                },
            });

            // then
            expect(wrapper.vm.isUsingSearch).toBe(false);
        });

        it('search prop이 객체일 때 searchProps를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    search: {
                        useRegex: false,
                        useCaseSensitive: false,
                        placeholder: 'Search...',
                    },
                },
            });

            // then
            expect(wrapper.vm.isUsingSearch).toBe(true);
            expect(wrapper.vm.searchProps).toEqual({
                useRegex: false,
                useCaseSensitive: false,
                placeholder: 'Search...',
            });
        });
    });

    describe('validation', () => {
        it('required 검증이 가능하다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    required: true,
                },
            });

            // when
            wrapper.vm.validate();
            await nextTick();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('required');
        });

        it('다중 선택 모드에서 min 검증이 가능하다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple'],
                    multiple: true,
                    min: 2,
                },
            });

            // when
            wrapper.vm.validate();
            await nextTick();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('min number of items');
        });

        it('다중 선택 모드에서 max 검증이 가능하다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple', 'Banana', 'Orange'],
                    multiple: true,
                    max: 2,
                },
            });

            // when
            wrapper.vm.validate();
            await nextTick();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('max number of items');
        });
    });

    describe('validate', () => {
        it('valid할 때 validate 함수를 호출하면 true를 반환한다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    required: true,
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });

        it('invalid할 때 validate 함수를 호출하면 false를 반환한다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    required: true,
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });
    });

    describe('clear', () => {
        it('단일 선택 모드에서 clear 함수를 호출하면 선택이 해제된다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.clear();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe(null);
        });

        it('다중 선택 모드에서 clear 함수를 호출하면 모든 선택이 해제된다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple', 'Banana'],
                    multiple: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.clear();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toEqual([]);
        });
    });

    describe('selectAll', () => {
        it('다중 선택 모드에서 selectAll prop이 true일 때 전체 선택 기능을 사용할 수 있다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: [],
                    multiple: true,
                    selectAll: true,
                },
            });

            // then
            expect(wrapper.props('selectAll')).toBe(true);
        });

        it('toggleSelectAll을 호출하면 모든 옵션이 선택된다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: [],
                    multiple: true,
                    selectAll: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.toggleSelectAll();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toEqual(['Apple', 'Banana', 'Orange']);
        });

        it('모든 옵션이 선택된 상태에서 toggleSelectAll을 호출하면 모든 선택이 해제된다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple', 'Banana', 'Orange'],
                    multiple: true,
                    selectAll: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.toggleSelectAll();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toEqual([]);
        });
    });

    describe('focus / blur', () => {
        it('focus 함수를 호출하면 트리거에 포커스가 설정된다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
                attachTo: document.body,
            });

            const focusSpy = vi.spyOn(wrapper.vm.triggerRef as any, 'focus');

            // when
            wrapper.vm.focus();

            // then
            expect(focusSpy).toHaveBeenCalled();

            wrapper.unmount();
        });

        it('blur 함수를 호출하면 트리거에서 포커스가 해제된다', () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
                attachTo: document.body,
            });

            const blurSpy = vi.spyOn(wrapper.vm.triggerRef as any, 'blur');

            // when
            wrapper.vm.blur();

            // then
            expect(blurSpy).toHaveBeenCalled();

            wrapper.unmount();
        });
    });

    describe('open / close', () => {
        it('openOptions 함수를 호출하면 옵션 목록이 열린다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });

            // when
            wrapper.vm.openOptions();
            await nextTick();

            // then
            expect(wrapper.vm.isOpen).toBe(true);
        });

        it('closeOptions 함수를 호출하면 옵션 목록이 닫힌다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });

            wrapper.vm.openOptions();
            await nextTick();

            // when
            wrapper.vm.closeOptions();
            await nextTick();

            // then
            expect(wrapper.vm.isOpen).toBe(false);
        });

        it('disabled 상태에서는 옵션 목록을 열 수 없다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    disabled: true,
                },
            });

            // when
            wrapper.vm.openOptions();
            await nextTick();

            // then
            expect(wrapper.vm.isOpen).toBe(false);
        });

        it('readonly 상태에서는 옵션 목록을 열 수 없다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    readonly: true,
                },
            });

            // when
            wrapper.vm.openOptions();
            await nextTick();

            // then
            expect(wrapper.vm.isOpen).toBe(false);
        });

        it('선택된 옵션이 있고 스크롤이 있을 때 openOptions 호출 시 scrollToItem에 50px offset이 전달된다', async () => {
            // given
            // VsFloating을 스텁으로 대체해 Teleport/v-if 없이 슬롯을 바로 렌더링 → optionsListRef 즉시 접근 가능
            vi.useFakeTimers();
            const wrapper = mount(VsSelect, {
                attachTo: document.body,
                global: { stubs: { VsFloating: { template: '<div><slot /></div>' } } },
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                },
            });
            await nextTick();

            const optionsListRef = wrapper.vm.optionsListRef;
            vi.spyOn(optionsListRef as any, 'hasScroll').mockReturnValue(true);
            const scrollToItemSpy = vi.spyOn(optionsListRef as any, 'scrollToItem');

            // when
            wrapper.vm.openOptions();
            vi.advanceTimersByTime(100);
            await nextTick();

            // then
            const appleOption = wrapper.vm.filteredOptions.find((o: any) => o.value === 'Apple');
            expect(scrollToItemSpy).toHaveBeenCalledWith(appleOption?.id, 50);

            wrapper.unmount();
            vi.useRealTimers();
        });

        it('선택된 옵션이 disabled여도 openOptions 호출 시 해당 옵션으로 스크롤한다', async () => {
            // given
            vi.useFakeTimers();
            const wrapper = mount(VsSelect, {
                attachTo: document.body,
                global: { stubs: { VsFloating: { template: '<div><slot /></div>' } } },
                props: {
                    options: basicOptions,
                    optionsDisabled: (option: string) => option === 'Banana',
                    modelValue: 'Banana',
                },
            });
            await nextTick();

            const optionsListRef = wrapper.vm.optionsListRef;
            vi.spyOn(optionsListRef as any, 'hasScroll').mockReturnValue(true);
            const scrollToItemSpy = vi.spyOn(optionsListRef as any, 'scrollToItem');

            // when
            wrapper.vm.openOptions();
            vi.advanceTimersByTime(100);
            await nextTick();

            // then
            const bananaOption = wrapper.vm.filteredOptions.find((o: any) => o.value === 'Banana');
            expect(scrollToItemSpy).toHaveBeenCalledWith(bananaOption?.id, 50);

            wrapper.unmount();
            vi.useRealTimers();
        });

        it('선택된 옵션이 없을 때 openOptions 호출 시 scrollToItem이 호출되지 않는다', async () => {
            // given
            vi.useFakeTimers();
            const wrapper = mount(VsSelect, {
                attachTo: document.body,
                global: { stubs: { VsFloating: { template: '<div><slot /></div>' } } },
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });
            await nextTick();

            const optionsListRef = wrapper.vm.optionsListRef;
            vi.spyOn(optionsListRef as any, 'hasScroll').mockReturnValue(true);
            const scrollToItemSpy = vi.spyOn(optionsListRef as any, 'scrollToItem');

            // when
            wrapper.vm.openOptions();
            vi.advanceTimersByTime(100);
            await nextTick();

            // then
            expect(scrollToItemSpy).not.toHaveBeenCalled();

            wrapper.unmount();
            vi.useRealTimers();
        });
    });

    describe('emits', () => {
        it('옵션을 선택하면 update:modelValue 이벤트가 발생한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            const appleOption = wrapper.vm.filteredOptions[0];
            wrapper.vm.selectOptionItem(appleOption);
            await nextTick();

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        });

        it('옵션 목록이 열리면 open 이벤트가 발생한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });

            // when
            wrapper.vm.openOptions();
            await nextTick();

            // then
            expect(wrapper.emitted('open')).toBeTruthy();
        });

        it('옵션 목록이 닫히면 close 이벤트가 발생한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                },
            });

            wrapper.vm.openOptions();
            await nextTick();

            // when
            wrapper.vm.closeOptions();
            await nextTick();

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
        });

        it('clear 함수를 호출하면 clear 이벤트가 발생한다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.clear();
            await nextTick();

            // then
            expect(wrapper.emitted('clear')?.[0]).toEqual(['Apple']);
        });
    });

    describe('options slot 키 이벤트', () => {
        it('options-header slot 안에서 발생한 키 이벤트는 select 키 동작에 가로채이지 않는다', async () => {
            // given
            vi.useFakeTimers();
            const wrapper = mount(VsSelect, {
                attachTo: document.body,
                props: { options: basicOptions, modelValue: null },
                slots: { 'options-header': '<input class="slot-input" />' },
            });

            wrapper.vm.openOptions();
            await nextTick();
            vi.advanceTimersByTime(100);
            await nextTick();
            await nextTick();

            const slotInput = document.querySelector('.slot-input');
            expect(slotInput).not.toBeNull();

            // when: slot 내부에서 키 이벤트 발생
            const slotEvent = new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true, cancelable: true });
            slotInput?.dispatchEvent(slotEvent);

            // then: slot 영역의 키는 preventDefault 되지 않는다
            expect(slotEvent.defaultPrevented).toBe(false);

            // and: slot 밖에서 발생한 키는 기존대로 select가 처리한다
            const outsideEvent = new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true, cancelable: true });
            document.dispatchEvent(outsideEvent);
            expect(outsideEvent.defaultPrevented).toBe(true);

            wrapper.unmount();
            vi.useRealTimers();
        });
    });

    describe('options header', () => {
        it('search를 사용하지 않으면 options-header slot이 있어도 search 영역을 렌더링하지 않는다', async () => {
            // given, when
            const wrapper = mount(VsSelect, {
                global: { stubs: { VsFloating: { template: '<div><slot /></div>' } } },
                props: { options: basicOptions, modelValue: null },
                slots: { 'options-header': '<div class="custom-header" />' },
            });
            await nextTick();

            // then
            expect(wrapper.find('.custom-header').exists()).toBe(true);
            expect(wrapper.find('.vs-select-search').exists()).toBe(false);
        });
    });

    describe('deselectOption', () => {
        it('다중 선택 모드에서 선택된 옵션을 해제할 수 있다', async () => {
            // given
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple', 'Banana'],
                    multiple: true,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            await nextTick();
            const appleOption = wrapper.vm.filteredOptions.find((o: any) => o.value === 'Apple');

            // when
            wrapper.vm.deselectOption(appleOption?.id ?? '');
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toEqual(['Banana']);
        });
    });

    describe('invalid modelValue warning', () => {
        it('단일 선택 모드에서 options에 없는 초기 modelValue를 설정하면 경고가 출력된다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'invalid',
                },
            });
            await nextTick();

            // then
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Tried to set "invalid"'));
            warnSpy.mockRestore();
        });

        it('다중 선택 모드에서 options에 없는 초기 modelValue가 있으면 경고가 출력된다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: ['Apple', 'invalid'],
                    multiple: true,
                },
            });
            await nextTick();

            // then
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('not in options'));
            warnSpy.mockRestore();
        });

        it('options에 있는 유효한 초기 modelValue를 설정하면 경고가 출력되지 않는다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                },
            });
            await nextTick();

            // then
            expect(warnSpy).not.toHaveBeenCalled();
            warnSpy.mockRestore();
        });

        it('프로그래매틱하게 options에 없는 값으로 변경하면 경고가 출력된다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: 'Apple',
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'invalid' });
            await nextTick();

            // then
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Tried to set "invalid"'));
            warnSpy.mockRestore();
        });
    });

    describe('focusPlaceholder', () => {
        it('옵션 목록이 열리면 focusPlaceholder를 보여주고 닫히면 placeholder로 되돌아간다', async () => {
            // given: placeholder와 focusPlaceholder가 모두 설정된 select (선택값 없음)
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    placeholder: 'Select a fruit',
                    focusPlaceholder: 'Pick from the list below',
                },
            });
            const placeholderText = () => wrapper.find('.vs-select-placeholder').text();

            // then: 닫힌 상태에서는 placeholder가 보인다
            expect(placeholderText()).toBe('Select a fruit');

            // when: 옵션 목록을 연다
            wrapper.vm.openOptions();
            await nextTick();

            // then: focusPlaceholder가 보인다
            expect(placeholderText()).toBe('Pick from the list below');

            // when: 옵션 목록을 닫는다
            wrapper.vm.closeOptions();
            await nextTick();

            // then: 다시 placeholder로 되돌아간다
            expect(placeholderText()).toBe('Select a fruit');
        });

        it('트리거가 포커스되면 focusPlaceholder를 보여주고 blur되면 placeholder로 되돌아간다', async () => {
            // given: placeholder와 focusPlaceholder가 모두 설정된 select (선택값 없음)
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    placeholder: 'Select a fruit',
                    focusPlaceholder: 'Pick from the list below',
                },
            });
            const trigger = wrapper.find('.vs-select-trigger');
            const placeholderText = () => wrapper.find('.vs-select-placeholder').text();

            // then: 포커스 전에는 placeholder가 보인다
            expect(placeholderText()).toBe('Select a fruit');

            // when: 트리거에 포커스를 준다
            await trigger.trigger('focus');

            // then: focusPlaceholder가 보인다
            expect(placeholderText()).toBe('Pick from the list below');

            // when: 트리거에서 포커스가 해제된다
            await trigger.trigger('blur');

            // then: 다시 placeholder로 되돌아간다
            expect(placeholderText()).toBe('Select a fruit');
        });

        it('focusPlaceholder가 비어 있으면 열려 있어도 placeholder를 유지한다', async () => {
            // given: focusPlaceholder가 설정되지 않은 select (선택값 없음)
            const wrapper = mount(VsSelect, {
                props: {
                    options: basicOptions,
                    modelValue: null,
                    placeholder: 'Select a fruit',
                },
            });

            // when: 옵션 목록을 연다
            wrapper.vm.openOptions();
            await nextTick();

            // then: focusPlaceholder가 없으므로 placeholder를 그대로 보여준다
            expect(wrapper.find('.vs-select-placeholder').text()).toBe('Select a fruit');
        });
    });

    describe('noVirtual', () => {
        it('noVirtual을 VsGroupedList에 전달하여 옵션이 많아도 모든 옵션을 렌더링한다', async () => {
            // given, when
            const wrapper = mount(VsSelect, {
                global: { stubs: { VsFloating: { template: '<div><slot /></div>' } } },
                props: {
                    options: Array.from({ length: 150 }, (_, i) => `Option ${i + 1}`),
                    modelValue: null,
                    noVirtual: true,
                },
            });
            await nextTick();

            // then
            expect(wrapper.findComponent({ name: 'VsGroupedList' }).props('noVirtual')).toBe(true);
            expect(wrapper.findAll('.vs-select-option-wrap')).toHaveLength(150);
        });
    });

    describe('keyboard navigation', () => {
        const manyOptions = Array.from({ length: 1000 }, (_, i) => `Option ${i + 1}`);

        const originalScrollIntoView = Element.prototype.scrollIntoView;

        // jsdom은 레이아웃을 계산하지 않으므로 옵션 목록 스크롤 영역(320px)과 행 높이(32px)를 흉내낸다
        beforeEach(() => {
            vi.useFakeTimers();
            const isScrollBody = (el: HTMLElement) => el.classList.contains('vs-inner-scroll-body');
            vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
                return isScrollBody(this) ? 320 : 32;
            });
            vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
                return isScrollBody(this) ? 320 : 32;
            });
            vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
                return isScrollBody(this) ? 100000 : 32;
            });
            Element.prototype.scrollIntoView = vi.fn();
        });

        afterEach(() => {
            vi.restoreAllMocks();
            vi.useRealTimers();
            Element.prototype.scrollIntoView = originalScrollIntoView;
        });

        async function mountOpenedSelect(props: Record<string, any>) {
            const wrapper = mount(VsSelect, {
                attachTo: document.body,
                global: { stubs: { VsFloating: { template: '<div><slot /></div>' } } },
                props: { modelValue: null, ...props },
            });
            await nextTick();
            wrapper.vm.openOptions();
            vi.advanceTimersByTime(100);
            await nextTick();
            return wrapper;
        }

        async function pressKey(code: string) {
            document.dispatchEvent(new KeyboardEvent('keydown', { code }));
            await nextTick();
        }

        it('ArrowDown과 Enter로 포커스된 옵션을 선택할 수 있다', async () => {
            // given
            const wrapper = await mountOpenedSelect({ options: manyOptions });

            // when
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Option 2']);
            wrapper.unmount();
        });

        it('virtual로 렌더링되지 않은 마지막 옵션도 End 키로 포커스하고 선택할 수 있다', async () => {
            // given
            const wrapper = await mountOpenedSelect({ options: manyOptions });
            expect(wrapper.find('[data-id]').exists()).toBe(true);
            const lastOption = wrapper.vm.filteredOptions[manyOptions.length - 1];
            expect(wrapper.find(`[data-id="${lastOption?.id}"]`).exists()).toBe(false);
            const scrollToItemSpy = vi.spyOn(wrapper.vm.optionsListRef as any, 'scrollToItem');

            // when
            await pressKey('End');
            await nextTick();
            await pressKey('Enter');

            // then
            expect(scrollToItemSpy).toHaveBeenCalledWith(lastOption?.id);
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Option 1000']);
            wrapper.unmount();
        });

        it('search에서 ArrowDown을 누르면 선택된 옵션으로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({ options: manyOptions, search: true, modelValue: 'Option 500' });

            // when
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Option 501']);
            wrapper.unmount();
        });

        it('search에서 ArrowDown을 누르면 선택된 옵션이 없을 때 첫 번째 옵션으로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({ options: manyOptions, search: true });

            // when
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Option 1']);
            wrapper.unmount();
        });

        it('search에서 ArrowDown을 누르면 select-all로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({
                options: manyOptions,
                search: true,
                multiple: true,
                selectAll: true,
                modelValue: ['Option 30', 'Option 10'],
            });

            // when
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]?.[0]).toHaveLength(manyOptions.length);
            wrapper.unmount();
        });

        it('옵션에서 Home 키를 누르면 select-all이 아닌 첫 번째 옵션으로 포커스를 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({
                options: manyOptions,
                search: true,
                multiple: true,
                selectAll: true,
                modelValue: [],
            });

            // when: search → select-all → Option 1 → Option 2 → Home
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Home');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([['Option 1']]);
            wrapper.unmount();
        });

        it('search에 포커스가 있으면 Home/End는 입력창 커서 이동을 위해 포커스를 옮기지 않는다', async () => {
            // given
            const wrapper = await mountOpenedSelect({ options: manyOptions, search: true });
            const homeEvent = new KeyboardEvent('keydown', { code: 'Home', cancelable: true });
            const endEvent = new KeyboardEvent('keydown', { code: 'End', cancelable: true });

            // when
            document.dispatchEvent(homeEvent);
            document.dispatchEvent(endEvent);
            await nextTick();
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(homeEvent.defaultPrevented).toBe(false);
            expect(endEvent.defaultPrevented).toBe(false);
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Option 1']);
            wrapper.unmount();
        });

        it('select-all에서 ArrowDown을 누르면 목록상 첫 번째 선택된 옵션으로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({
                options: manyOptions,
                search: true,
                multiple: true,
                selectAll: true,
                modelValue: ['Option 30', 'Option 10'],
            });

            // when
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([['Option 30']]);
            wrapper.unmount();
        });

        it('마우스를 올린 옵션으로 포커스가 이동하고 Enter로 선택할 수 있다', async () => {
            // given
            const wrapper = await mountOpenedSelect({ options: manyOptions, search: true });
            const thirdOption = wrapper.findAll('.vs-select-option-wrap')[2];

            // when
            thirdOption.element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            await nextTick();

            // then
            expect(thirdOption.classes()).toContain('vs-focusable-active');

            // when
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['Option 3']);
            wrapper.unmount();
        });

        it('옵션 영역에 들어간 뒤 select-all에서 ArrowDown을 누르면 바로 아래 옵션으로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({
                options: manyOptions,
                search: true,
                multiple: true,
                selectAll: true,
                modelValue: ['Option 30', 'Option 10'],
            });

            // when: search → select-all → Option 10(첫 진입) → Home(Option 1) → select-all → Option 1
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Home');
            await pressKey('ArrowUp');
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([
                ['Option 30', 'Option 10', 'Option 1'],
            ]);
            wrapper.unmount();
        });

        it('목록을 다시 열면 select-all에서 ArrowDown을 눌렀을 때 다시 선택된 옵션으로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({
                options: manyOptions,
                search: true,
                multiple: true,
                selectAll: true,
                modelValue: ['Option 30', 'Option 10'],
            });
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            wrapper.vm.closeOptions();
            await nextTick();
            wrapper.vm.openOptions();
            vi.advanceTimersByTime(100);
            await nextTick();

            // when: search → select-all → Option 10
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual([['Option 30']]);
            wrapper.unmount();
        });

        it('groupBy가 있으면 화면에 표시되는 그룹 순서대로 포커스가 이동한다', async () => {
            // given
            const wrapper = await mountOpenedSelect({
                options: ['a1', 'b1', 'a2'],
                groupBy: (option: string) => option[0],
            });

            // when
            await pressKey('ArrowDown');
            await pressKey('ArrowDown');
            await pressKey('Enter');

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['a2']);
            wrapper.unmount();
        });
    });
});
