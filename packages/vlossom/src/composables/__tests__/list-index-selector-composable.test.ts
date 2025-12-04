import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useIndexSelector } from '../list-index-selector-composable';

describe('list-index-selector-composable', () => {
    describe('isSelected', () => {
        it('선택된 인덱스는 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isSelected, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 1;

            // then
            expect(isSelected(0)).toBe(false);
            expect(isSelected(1)).toBe(true);
            expect(isSelected(2)).toBe(false);
        });
    });

    describe('isDisabled', () => {
        it('disabled가 true이면 모든 인덱스에서 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref(true);

            // when
            const { isDisabled } = useIndexSelector(list, disabled);

            // then
            expect(isDisabled(0)).toBe(true);
            expect(isDisabled(1)).toBe(true);
            expect(isDisabled(2)).toBe(true);
        });

        it('disabled가 false이면 모든 인덱스에서 false를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref(false);

            // when
            const { isDisabled } = useIndexSelector(list, disabled);

            // then
            expect(isDisabled(0)).toBe(false);
            expect(isDisabled(1)).toBe(false);
            expect(isDisabled(2)).toBe(false);
        });

        it('disabled가 함수이면 비활성화된 인덱스는 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3', 'item4']);
            const disabled = ref((item: string, index: number) => [1, 3].includes(index));

            // when
            const { isDisabled } = useIndexSelector(list, disabled);

            // then
            expect(isDisabled(0)).toBe(false);
            expect(isDisabled(1)).toBe(true);
            expect(isDisabled(2)).toBe(false);
            expect(isDisabled(3)).toBe(true);
        });
    });

    describe('isPrevious', () => {
        it('주어진 인덱스가 선택된 인덱스보다 작으면 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isPrevious, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 2;

            // then
            expect(isPrevious(0)).toBe(true);
            expect(isPrevious(1)).toBe(true);
        });

        it('주어진 인덱스가 선택된 인덱스와 같으면 false를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isPrevious, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 1;

            // then
            expect(isPrevious(1)).toBe(false);
        });

        it('주어진 인덱스가 선택된 인덱스보다 크면 false를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isPrevious, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 0;

            // then
            expect(isPrevious(1)).toBe(false);
            expect(isPrevious(2)).toBe(false);
        });
    });

    describe('findActiveIndexForwardFrom', () => {
        it('지정된 인덱스부터 앞으로 활성화된 인덱스를 찾아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3', 'item4']);
            const disabled = ref((item: string, index: number) => index === 1);
            const { findActiveIndexForwardFrom } = useIndexSelector(list, disabled);

            // when, then
            expect(findActiveIndexForwardFrom(0)).toBe(0);
            expect(findActiveIndexForwardFrom(1)).toBe(2);
            expect(findActiveIndexForwardFrom(2)).toBe(2);
        });

        it('범위를 벗어난 인덱스는 INVALID_INDEX를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { findActiveIndexForwardFrom } = useIndexSelector(list);

            // when, then
            expect(findActiveIndexForwardFrom(-1)).toBe(-1);
            expect(findActiveIndexForwardFrom(3)).toBe(-1);
        });

        it('비활성화된 항목만 남은 경우 INVALID_INDEX를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => index >= 1);
            const { findActiveIndexForwardFrom } = useIndexSelector(list, disabled);

            // when, then
            expect(findActiveIndexForwardFrom(1)).toBe(-1);
            expect(findActiveIndexForwardFrom(2)).toBe(-1);
        });
    });

    describe('findActiveIndexBackwardFrom', () => {
        it('지정된 인덱스부터 뒤로 활성화된 인덱스를 찾아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3', 'item4']);
            const disabled = ref((item: string, index: number) => index === 1);
            const { findActiveIndexBackwardFrom } = useIndexSelector(list, disabled);

            // when, then
            expect(findActiveIndexBackwardFrom(3)).toBe(3);
            expect(findActiveIndexBackwardFrom(2)).toBe(2);
            expect(findActiveIndexBackwardFrom(1)).toBe(0);
        });

        it('범위를 벗어난 인덱스는 INVALID_INDEX를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { findActiveIndexBackwardFrom } = useIndexSelector(list);

            // when, then
            expect(findActiveIndexBackwardFrom(-1)).toBe(-1);
            expect(findActiveIndexBackwardFrom(3)).toBe(-1);
        });

        it('비활성화된 항목만 남은 경우 INVALID_INDEX를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => index <= 1);
            const { findActiveIndexBackwardFrom } = useIndexSelector(list, disabled);

            // when, then
            expect(findActiveIndexBackwardFrom(1)).toBe(-1);
            expect(findActiveIndexBackwardFrom(0)).toBe(-1);
        });
    });

    describe('selectIndex', () => {
        it('활성화된 인덱스를 선택하면 selectedIndex가 변경되어야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { selectIndex, selectedIndex } = useIndexSelector(list);

            // when
            selectIndex(1);

            // then
            expect(selectedIndex.value).toBe(1);
        });

        it('비활성화된 인덱스를 선택하면 INVALID_INDEX가 설정되어야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => index === 1);
            const { selectIndex, selectedIndex } = useIndexSelector(list, disabled);
            selectedIndex.value = 0;

            // when
            selectIndex(1);

            // then
            expect(selectedIndex.value).toBe(-1);
        });

        it('범위를 벗어난 인덱스를 선택하면 INVALID_INDEX가 설정되어야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { selectIndex, selectedIndex } = useIndexSelector(list);
            selectedIndex.value = 0;

            // when
            selectIndex(-1);

            // then
            expect(selectedIndex.value).toBe(-1);

            // when
            selectedIndex.value = 0;
            selectIndex(5);

            // then
            expect(selectedIndex.value).toBe(-1);
        });

        it('모든 항목이 비활성화된 경우 INVALID_INDEX가 설정되어야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref(true);
            const { selectIndex, selectedIndex } = useIndexSelector(list, disabled);
            selectedIndex.value = 0;

            // when
            selectIndex(1);

            // then
            expect(selectedIndex.value).toBe(-1);
        });
    });

    describe('handleKeydown', () => {
        let preventDefaultSpy: ReturnType<typeof vi.fn>;

        beforeEach(() => {
            preventDefaultSpy = vi.fn();
        });

        function createMockEvent(key: string): KeyboardEvent {
            return {
                key,
                preventDefault: preventDefaultSpy,
            } as unknown as KeyboardEvent;
        }

        describe('수평 모드', () => {
            it('ArrowRight 키를 누르면 다음 인덱스로 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 0;
                const event = createMockEvent('ArrowRight');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(1);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('ArrowLeft 키를 누르면 이전 인덱스로 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 2;
                const event = createMockEvent('ArrowLeft');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(1);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('첫 번째 항목에서 ArrowLeft 키를 누르면 이동하지 않아야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 0;
                const event = createMockEvent('ArrowLeft');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(0);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });

            it('마지막 항목에서 ArrowRight 키를 누르면 이동하지 않아야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 2;
                const event = createMockEvent('ArrowRight');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(2);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });

            it('ArrowUp/ArrowDown 키는 동작하지 않아야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 1;

                // when
                const eventUp = createMockEvent('ArrowUp');
                handleKeydown(eventUp, false);

                // then
                expect(selectedIndex.value).toBe(1);

                // when
                const eventDown = createMockEvent('ArrowDown');
                handleKeydown(eventDown, false);

                // then
                expect(selectedIndex.value).toBe(1);
            });

            it('비활성화된 인덱스를 건너뛰고 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3', 'item4']);
                const disabled = ref((item: string, index: number) => [1, 2].includes(index));
                const { handleKeydown, selectedIndex } = useIndexSelector(list, disabled);
                selectedIndex.value = 0;
                const event = createMockEvent('ArrowRight');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(3);
            });
        });

        describe('수직 모드', () => {
            it('ArrowDown 키를 누르면 다음 인덱스로 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 0;
                const event = createMockEvent('ArrowDown');

                // when
                handleKeydown(event, true);

                // then
                expect(selectedIndex.value).toBe(1);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('ArrowUp 키를 누르면 이전 인덱스로 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 2;
                const event = createMockEvent('ArrowUp');

                // when
                handleKeydown(event, true);

                // then
                expect(selectedIndex.value).toBe(1);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('첫 번째 항목에서 ArrowUp 키를 누르면 이동하지 않아야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 0;
                const event = createMockEvent('ArrowUp');

                // when
                handleKeydown(event, true);

                // then
                expect(selectedIndex.value).toBe(0);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });

            it('마지막 항목에서 ArrowDown 키를 누르면 이동하지 않아야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 2;
                const event = createMockEvent('ArrowDown');

                // when
                handleKeydown(event, true);

                // then
                expect(selectedIndex.value).toBe(2);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });

            it('ArrowLeft/ArrowRight 키는 동작하지 않아야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 1;

                // when
                const eventLeft = createMockEvent('ArrowLeft');
                handleKeydown(eventLeft, true);

                // then
                expect(selectedIndex.value).toBe(1);

                // when
                const eventRight = createMockEvent('ArrowRight');
                handleKeydown(eventRight, true);

                // then
                expect(selectedIndex.value).toBe(1);
            });

            it('비활성화된 인덱스를 건너뛰고 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3', 'item4']);
                const disabled = ref((item: string, index: number) => [1, 2].includes(index));
                const { handleKeydown, selectedIndex } = useIndexSelector(list, disabled);
                selectedIndex.value = 0;
                const event = createMockEvent('ArrowDown');

                // when
                handleKeydown(event, true);

                // then
                expect(selectedIndex.value).toBe(3);
            });
        });

        describe('공통 키', () => {
            beforeEach(() => {
                preventDefaultSpy = vi.fn();
            });

            it('Home 키를 누르면 첫 번째 활성화된 인덱스로 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 2;
                const event = createMockEvent('Home');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(0);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('End 키를 누르면 마지막 활성화된 인덱스로 이동해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 0;
                const event = createMockEvent('End');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(2);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('비활성화된 항목이 있을 때 Home/End 키는 활성화된 인덱스만 고려해야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3', 'item4', 'item5']);
                const disabled = ref((item: string, index: number) => [0, 4].includes(index));
                const { handleKeydown, selectedIndex } = useIndexSelector(list, disabled);
                selectedIndex.value = 2;

                // when - Home
                const eventHome = createMockEvent('Home');
                handleKeydown(eventHome, false);

                // then
                expect(selectedIndex.value).toBe(1);

                // when - End
                const eventEnd = createMockEvent('End');
                handleKeydown(eventEnd, false);

                // then
                expect(selectedIndex.value).toBe(3);
            });

            it('이미 첫 번째 항목에서 Home을 눌러도 preventDefault는 호출되어야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 0;
                const event = createMockEvent('Home');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(0);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });

            it('이미 마지막 항목에서 End를 눌러도 preventDefault는 호출되어야 한다', () => {
                // given
                const list = ref(['item1', 'item2', 'item3']);
                const { handleKeydown, selectedIndex } = useIndexSelector(list);
                selectedIndex.value = 2;
                const event = createMockEvent('End');

                // when
                handleKeydown(event, false);

                // then
                expect(selectedIndex.value).toBe(2);
                expect(preventDefaultSpy).toHaveBeenCalled();
            });
        });
    });

    describe('isFirstEdge', () => {
        it('첫 번째 활성화된 인덱스가 선택되면 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isFirstEdge, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 0;

            // then
            expect(isFirstEdge.value).toBe(true);
        });

        it('첫 번째 항목이 비활성화된 경우 다음 활성화된 인덱스에서 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => index === 0);
            const { isFirstEdge, selectedIndex } = useIndexSelector(list, disabled);

            // when
            selectedIndex.value = 1;

            // then
            expect(isFirstEdge.value).toBe(true);
        });

        it('첫 번째 활성화된 인덱스가 아니면 false를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isFirstEdge, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 1;

            // then
            expect(isFirstEdge.value).toBe(false);
        });
    });

    describe('isLastEdge', () => {
        it('마지막 활성화된 인덱스가 선택되면 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isLastEdge, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 2;

            // then
            expect(isLastEdge.value).toBe(true);
        });

        it('마지막 항목이 비활성화된 경우 이전 활성화된 인덱스에서 true를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => index === 2);
            const { isLastEdge, selectedIndex } = useIndexSelector(list, disabled);

            // when
            selectedIndex.value = 1;

            // then
            expect(isLastEdge.value).toBe(true);
        });

        it('마지막 활성화된 인덱스가 아니면 false를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { isLastEdge, selectedIndex } = useIndexSelector(list);

            // when
            selectedIndex.value = 1;

            // then
            expect(isLastEdge.value).toBe(false);
        });
    });

    describe('initialIndex', () => {
        it('initialIndex가 주어지면 onMounted에서 해당 인덱스로 초기화되어야 한다', async () => {
            // given
            const TestComponent = defineComponent({
                template: '<div></div>',
                setup() {
                    const list = ref(['item1', 'item2', 'item3']);
                    const initialIndex = ref(2);
                    const { selectedIndex } = useIndexSelector(list, undefined, initialIndex);
                    return { selectedIndex };
                },
            });

            // when
            const wrapper = mount(TestComponent);

            // then
            expect(wrapper.vm.selectedIndex).toBe(2);
        });

        it('initialIndex가 비활성화된 인덱스를 가리키면 다음 활성 인덱스로 초기화되어야 한다', async () => {
            // given
            const TestComponent = defineComponent({
                template: '<div></div>',
                setup() {
                    const list = ref(['item1', 'item2', 'item3', 'item4']);
                    const disabled = ref((item: string, index: number) => index === 1);
                    const initialIndex = ref(1);
                    const { selectedIndex } = useIndexSelector(list, disabled, initialIndex);
                    return { selectedIndex };
                },
            });

            // when
            const wrapper = mount(TestComponent);

            // then
            expect(wrapper.vm.selectedIndex).toBe(2);
        });

        it('initialIndex가 주어지지 않으면 0으로 초기화되어야 한다', async () => {
            // given
            const TestComponent = defineComponent({
                template: '<div></div>',
                setup() {
                    const list = ref(['item1', 'item2', 'item3']);
                    const { selectedIndex } = useIndexSelector(list);
                    return { selectedIndex };
                },
            });

            // when
            const wrapper = mount(TestComponent);

            // then
            expect(wrapper.vm.selectedIndex).toBe(0);
        });

        it('initialIndex가 범위를 벗어나면 INVALID_INDEX가 설정되어야 한다', async () => {
            // given
            const TestComponent = defineComponent({
                template: '<div></div>',
                setup() {
                    const list = ref(['item1', 'item2', 'item3']);
                    const initialIndex = ref(5);
                    const { selectedIndex } = useIndexSelector(list, undefined, initialIndex);
                    return { selectedIndex };
                },
            });

            // when
            const wrapper = mount(TestComponent);

            // then
            expect(wrapper.vm.selectedIndex).toBe(-1);
        });
    });
});
