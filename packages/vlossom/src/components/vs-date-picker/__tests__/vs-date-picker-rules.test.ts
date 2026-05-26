import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useVsDatePickerRules } from '../vs-date-picker-rules';

describe('useVsDatePickerRules', () => {
    function setup(
        opts: {
            required?: boolean;
            min?: string;
            max?: string;
        } = {},
    ) {
        return useVsDatePickerRules(ref(opts.required ?? false), ref(opts.min), ref(opts.max));
    }

    describe('requiredCheck', () => {
        it('required=true이고 value가 빈 문자열이면 메시지를 반환한다', () => {
            const { requiredCheck } = setup({ required: true });
            expect(requiredCheck('')).toBe('Required');
        });

        it('required=true이고 value가 채워져 있으면 빈 문자열을 반환한다', () => {
            const { requiredCheck } = setup({ required: true });
            expect(requiredCheck('2026-05-18')).toBe('');
        });

        it('required=false이고 value가 빈 문자열이어도 빈 문자열을 반환한다', () => {
            const { requiredCheck } = setup({ required: false });
            expect(requiredCheck('')).toBe('');
        });
    });

    describe('minCheck', () => {
        it('min보다 이전 값이면 메시지를 반환한다', () => {
            const { minCheck } = setup({ min: '2026-05-18' });
            expect(minCheck('2026-05-17')).toContain('on or after');
        });

        it('min과 같거나 이후면 빈 문자열을 반환한다', () => {
            const { minCheck } = setup({ min: '2026-05-18' });
            expect(minCheck('2026-05-19')).toBe('');
            expect(minCheck('2026-05-18')).toBe('');
        });

        it('value가 빈 문자열이면 빈 문자열을 반환한다', () => {
            const { minCheck } = setup({ min: '2026-05-18' });
            expect(minCheck('')).toBe('');
        });

        it('datetime-local 형식에서도 문자열 사전식 비교가 동작한다', () => {
            const { minCheck } = setup({ min: '2026-05-18T15:30' });
            expect(minCheck('2026-05-18T15:29')).toContain('on or after');
            expect(minCheck('2026-05-18T15:31')).toBe('');
        });
    });

    describe('maxCheck', () => {
        it('max보다 이후 값이면 메시지를 반환한다', () => {
            const { maxCheck } = setup({ max: '2026-05-18' });
            expect(maxCheck('2026-05-19')).toContain('on or before');
        });

        it('max와 같거나 이전이면 빈 문자열을 반환한다', () => {
            const { maxCheck } = setup({ max: '2026-05-18' });
            expect(maxCheck('2026-05-17')).toBe('');
            expect(maxCheck('2026-05-18')).toBe('');
        });

        it('time 형식에서도 문자열 사전식 비교가 동작한다', () => {
            const { maxCheck } = setup({ max: '15:30' });
            expect(maxCheck('15:31')).toContain('on or before');
            expect(maxCheck('15:29')).toBe('');
        });
    });
});
