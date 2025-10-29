import { logUtil } from './log-util';

export const propsUtil = {
    checkValidNumber(componentName: string, property: string, value: number | string) {
        const num = Number(value);
        const isValid = !isNaN(num) && num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER;
        if (!isValid) {
            logUtil.propError(componentName, property, `invalid ${property} value`);
        }
        return isValid;
    },
};
