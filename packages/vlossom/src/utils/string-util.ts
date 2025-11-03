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
    convertToString(value: any): string {
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    },
    toStringSize(value: number | string): string {
        const stringValue = String(value);
        // 단위가 없는 숫자인지 확인 (정수 및 소수점 포함)
        if (/^\d+(\.\d+)?$/.test(stringValue)) {
            return `${stringValue}px`;
        }
        return stringValue;
    },
    kebabCase,
};
