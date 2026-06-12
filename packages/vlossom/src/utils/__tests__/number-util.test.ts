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

        it('min보다 작은 값은 경고를 남기고 min을 반환한다', () => {
            expect(numberUtil.clamp(-1, 0, 10)).toBe(0);
            expect(logUtil.warning).toHaveBeenCalledWith('numberUtil', 'value should be in the range of 0 to 10');
        });

        it('max보다 큰 값은 경고를 남기고 max를 반환한다', () => {
            expect(numberUtil.clamp(11, 0, 10)).toBe(10);
            expect(logUtil.warning).toHaveBeenCalledWith('numberUtil', 'value should be in the range of 0 to 10');
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
