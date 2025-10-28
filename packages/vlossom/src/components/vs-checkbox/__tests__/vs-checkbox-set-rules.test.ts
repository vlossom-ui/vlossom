import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useVsCheckboxSetRules } from './../vs-checkbox-set-rules';

describe('useVsCheckboxSetRules', () => {
    describe('requiredCheck', () => {
        it('required가 false이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(0);
            const { requiredCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = requiredCheck([]);

            // then
            expect(result).toBe('');
        });

        it('required가 true이고 배열이 비어있으면 required를 반환한다', () => {
            // given
            const required = ref(true);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(0);
            const { requiredCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = requiredCheck([]);

            // then
            expect(result).toBe('required');
        });

        it('required가 true이고 배열이 비어있지 않으면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(true);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(0);
            const { requiredCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = requiredCheck(['A', 'B']);

            // then
            expect(result).toBe('');
        });

        it('required가 true이고 배열이 null이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(true);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(0);
            const { requiredCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = requiredCheck(null as any);

            // then
            expect(result).toBe('');
        });

        it('required가 true이고 배열이 undefined이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(true);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(0);
            const { requiredCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = requiredCheck(undefined as any);

            // then
            expect(result).toBe('');
        });
    });

    describe('maxCheck', () => {
        it('배열 길이가 max 이하이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(3);
            const min = ref(0);
            const { maxCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = maxCheck(['A', 'B']);

            // then
            expect(result).toBe('');
        });

        it('배열 길이가 max와 같으면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(2);
            const min = ref(0);
            const { maxCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = maxCheck(['A', 'B']);

            // then
            expect(result).toBe('');
        });

        it('배열 길이가 max보다 크면 에러 메시지를 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(2);
            const min = ref(0);
            const { maxCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = maxCheck(['A', 'B', 'C']);

            // then
            expect(result).toBe('max number of items: 2');
        });

        it('max가 문자열이어도 정상적으로 처리한다', () => {
            // given
            const required = ref(false);
            const max = ref('3');
            const min = ref(0);
            const { maxCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = maxCheck(['A', 'B', 'C', 'D']);

            // then
            expect(result).toBe('max number of items: 3');
        });

        it('배열이 null이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(2);
            const min = ref(0);
            const { maxCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = maxCheck(null as any);

            // then
            expect(result).toBe('');
        });
    });

    describe('minCheck', () => {
        it('배열 길이가 min 이상이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(2);
            const { minCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = minCheck(['A', 'B', 'C']);

            // then
            expect(result).toBe('');
        });

        it('배열 길이가 min과 같으면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(2);
            const { minCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = minCheck(['A', 'B']);

            // then
            expect(result).toBe('');
        });

        it('배열 길이가 min보다 작으면 에러 메시지를 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(2);
            const { minCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = minCheck(['A']);

            // then
            expect(result).toBe('min number of items: 2');
        });

        it('배열이 비어있고 min이 0보다 크면 에러 메시지를 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(1);
            const { minCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = minCheck([]);

            // then
            expect(result).toBe('min number of items: 1');
        });

        it('min이 문자열이어도 정상적으로 처리한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref('2');
            const { minCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = minCheck(['A']);

            // then
            expect(result).toBe('min number of items: 2');
        });

        it('배열이 null이면 빈 문자열을 반환한다', () => {
            // given
            const required = ref(false);
            const max = ref(Number.MAX_SAFE_INTEGER);
            const min = ref(2);
            const { minCheck } = useVsCheckboxSetRules(required, max, min);

            // when
            const result = minCheck(null as any);

            // then
            expect(result).toBe('');
        });
    });
});
