import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logUtil } from './../log-util';
import { numberUtil } from './../number-util';

describe('number-util', () => {
    describe('clamp()', () => {
        beforeEach(() => {
            vi.spyOn(logUtil, 'warning').mockImplementation(() => {});
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('범위 안의 값은 그대로 반환한다', () => {
            expect(numberUtil.clamp(5, 0, 10)).toBe(5);
            expect(logUtil.warning).not.toHaveBeenCalled();
        });

        it('min과 같은 값은 그대로 반환한다', () => {
            expect(numberUtil.clamp(0, 0, 10)).toBe(0);
            expect(logUtil.warning).not.toHaveBeenCalled();
        });

        it('max와 같은 값은 그대로 반환한다', () => {
            expect(numberUtil.clamp(10, 0, 10)).toBe(10);
            expect(logUtil.warning).not.toHaveBeenCalled();
        });
    });
});
