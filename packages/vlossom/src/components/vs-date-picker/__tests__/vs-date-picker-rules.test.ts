import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useVsDatePickerRules } from '../vs-date-picker-rules';

describe('useVsDatePickerRules', () => {
    function setup(opts: {
        required?: boolean;
        min?: Date;
        max?: Date;
        canSelectDate?: (date: Date) => boolean;
    } = {}) {
        return useVsDatePickerRules(
            ref(opts.required ?? false),
            ref(opts.min),
            ref(opts.max),
            ref(opts.canSelectDate),
        );
    }

    describe('requiredCheck', () => {
        it('required=true이고 value가 null이면 메시지를 반환한다', () => {
            const { requiredCheck } = setup({ required: true });
            expect(requiredCheck(null)).toBe('Required');
        });

        it('required=true이고 value가 Date면 빈 문자열을 반환한다', () => {
            const { requiredCheck } = setup({ required: true });
            expect(requiredCheck(new Date('2026-05-18T00:00:00Z'))).toBe('');
        });

        it('required=false이고 value가 null이어도 빈 문자열을 반환한다', () => {
            const { requiredCheck } = setup({ required: false });
            expect(requiredCheck(null)).toBe('');
        });
    });

    describe('minCheck', () => {
        it('min보다 이전 날짜면 메시지를 반환한다', () => {
            const min = new Date('2026-05-18T00:00:00Z');
            const { minCheck } = setup({ min });
            const before = new Date('2026-05-17T00:00:00Z');
            expect(minCheck(before)).toContain('on or after');
        });

        it('min과 같거나 이후면 빈 문자열을 반환한다', () => {
            const min = new Date('2026-05-18T00:00:00Z');
            const { minCheck } = setup({ min });
            const after = new Date('2026-05-19T00:00:00Z');
            expect(minCheck(after)).toBe('');
        });

        it('value가 null이면 빈 문자열을 반환한다', () => {
            const { minCheck } = setup({ min: new Date('2026-05-18T00:00:00Z') });
            expect(minCheck(null)).toBe('');
        });
    });

    describe('maxCheck', () => {
        it('max보다 이후 날짜면 메시지를 반환한다', () => {
            const max = new Date('2026-05-18T00:00:00Z');
            const { maxCheck } = setup({ max });
            const after = new Date('2026-05-19T00:00:00Z');
            expect(maxCheck(after)).toContain('on or before');
        });

        it('max와 같거나 이전이면 빈 문자열을 반환한다', () => {
            const max = new Date('2026-05-18T00:00:00Z');
            const { maxCheck } = setup({ max });
            const before = new Date('2026-05-17T00:00:00Z');
            expect(maxCheck(before)).toBe('');
        });
    });

    describe('notDisabledCheck', () => {
        it('canSelectDate가 false를 반환하면 메시지를 반환한다', () => {
            const canSelectDate = (date: Date) => !date.toISOString().startsWith('2026-05-18');
            const { notDisabledCheck } = setup({ canSelectDate });
            const disabled = new Date('2026-05-18T15:30:00Z');
            expect(notDisabledCheck(disabled)).toContain('not selectable');
        });

        it('canSelectDate가 true를 반환하면 빈 문자열을 반환한다', () => {
            const canSelectDate = (date: Date) => !date.toISOString().startsWith('2026-05-18');
            const { notDisabledCheck } = setup({ canSelectDate });
            const normal = new Date('2026-05-19T00:00:00Z');
            expect(notDisabledCheck(normal)).toBe('');
        });

        it('value가 null이면 빈 문자열을 반환한다', () => {
            const canSelectDate = () => false;
            const { notDisabledCheck } = setup({ canSelectDate });
            expect(notDisabledCheck(null)).toBe('');
        });
    });

    describe('invalidValueCheck', () => {
        it('Date 객체에 대해 빈 문자열을 반환한다', () => {
            const { invalidValueCheck } = setup();
            expect(invalidValueCheck(new Date('2026-05-18T00:00:00Z'))).toBe('');
        });

        it('null에 대해 빈 문자열을 반환한다 (필수 여부는 requiredCheck 책임)', () => {
            const { invalidValueCheck } = setup();
            expect(invalidValueCheck(null)).toBe('');
        });

        it('undefined(파싱 실패 신호)에 대해 메시지를 반환한다', () => {
            const { invalidValueCheck } = setup();
            expect(invalidValueCheck(undefined as unknown as null)).toBe('Invalid date');
        });
    });
});
