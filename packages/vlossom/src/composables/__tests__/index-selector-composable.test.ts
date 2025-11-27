import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import { useIndexSelector } from '../index-selector-composable';

describe('index-selector-composable', () => {
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
        it('비활성화된 인덱스는 true를 반환해야 한다', () => {
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

    describe('findNextActiveIndex', () => {
        it('다음 활성화된 인덱스를 찾아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3', 'item4']);
            const disabled = ref((item: string, index: number) => index === 1);
            const { findNextActiveIndex } = useIndexSelector(list, disabled);

            // when, then
            expect(findNextActiveIndex(0)).toBe(0);
            expect(findNextActiveIndex(1)).toBe(2);
            expect(findNextActiveIndex(2)).toBe(2);
        });

        it('마지막 인덱스를 넘어가면 처음부터 찾아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { findNextActiveIndex } = useIndexSelector(list);

            // when, then
            expect(findNextActiveIndex(3)).toBe(0);
            expect(findNextActiveIndex(4)).toBe(1);
        });

        it('모든 항목이 비활성화된 경우 시작 인덱스를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => true);
            const { findNextActiveIndex } = useIndexSelector(list, disabled);

            // when, then
            expect(findNextActiveIndex(0)).toBe(0);
            expect(findNextActiveIndex(1)).toBe(1);
        });
    });

    describe('findPreviousActiveIndex', () => {
        it('이전 활성화된 인덱스를 찾아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3', 'item4']);
            const disabled = ref((item: string, index: number) => index === 1);
            const { findPreviousActiveIndex } = useIndexSelector(list, disabled);

            // when, then
            expect(findPreviousActiveIndex(3)).toBe(3);
            expect(findPreviousActiveIndex(2)).toBe(2);
            expect(findPreviousActiveIndex(1)).toBe(0);
        });

        it('첫 인덱스 이전은 마지막부터 찾아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { findPreviousActiveIndex } = useIndexSelector(list);

            // when, then
            expect(findPreviousActiveIndex(-1)).toBe(2);
            expect(findPreviousActiveIndex(-2)).toBe(1);
        });

        it('모든 항목이 비활성화된 경우 시작 인덱스를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => true);
            const { findPreviousActiveIndex } = useIndexSelector(list, disabled);

            // when, then
            expect(findPreviousActiveIndex(2)).toBe(2);
            expect(findPreviousActiveIndex(1)).toBe(1);
        });
    });

    describe('getInitialIndex', () => {
        it('유효한 값이 주어지면 해당 값을 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { getInitialIndex } = useIndexSelector(list);

            // when, then
            expect(getInitialIndex(0)).toBe(0);
            expect(getInitialIndex(1)).toBe(1);
            expect(getInitialIndex(2)).toBe(2);
        });

        it('비활성화된 인덱스가 주어지면 다음 활성화된 인덱스를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => [0, 1].includes(index));
            const { getInitialIndex } = useIndexSelector(list, disabled);

            // when, then
            expect(getInitialIndex(0)).toBe(2);
            expect(getInitialIndex(1)).toBe(2);
        });

        it('범위를 벗어난 값이 주어지면 첫 활성화된 인덱스를 반환해야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const { getInitialIndex } = useIndexSelector(list);

            // when, then
            expect(getInitialIndex(-1)).toBe(0);
            expect(getInitialIndex(5)).toBe(0);
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

        it('비활성화된 인덱스를 선택하면 selectedIndex가 변경되지 않아야 한다', () => {
            // given
            const list = ref(['item1', 'item2', 'item3']);
            const disabled = ref((item: string, index: number) => index === 1);
            const { selectIndex, selectedIndex } = useIndexSelector(list, disabled);
            selectedIndex.value = 0;

            // when
            selectIndex(1);

            // then
            expect(selectedIndex.value).toBe(0);
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
});
