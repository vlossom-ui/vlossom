import { describe, it, expect } from 'vitest';
import { ref, computed } from 'vue';
import { useSelectValue } from '../select-value-composable';
import type { OptionItem } from '@/declaration';

describe('useSelectValue', () => {
    function createMockOptions(): OptionItem[] {
        return [
            {
                id: '1',
                label: 'Option 1',
                value: 'value1',
                disabled: false,
                index: 0,
                item: { label: 'Option 1', value: 'value1' },
            },
            {
                id: '2',
                label: 'Option 2',
                value: 'value2',
                disabled: false,
                index: 1,
                item: { label: 'Option 2', value: 'value2' },
            },
            {
                id: '3',
                label: 'Option 3',
                value: 'value3',
                disabled: true,
                index: 2,
                item: { label: 'Option 3', value: 'value3' },
            },
            {
                id: '4',
                label: 'Option 4',
                value: 'value4',
                disabled: false,
                index: 3,
                item: { label: 'Option 4', value: 'value4' },
            },
        ];
    }

    describe('초기 상태', () => {
        it('selectedOptionIds가 빈 배열로 초기화되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            // when
            const { selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });

        it('isEmpty가 true로 초기화되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            // when
            const { isEmpty } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // then
            expect(isEmpty.value).toBe(true);
        });

        it('isSelectedAll이 false로 초기화되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            // when
            const { isSelectedAll } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // then
            expect(isSelectedAll.value).toBe(false);
        });
    });

    describe('selectOption', () => {
        it('단일 선택 모드에서 옵션을 선택할 수 있어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectOption('1');

            // then
            expect(selectedOptionIds.value).toEqual(['1']);
        });

        it('단일 선택 모드에서 새 옵션을 선택하면 이전 선택이 대체되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when
            selectOption('2');

            // then
            expect(selectedOptionIds.value).toEqual(['2']);
        });

        it('다중 선택 모드에서 여러 옵션을 선택할 수 있어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectOption('1');
            selectOption('2');

            // then
            expect(selectedOptionIds.value).toEqual(['1', '2']);
        });

        it('disabled 상태에서는 옵션을 선택할 수 없어야 한다', () => {
            // given
            const computedDisabled = ref(true);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectOption('1');

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });

        it('readonly 상태에서는 옵션을 선택할 수 없어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(true);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectOption('1');

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });

        it('disabled된 옵션은 선택할 수 없어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when - Option 3는 disabled 상태
            selectOption('3');

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });
    });

    describe('deselectOption', () => {
        it('선택된 옵션을 해제할 수 있어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, deselectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');
            selectOption('2');

            // when
            deselectOption('1');

            // then
            expect(selectedOptionIds.value).toEqual(['2']);
        });

        it('선택되지 않은 옵션을 해제하려고 하면 아무 일도 일어나지 않아야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, deselectOption, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when
            deselectOption('2');

            // then
            expect(selectedOptionIds.value).toEqual(['1']);
        });
    });

    describe('toggleSelect', () => {
        it('선택되지 않은 옵션을 토글하면 선택되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { toggleSelect, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            toggleSelect('1');

            // then
            expect(selectedOptionIds.value).toEqual(['1']);
        });

        it('선택된 옵션을 토글하면 해제되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { toggleSelect, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            toggleSelect('1');

            // when
            toggleSelect('1');

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });

        it('단일 선택 모드에서는 토글해도 해제되지 않고 재선택되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { toggleSelect, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            toggleSelect('1');

            // when
            toggleSelect('1');

            // then
            expect(selectedOptionIds.value).toEqual(['1']);
        });

        it('disabled 상태에서는 토글할 수 없어야 한다', () => {
            // given
            const computedDisabled = ref(true);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { toggleSelect, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            toggleSelect('1');

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });
    });

    describe('selectAll', () => {
        it('모든 활성화된 옵션을 선택할 수 있어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectAll();

            // then - Option 3는 disabled이므로 제외
            expect(selectedOptionIds.value).toEqual(['1', '2', '4']);
        });

        it('이미 선택된 옵션이 있어도 중복 없이 모두 선택되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, selectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when
            selectAll();

            // then
            expect(selectedOptionIds.value).toEqual(['1', '2', '4']);
        });

        it('disabled 상태에서는 전체 선택할 수 없어야 한다', () => {
            // given
            const computedDisabled = ref(true);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectAll();

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });
    });

    describe('deselectAll', () => {
        it('필터된 옵션 중 선택된 모든 옵션을 해제해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectAll, deselectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectAll();

            // when
            deselectAll();

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });
    });

    describe('toggleSelectAll', () => {
        it('전체 선택되지 않은 상태에서 토글하면 전체 선택되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { toggleSelectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            toggleSelectAll();

            // then
            expect(selectedOptionIds.value).toEqual(['1', '2', '4']);
        });

        it('전체 선택된 상태에서 토글하면 전체 해제되어야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { toggleSelectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            toggleSelectAll();

            // when
            toggleSelectAll();

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });

        it('disabled 상태에서는 토글할 수 없어야 한다', () => {
            // given
            const computedDisabled = ref(true);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { toggleSelectAll, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            toggleSelectAll();

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });
    });

    describe('isSelected', () => {
        it('선택된 옵션은 true를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, isSelected } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when & then
            expect(isSelected('1')).toBe(true);
        });

        it('선택되지 않은 옵션은 false를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { isSelected } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(isSelected('1')).toBe(false);
        });
    });

    describe('isEmpty', () => {
        it('선택된 옵션이 없으면 true를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { isEmpty } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(isEmpty.value).toBe(true);
        });

        it('선택된 옵션이 있으면 false를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, isEmpty } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when & then
            expect(isEmpty.value).toBe(false);
        });
    });

    describe('isSelectedAll', () => {
        it('단일 선택 모드에서는 항상 false를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { selectOption, isSelectedAll } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when & then
            expect(isSelectedAll.value).toBe(false);
        });

        it('다중 선택 모드에서 모든 활성화된 옵션이 선택되면 true를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectAll, isSelectedAll } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when
            selectAll();

            // then
            expect(isSelectedAll.value).toBe(true);
        });

        it('일부만 선택된 경우 false를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, isSelectedAll } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');

            // when & then
            expect(isSelectedAll.value).toBe(false);
        });
    });

    describe('selectedOptions', () => {
        it('선택된 옵션들의 정보를 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, selectedOptions } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectOption('1');
            selectOption('2');

            // when & then
            expect(selectedOptions.value).toEqual([computedOptions.value[0], computedOptions.value[1]]);
        });

        it('선택된 옵션이 없으면 빈 배열을 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectedOptions } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(selectedOptions.value).toEqual([]);
        });
    });

    describe('convertValue', () => {
        it('단일 선택 모드에서 존재하는 값은 그대로 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { convertValue } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(convertValue('value1')).toBe('value1');
        });

        it('단일 선택 모드에서 존재하지 않는 값은 null을 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { convertValue } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(convertValue('invalid')).toBe(null);
        });

        it('단일 선택 모드에서 null/undefined는 null을 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(false);

            const { convertValue } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(convertValue(null)).toBe(null);
            expect(convertValue(undefined)).toBe(null);
        });

        it('다중 선택 모드에서 배열을 필터링하여 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { convertValue } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(convertValue(['value1', 'value2', 'invalid'])).toEqual(['value1', 'value2']);
        });

        it('다중 선택 모드에서 배열이 아닌 값을 배열로 변환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { convertValue } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(convertValue('value1')).toEqual(['value1']);
        });

        it('다중 선택 모드에서 null/undefined는 빈 배열을 반환해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { convertValue } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            // when & then
            expect(convertValue(null)).toEqual([]);
            expect(convertValue(undefined)).toEqual([]);
        });
    });

    describe('clearSelected', () => {
        it('모든 선택을 해제해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectAll, clearSelected, selectedOptionIds } = useSelectValue({
                computedDisabled,
                computedReadonly,
                computedOptions,
                filteredOptions,
                multiple,
            });

            selectAll();

            // when
            clearSelected();

            // then
            expect(selectedOptionIds.value).toEqual([]);
        });
    });

    describe('통합 테스트', () => {
        it('전체 라이프사이클이 올바르게 동작해야 한다', () => {
            // given
            const computedDisabled = ref(false);
            const computedReadonly = ref(false);
            const computedOptions = computed(() => createMockOptions());
            const filteredOptions = computed(() => createMockOptions());
            const multiple = ref(true);

            const { selectOption, deselectOption, isEmpty, selectedOptions, clearSelected, selectedOptionIds } =
                useSelectValue({
                    computedDisabled,
                    computedReadonly,
                    computedOptions,
                    filteredOptions,
                    multiple,
                });

            // 초기 상태
            expect(isEmpty.value).toBe(true);
            expect(selectedOptions.value).toEqual([]);

            // when - 옵션 선택
            selectOption('1');
            selectOption('2');

            // then
            expect(isEmpty.value).toBe(false);
            expect(selectedOptionIds.value).toEqual(['1', '2']);
            expect(selectedOptions.value).toHaveLength(2);

            // when - 옵션 해제
            deselectOption('1');

            // then
            expect(selectedOptionIds.value).toEqual(['2']);
            expect(selectedOptions.value).toHaveLength(1);

            // when - 전체 해제
            clearSelected();

            // then
            expect(isEmpty.value).toBe(true);
            expect(selectedOptions.value).toEqual([]);
        });
    });
});
