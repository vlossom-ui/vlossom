import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useOptionLabelValue } from './../option-label-value-composable';

describe('useInputOption', () => {
    describe('getOptionLabel', () => {
        describe('문자열 옵션', () => {
            it('문자열 옵션의 라벨을 반환한다', () => {
                // given
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionLabel } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const label = getOptionLabel('Option A');

                // then
                expect(label).toBe('Option A');
            });

            it('숫자 옵션을 문자열로 변환한다', () => {
                // given
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionLabel } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const label = getOptionLabel(1);

                // then
                expect(label).toBe('1');
            });
        });

        describe('객체 옵션', () => {
            it('optionLabel이 지정되면 해당 속성을 라벨로 사용한다', () => {
                // given
                const optionLabel = ref('name');
                const optionValue = ref('id');
                const { getOptionLabel } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, name: 'Option A' });

                // then
                expect(label).toBe('Option A');
            });

            it('중첩된 속성에서 라벨을 추출할 수 있다', () => {
                // given
                const optionLabel = ref('user.name');
                const optionValue = ref('id');
                const { getOptionLabel } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, user: { name: 'John' } });

                // then
                expect(label).toBe('John');
            });

            it('optionLabel이 없으면 객체를 JSON 문자열로 반환한다', () => {
                // given
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionLabel } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const label = getOptionLabel({ id: 1, name: 'Option A' });

                // then
                expect(label).toBe('{"id":1,"name":"Option A"}');
            });

            it('라벨이 문자열이 아니면 JSON으로 변환한다', () => {
                // given
                const optionLabel = ref('count');
                const optionValue = ref('id');
                const { getOptionLabel } = useOptionLabelValue(optionLabel, optionValue);

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
                const optionLabel = ref('');
                const optionValue = ref('');
                const { getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const value = getOptionValue('A');

                // then
                expect(value).toBe('A');
            });
        });

        describe('객체 옵션', () => {
            it('optionValue가 지정되면 해당 속성을 값으로 사용한다', () => {
                // given
                const optionLabel = ref('name');
                const optionValue = ref('id');
                const { getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const value = getOptionValue({ id: 1, name: 'Option A' });

                // then
                expect(value).toBe(1);
            });

            it('중첩된 속성에서 값을 추출할 수 있다', () => {
                // given
                const optionLabel = ref('name');
                const optionValue = ref('user.id');
                const { getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

                // when
                const value = getOptionValue({ user: { id: 100 }, name: 'John' });

                // then
                expect(value).toBe(100);
            });

            it('optionValue가 없으면 객체 자체를 반환한다', () => {
                // given
                const optionLabel = ref('name');
                const optionValue = ref('');
                const { getOptionValue } = useOptionLabelValue(optionLabel, optionValue);
                const option = { id: 1, name: 'Option A' };

                // when
                const value = getOptionValue(option);

                // then
                expect(value).toBe(option);
            });
        });
    });
});
