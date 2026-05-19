import { propsUtil } from '@/utils';

/**
 * VsDatePicker 등에서 사용하는 ISO date / datetime-local / time / month 문자열 패턴.
 * 이 패턴이 매칭되면 number 검증을 건너뛰고 유효한 값으로 인정한다.
 */
const ISO_DATE_LIKE_PATTERN = /^(?:\d{4}-\d{2}(?:-\d{2})?(?:T\d{2}:\d{2}(?::\d{2})?)?|\d{2}:\d{2}(?::\d{2})?)$/;

function isIsoDateLike(value: number | string): boolean {
    return typeof value === 'string' && ISO_DATE_LIKE_PATTERN.test(value);
}

export function getMinMaxProps(
    componentName: string,
    options: {
        minDefault?: number | string;
        maxDefault?: number | string;
    } = {},
) {
    const { minDefault = 0, maxDefault = Number.MAX_SAFE_INTEGER } = options;

    return {
        min: {
            type: [Number, String],
            default: minDefault,
            validator: (value: number | string) =>
                isIsoDateLike(value) || propsUtil.checkValidNumber(componentName, 'min', value),
        },
        max: {
            type: [Number, String],
            default: maxDefault,
            validator: (value: number | string) =>
                isIsoDateLike(value) || propsUtil.checkValidNumber(componentName, 'max', value),
        },
    };
}
