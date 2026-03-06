import { throttle, debounce } from 'radash';

/**
 * NOTE: ex. If type is TResult | ((...args: TArgs) => TResult), return "the only" function that returns the TResult.
 */
function toCallable<TArgs extends any[] = [], TResult = boolean>(
    maybeFn: undefined | TResult | ((...args: TArgs) => TResult),
): (...args: TArgs) => TResult {
    if (maybeFn === undefined) {
        return () => undefined as TResult;
    }
    if (typeof maybeFn === 'function') {
        return maybeFn as (...args: TArgs) => TResult;
    }
    return () => maybeFn;
}

export const functionUtil = {
    throttle,
    debounce,
    toCallable,
};
