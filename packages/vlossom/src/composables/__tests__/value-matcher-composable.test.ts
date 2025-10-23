import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { useValueMatcher } from './../value-matcher-composable';
import { logUtil } from '@/utils/log-util';

describe('useValueMatcher', () => {
    describe('isMatched', () => {
        describe('multiple이 false인 경우', () => {
            it('inputValue가 trueValue와 같으면 true를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('A');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(true);
            });

            it('inputValue가 trueValue와 다르면 false를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('B');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(false);
            });

            it('boolean 값으로 비교할 수 있다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref(true);
                const trueValue = ref(true);
                const falseValue = ref(false);

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(true);
            });

            it('object 값을 deep equality로 비교한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref({ id: 'A', name: 'test' });
                const trueValue = ref({ id: 'A', name: 'test' });
                const falseValue = ref({ id: 'B' });

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(true);
            });

            it('object 값이 다르면 false를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref({ id: 'A', name: 'test' });
                const trueValue = ref({ id: 'A', name: 'different' });
                const falseValue = ref({ id: 'B' });

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(false);
            });
        });

        describe('multiple이 true인 경우', () => {
            it('inputValue 배열에 trueValue가 존재하면 true를 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B', 'C']);
                const trueValue = ref('B');
                const falseValue = ref('D');

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(true);
            });

            it('inputValue 배열에 trueValue가 없으면 false를 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'C']);
                const trueValue = ref('B');
                const falseValue = ref('D');

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(false);
            });

            it('inputValue가 빈 배열이면 false를 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref([]);
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(false);
            });

            it('inputValue가 배열이 아니면 false를 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref('not-an-array');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(false);
            });

            it('object 배열에서 deep equality로 비교한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref([{ id: 'A' }, { id: 'B' }]);
                const trueValue = ref({ id: 'A' });
                const falseValue = ref({ id: 'C' });

                // when
                const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(isMatched.value).toBe(true);
            });
        });
    });

    describe('getInitialValue', () => {
        describe('multiple이 false인 경우', () => {
            it('inputValue가 trueValue와 같으면 trueValue를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('A');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getInitialValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getInitialValue()).toBe('A');
            });

            it('inputValue가 trueValue와 다르면 falseValue를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('X');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getInitialValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getInitialValue()).toBe('B');
            });
        });

        describe('multiple이 true인 경우', () => {
            it('inputValue가 배열이면 그대로 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B']);
                const trueValue = ref('A');
                const falseValue = ref('C');

                // when
                const { getInitialValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getInitialValue()).toEqual(['A', 'B']);
            });

            it('inputValue가 배열이 아니면 빈 배열을 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref('not-array');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getInitialValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getInitialValue()).toEqual([]);
            });

            it('inputValue가 null이면 빈 배열을 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(null);
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getInitialValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getInitialValue()).toEqual([]);
            });
        });
    });

    describe('getUpdatedValue', () => {
        describe('multiple이 false인 경우', () => {
            it('isTruthy가 true이면 trueValue를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('B');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(true)).toBe('A');
            });

            it('isTruthy가 false이면 falseValue를 반환한다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('A');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(false)).toBe('B');
            });
        });

        describe('multiple이 true인 경우', () => {
            it('isTruthy가 true이고 trueValue가 없으면 추가한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B']);
                const trueValue = ref('C');
                const falseValue = ref('D');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(true)).toEqual(['A', 'B', 'C']);
            });

            it('isTruthy가 true이고 trueValue가 이미 있으면 추가하지 않는다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B', 'C']);
                const trueValue = ref('B');
                const falseValue = ref('D');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(true)).toEqual(['A', 'B', 'C']);
            });

            it('isTruthy가 false이면 trueValue를 제거한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B', 'C']);
                const trueValue = ref('B');
                const falseValue = ref('D');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(false)).toEqual(['A', 'C']);
            });

            it('isTruthy가 false이고 trueValue가 없으면 그대로 반환한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'C']);
                const trueValue = ref('B');
                const falseValue = ref('D');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(false)).toEqual(['A', 'C']);
            });

            it('inputValue가 배열이 아니면 빈 배열에서 시작한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref('not-array');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(true)).toEqual(['A']);
            });

            it('object 배열에서 deep equality로 비교하여 추가한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref([{ id: 'A' }]);
                const trueValue = ref({ id: 'B' });
                const falseValue = ref({ id: 'C' });

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(true)).toEqual([{ id: 'A' }, { id: 'B' }]);
            });

            it('object 배열에서 deep equality로 비교하여 제거한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref([{ id: 'A' }, { id: 'B' }]);
                const trueValue = ref({ id: 'B' });
                const falseValue = ref({ id: 'C' });

                // when
                const { getUpdatedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

                // then
                expect(getUpdatedValue(false)).toEqual([{ id: 'A' }]);
            });
        });
    });

    describe('getClearedValue', () => {
        it('multiple이 false이면 falseValue를 반환한다', () => {
            // given
            const multiple = ref(false);
            const inputValue = ref('A');
            const trueValue = ref('A');
            const falseValue = ref('B');

            // when
            const { getClearedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

            // then
            expect(getClearedValue()).toBe('B');
        });

        it('multiple이 true이면 빈 배열을 반환한다', () => {
            // given
            const multiple = ref(true);
            const inputValue = ref(['A', 'B', 'C']);
            const trueValue = ref('A');
            const falseValue = ref('D');

            // when
            const { getClearedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

            // then
            expect(getClearedValue()).toEqual([]);
        });

        it('falseValue가 object여도 반환한다', () => {
            // given
            const multiple = ref(false);
            const inputValue = ref({ id: 'A' });
            const trueValue = ref({ id: 'A' });
            const falseValue = ref({ id: 'B', name: 'clear' });

            // when
            const { getClearedValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

            // then
            expect(getClearedValue()).toEqual({ id: 'B', name: 'clear' });
        });
    });

    describe('addTrueValue', () => {
        beforeEach(() => {
            vi.spyOn(logUtil, 'warning').mockImplementation(() => {});
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        describe('multiple이 true인 경우', () => {
            it('trueValue를 inputValue 배열에 추가한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B']);
                const trueValue = ref('C');
                const falseValue = ref('D');

                // when
                const { addTrueValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);
                addTrueValue();

                // then
                expect(inputValue.value).toEqual(['A', 'B', 'C']);
            });

            it('trueValue가 이미 존재하면 추가하지 않는다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref(['A', 'B', 'C']);
                const trueValue = ref('B');
                const falseValue = ref('D');

                // when
                const { addTrueValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);
                addTrueValue();

                // then
                expect(inputValue.value).toEqual(['A', 'B', 'C']);
            });

            it('inputValue가 배열이 아니면 warning을 출력하고 추가하지 않는다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref('not-array');
                const trueValue = ref('A');
                const falseValue = ref('B');

                // when
                const { addTrueValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);
                addTrueValue();

                // then
                expect(logUtil.warning).toHaveBeenCalledWith('vaalue-matcher', 'modelValue is not array');
                expect(inputValue.value).toBe('not-array');
            });

            it('object trueValue를 배열에 추가한다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref([{ id: 'A' }]);
                const trueValue = ref({ id: 'B' });
                const falseValue = ref({ id: 'C' });

                // when
                const { addTrueValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);
                addTrueValue();

                // then
                expect(inputValue.value).toEqual([{ id: 'A' }, { id: 'B' }]);
            });

            it('object trueValue가 deep equality로 이미 존재하면 추가하지 않는다', () => {
                // given
                const multiple = ref(true);
                const inputValue = ref([{ id: 'A' }, { id: 'B', name: 'test' }]);
                const trueValue = ref({ id: 'B', name: 'test' });
                const falseValue = ref({ id: 'C' });

                // when
                const { addTrueValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);
                addTrueValue();

                // then
                expect(inputValue.value).toEqual([{ id: 'A' }, { id: 'B', name: 'test' }]);
            });
        });

        describe('multiple이 false인 경우', () => {
            it('아무것도 하지 않는다', () => {
                // given
                const multiple = ref(false);
                const inputValue = ref('A');
                const trueValue = ref('B');
                const falseValue = ref('C');

                // when
                const { addTrueValue } = useValueMatcher(multiple, inputValue, trueValue, falseValue);
                addTrueValue();

                // then
                expect(inputValue.value).toBe('A');
            });
        });
    });

    describe('reactive updates', () => {
        it('trueValue가 변경되면 isMatched가 업데이트된다', () => {
            // given
            const multiple = ref(false);
            const inputValue = ref('A');
            const trueValue = ref('A');
            const falseValue = ref('B');

            const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

            // when
            expect(isMatched.value).toBe(true);
            trueValue.value = 'C';

            // then
            expect(isMatched.value).toBe(false);
        });

        it('inputValue가 변경되면 isMatched가 업데이트된다', () => {
            // given
            const multiple = ref(false);
            const inputValue = ref('A');
            const trueValue = ref('A');
            const falseValue = ref('B');

            const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

            // when
            expect(isMatched.value).toBe(true);
            inputValue.value = 'B';

            // then
            expect(isMatched.value).toBe(false);
        });

        it('multiple이 변경되면 isMatched 로직이 변경된다', () => {
            // given
            const multiple = ref(false);
            const inputValue = ref('A');
            const trueValue = ref('A');
            const falseValue = ref('B');

            const { isMatched } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

            // when
            expect(isMatched.value).toBe(true);
            multiple.value = true;

            // then
            expect(isMatched.value).toBe(false); // 'A'는 배열이 아니므로 false
        });
    });
});
