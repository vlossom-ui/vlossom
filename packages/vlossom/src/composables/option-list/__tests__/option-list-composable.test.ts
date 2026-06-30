import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useOptionList } from './../option-list-composable';

describe('option-list-composable', () => {
    describe('id', () => {
        it('같은 객체 옵션은 순서가 바뀌어도 동일한 id를 유지한다', () => {
            // given
            const a = { name: 'A' };
            const b = { name: 'B' };
            const options = ref([a, b]);
            const { computedOptions } = useOptionList(options, ref('name'), ref(''), ref(false));

            const idA = computedOptions.value[0].id;
            const idB = computedOptions.value[1].id;

            // when
            options.value = [b, a];

            // then
            expect(computedOptions.value[0].id).toBe(idB);
            expect(computedOptions.value[1].id).toBe(idA);
        });

        it('label이 같아도 서로 다른 객체 옵션은 다른 id를 가진다', () => {
            // given
            const options = ref([{ name: 'same' }, { name: 'same' }]);

            // when
            const { computedOptions } = useOptionList(options, ref('name'), ref(''), ref(false));

            // then
            expect(computedOptions.value[0].id).not.toBe(computedOptions.value[1].id);
        });

        it('원시값 옵션의 id는 값 기반이라 순서가 바뀌어도 동일하다', () => {
            // given
            const options = ref(['apple', 'banana']);
            const { computedOptions } = useOptionList(options, ref(''), ref(''), ref(false));

            const idApple = computedOptions.value[0].id;
            const idBanana = computedOptions.value[1].id;

            // when
            options.value = ['banana', 'apple'];

            // then
            expect(computedOptions.value[0].id).toBe(idBanana);
            expect(computedOptions.value[1].id).toBe(idApple);
        });

        it('id는 CSS 선택자로 안전한 문자열이다(공백·앞자리 숫자 없음)', () => {
            // given
            const options = ref([42, 'a b', { name: 'obj' }]);

            // when
            const { computedOptions } = useOptionList(options, ref('name'), ref(''), ref(false));

            // then
            computedOptions.value.forEach(({ id }) => {
                expect(id).toMatch(/^[A-Za-z]/);
                expect(id).not.toContain(' ');
            });
        });
    });
});
