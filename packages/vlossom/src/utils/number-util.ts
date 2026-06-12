import { logUtil } from './log-util';

export const numberUtil = {
    clamp(value: number, min: number, max: number): number {
        if (isNaN(value)) {
            logUtil.warning('numberUtil', 'value should be a number');
            return min;
        }

        if (value < min || value > max) {
            logUtil.warning('numberUtil', `value should be in the range of ${min} to ${max}`);
        }

        return Math.min(Math.max(value, min), max);
    },
};
