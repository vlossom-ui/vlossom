import { describe, expect, it } from 'vitest';
import { ref, nextTick } from 'vue';
import { useInputOption } from './../input-option-composable';

describe('useInputOption', () => {
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
