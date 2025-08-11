import { kebabCase } from 'change-case';

export const stringUtil = {
    toStringSize(value: number | string): string {
        if (typeof value === 'number') {
            return `${value}px`;
        }
        return value;
    },
    kebabCase,
};
