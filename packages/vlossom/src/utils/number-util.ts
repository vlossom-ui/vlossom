import { clamp } from '@vueuse/core';

export const numberUtil = {
    clamp(value: number, min: number, max: number): number {
        if (isNaN(value)) {
            return min;
        }

        return clamp(value, min, max);
    },
};
