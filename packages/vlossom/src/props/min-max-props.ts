import { propsUtil } from '@/utils';

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
            validator: (value: number | string) => propsUtil.checkValidNumber(componentName, 'min', value),
        },
        max: {
            type: [Number, String],
            default: maxDefault,
            validator: (value: number | string) => propsUtil.checkValidNumber(componentName, 'max', value),
        },
    };
}
