import { describe, it, expect } from 'vitest';
import { compareUtil } from './../compare-util';

describe('compare-util', () => {
    describe('compareValues()', () => {
        it('같은 문자열이면 0을 반환한다', () => {
            expect(compareUtil.compareValues('a', 'a')).toBe(0);
        });

        it('문자열 a가 b보다 작으면 음수를 반환한다', () => {
            expect(compareUtil.compareValues('a', 'b')).toBeLessThan(0);
        });

        it('문자열 a가 b보다 크면 양수를 반환한다', () => {
            expect(compareUtil.compareValues('b', 'a')).toBeGreaterThan(0);
        });

        it('같은 숫자면 0을 반환한다', () => {
            expect(compareUtil.compareValues(5, 5)).toBe(0);
        });

        it('숫자 a가 b보다 작으면 음수를 반환한다', () => {
            expect(compareUtil.compareValues(3, 7)).toBeLessThan(0);
        });

        it('숫자 a가 b보다 크면 양수를 반환한다', () => {
            expect(compareUtil.compareValues(9, 2)).toBeGreaterThan(0);
        });

        it('같은 불리언이면 0을 반환한다', () => {
            expect(compareUtil.compareValues(true, true)).toBe(0);
        });

        it('true와 false를 비교하면 1을 반환한다', () => {
            expect(compareUtil.compareValues(true, false)).toBe(1);
        });

        it('false와 true를 비교하면 -1을 반환한다', () => {
            expect(compareUtil.compareValues(false, true)).toBe(-1);
        });

        it('같은 Date면 0을 반환한다', () => {
            const a = new Date(2020, 1, 1);
            const b = new Date(2020, 1, 1);
            expect(compareUtil.compareValues(a, b)).toBe(0);
        });

        it('더 이른 Date면 음수를 반환한다', () => {
            const a = new Date(2020, 1, 1);
            const b = new Date(2021, 1, 1);
            expect(compareUtil.compareValues(a, b)).toBeLessThan(0);
        });

        it('더 늦은 Date면 양수를 반환한다', () => {
            const a = new Date(2022, 1, 1);
            const b = new Date(2021, 1, 1);
            expect(compareUtil.compareValues(a, b)).toBeGreaterThan(0);
        });

        it('객체의 각 속성을 문자열로 비교하므로, { a: 1 }이 { b: 2 }보다 사전적으로 앞서 음수를 반환한다', () => {
            expect(compareUtil.compareValues({ a: 1 }, { b: 2 })).toBeLessThan(0);
        });

        it('배열의 값을 문자열로 비교하므로, [1, 2]가 [3, 4]보다 사전적으로 앞서 음수를 반환한다', () => {
            expect(compareUtil.compareValues([1, 2], [3, 4])).toBeLessThan(0);
        });

        it('서로 다른 타입이면 0을 반환한다', () => {
            expect(compareUtil.compareValues('1', 1)).toBe(0);
            expect(compareUtil.compareValues(1, true)).toBe(0);
            expect(compareUtil.compareValues({}, 42)).toBe(0);
            expect(compareUtil.compareValues([], 'str')).toBe(0);
        });

        it('둘 다 null이면 0을 반환한다', () => {
            expect(compareUtil.compareValues(null, null)).toBe(0);
        });

        it('aValue만 null이면 1을 반환한다', () => {
            expect(compareUtil.compareValues(null, 123)).toBe(1);
        });

        it('bValue만 null이면 -1을 반환한다', () => {
            expect(compareUtil.compareValues(123, null)).toBe(-1);
        });

        it('undefined는 다른 타입과 비교 시 0을 반환한다', () => {
            expect(compareUtil.compareValues(undefined, undefined)).toBe(0);
            expect(compareUtil.compareValues(undefined, 1)).toBe(0);
        });
    });
});
