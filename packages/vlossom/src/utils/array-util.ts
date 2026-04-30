import { unique } from 'radash';

export const arrayUtil = {
    uniqBy<T>(array: T[], field: keyof T): T[] {
        return unique(array, (item) => item[field] as string | number | symbol);
    },
};
