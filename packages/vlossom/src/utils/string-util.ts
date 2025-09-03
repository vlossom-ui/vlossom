import { kebabCase } from 'change-case';
import { customAlphabet } from 'nanoid';

export const stringUtil = {
    createID(size = 10): string {
        // element ID should not start with a number
        // https://www.w3schools.com/html/html_id.asp
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const nanoid = customAlphabet(chars, size);
        return nanoid();
    },
    toStringSize(value: number | string): string {
        if (typeof value === 'number') {
            return `${value}px`;
        }
        return value;
    },
    kebabCase,
};
