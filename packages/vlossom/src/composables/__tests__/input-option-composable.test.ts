import { describe, expect, it } from 'vitest';
import { ref, nextTick } from 'vue';
import { useInputOption } from './../input-option-composable';

describe('useInputOption', () => {
    describe('getOptionLabel', () => {
        describe('문자열 옵션', () => {
            it('문자열 옵션의 라벨을 반환한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref(['Option A', 'Option B']);
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionLabel } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const label = getOptionLabel('Option A');

                // then
                expect(label).toBe('Option A');
            });

            it('숫자 옵션을 문자열로 변환한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([1, 2, 3]);
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionLabel } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const label = getOptionLabel(1);

                // then
                expect(label).toBe('1');
            });
        });

        describe('객체 옵션', () => {
            it('optionLabel이 지정되면 해당 속성을 라벨로 사용한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([
                    { id: 1, name: 'Option A' },
                    { id: 2, name: 'Option B' },
                ]);
                const optionLabel = ref('name');
                const optionValue = ref('id');
                const { getOptionLabel } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, name: 'Option A' });

                // then
                expect(label).toBe('Option A');
            });

            it('중첩된 속성에서 라벨을 추출할 수 있다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([{ id: 1, user: { name: 'John' } }]);
                const optionLabel = ref('user.name');
                const optionValue = ref('id');
                const { getOptionLabel } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, user: { name: 'John' } });

                // then
                expect(label).toBe('John');
            });

            it('optionLabel이 없으면 객체를 JSON 문자열로 반환한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([{ id: 1, name: 'Option A' }]);
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionLabel } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, name: 'Option A' });

                // then
                expect(label).toBe('{"id":1,"name":"Option A"}');
            });

            it('라벨이 문자열이 아니면 JSON으로 변환한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([{ id: 1, count: 100 }]);
                const optionLabel = ref('count');
                const optionValue = ref('id');
                const { getOptionLabel } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, count: 100 });

                // then
                expect(label).toBe('100');
            });
        });
    });

    describe('getOptionValue', () => {
        describe('문자열 옵션', () => {
            it('문자열 옵션 자체를 값으로 반환한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref(['A', 'B', 'C']);
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const value = getOptionValue('A');

                // then
                expect(value).toBe('A');
            });
        });

        describe('객체 옵션', () => {
            it('optionValue가 지정되면 해당 속성을 값으로 사용한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([
                    { id: 1, name: 'Option A' },
                    { id: 2, name: 'Option B' },
                ]);
                const optionLabel = ref('name');
                const optionValue = ref('id');
                const { getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const value = getOptionValue({ id: 1, name: 'Option A' });

                // then
                expect(value).toBe(1);
            });

            it('중첩된 속성에서 값을 추출할 수 있다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([{ user: { id: 100 }, name: 'John' }]);
                const optionLabel = ref('name');
                const optionValue = ref('user.id');
                const { getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                const value = getOptionValue({ user: { id: 100 }, name: 'John' });

                // then
                expect(value).toBe(100);
            });

            it('optionValue가 없으면 객체 자체를 반환한다', () => {
                // given
                const inputValue = ref(null);
                const options = ref([{ id: 1, name: 'Option A' }]);
                const optionLabel = ref('name');
                const optionValue = ref('');
                const { getOptionValue } = useInputOption(inputValue, options, optionLabel, optionValue);
                const option = { id: 1, name: 'Option A' };

                // when
                const value = getOptionValue(option);

                // then
                expect(value).toBe(option);
            });
        });
    });

    describe('options watch - 옵션 변경 시 inputValue 정리', () => {
        describe('multiple이 false인 경우', () => {
            it('options가 변경되고 현재 inputValue가 새 options에 없으면 null로 설정한다', async () => {
                // given
                const inputValue = ref('A');
                const options = ref(['A', 'B', 'C']);
                const optionLabel = ref('');
                const optionValue = ref('');
                useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                options.value = ['D', 'E', 'F']; // 'A'가 없음
                await nextTick();

                // then
                expect(inputValue.value).toBeNull();
            });

            it('options가 변경되고 현재 inputValue가 새 options에 있으면 유지한다', async () => {
                // given
                const inputValue = ref('B');
                const options = ref(['A', 'B', 'C']);
                const optionLabel = ref('');
                const optionValue = ref('');
                useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                options.value = ['B', 'D', 'E']; // 'B'는 있음
                await nextTick();

                // then
                expect(inputValue.value).toBe('B');
            });

            it('객체 옵션에서 deep equality로 비교한다', async () => {
                // given
                const inputValue = ref(1);
                const options = ref([
                    { id: 1, name: 'A' },
                    { id: 2, name: 'B' },
                ]);
                const optionLabel = ref('name');
                const optionValue = ref('id');
                useInputOption(inputValue, options, optionLabel, optionValue);

                // when
                options.value = [
                    { id: 3, name: 'C' },
                    { id: 4, name: 'D' },
                ];
                await nextTick();

                // then
                expect(inputValue.value).toBeNull();
            });
        });

        describe('multiple이 true인 경우', () => {
            it('options가 변경되면 새 options에 없는 값들을 제거한다', async () => {
                // given
                const inputValue = ref(['A', 'B', 'C']);
                const options = ref(['A', 'B', 'C', 'D']);
                const optionLabel = ref('');
                const optionValue = ref('');
                const multiple = ref(true);
                useInputOption(inputValue, options, optionLabel, optionValue, multiple);

                // when
                options.value = ['B', 'D', 'E']; // 'A'와 'C'가 없음
                await nextTick();

                // then
                expect(inputValue.value).toEqual(['B']);
            });

            it('options가 변경되고 모든 값이 유효하면 유지한다', async () => {
                // given
                const inputValue = ref(['A', 'B']);
                const options = ref(['A', 'B', 'C']);
                const optionLabel = ref('');
                const optionValue = ref('');
                const multiple = ref(true);
                useInputOption(inputValue, options, optionLabel, optionValue, multiple);

                // when
                options.value = ['A', 'B', 'D'];
                await nextTick();

                // then
                expect(inputValue.value).toEqual(['A', 'B']);
            });

            it('options가 변경되고 모든 값이 무효하면 빈 배열이 된다', async () => {
                // given
                const inputValue = ref(['A', 'B']);
                const options = ref(['A', 'B', 'C']);
                const optionLabel = ref('');
                const optionValue = ref('');
                const multiple = ref(true);
                useInputOption(inputValue, options, optionLabel, optionValue, multiple);

                // when
                options.value = ['D', 'E', 'F'];
                await nextTick();

                // then
                expect(inputValue.value).toEqual([]);
            });

            it('객체 옵션에서 deep equality로 필터링한다', async () => {
                // given
                const inputValue = ref([1, 2, 3]);
                const options = ref([
                    { id: 1, name: 'A' },
                    { id: 2, name: 'B' },
                    { id: 3, name: 'C' },
                ]);
                const optionLabel = ref('name');
                const optionValue = ref('id');
                const multiple = ref(true);
                useInputOption(inputValue, options, optionLabel, optionValue, multiple);

                // when
                options.value = [
                    { id: 2, name: 'B' },
                    { id: 4, name: 'D' },
                ];
                await nextTick();

                // then
                expect(inputValue.value).toEqual([2]);
            });
        });

        describe('options가 같은 값으로 변경되는 경우', () => {
            it('deep equality로 같으면 inputValue를 변경하지 않는다', async () => {
                // given
                const inputValue = ref('A');
                const options = ref(['A', 'B', 'C']);
                const optionLabel = ref('');
                const optionValue = ref('');
                useInputOption(inputValue, options, optionLabel, optionValue);

                const initialValue = inputValue.value;

                // when
                options.value = ['A', 'B', 'C']; // 같은 값
                await nextTick();

                // then
                expect(inputValue.value).toBe(initialValue);
            });
        });
    });
});
