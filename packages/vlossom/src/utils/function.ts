import { debounce, throttle } from 'radash';

export const functionUtil = {
    debounce(func: (...args: any) => any, delay: number = 0): (...args: any) => any {
        return debounce({ delay }, func);
    },

    throttle(func: (...args: any) => any, interval: number = 0): (...args: any) => any {
        return throttle({ interval }, func);
    },
};
