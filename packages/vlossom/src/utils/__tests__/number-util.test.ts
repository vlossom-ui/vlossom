import { describe, expect, it } from 'vitest';
import { numberUtil } from './../number-util';

describe('number-util', () => {
    describe('clamp()', () => {
        it('범위 안의 값은 그대로 반환한다', () => {
            expect(numberUtil.clamp(5, 0, 10)).toBe(5);
        });

        it('범위를 벗어난 값은 min 또는 max로 제한한다', () => {
            expect(numberUtil.clamp(-1, 0, 10)).toBe(0);
            expect(numberUtil.clamp(11, 0, 10)).toBe(10);
        });

        it('NaN은 min을 반환한다', () => {
            expect(numberUtil.clamp(NaN, 0, 10)).toBe(0);
        });
    });
});
