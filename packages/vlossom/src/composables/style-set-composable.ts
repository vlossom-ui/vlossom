import { computed, type ComputedRef, type Ref } from 'vue';
import type { VsComponent } from '@/declaration';
import { useOptionsStore } from '@/stores';
import { objectUtil, stringUtil } from '@/utils';

export function useStyleSet<T extends { [key: string]: any }>(
    component: VsComponent | string,
    styleSet: Ref<string | T | undefined>,
    additionalStyleSet?: Ref<Partial<T>>,
) {
    const componentStyleSet: ComputedRef<Partial<T>> = computed(() => {
        let resultStyleSet: Partial<T> = {};

        if (styleSet.value) {
            if (typeof styleSet.value === 'string') {
                resultStyleSet = useOptionsStore().getComponentStyleSet<T>(styleSet.value, component);
            } else {
                resultStyleSet = styleSet.value;
            }
        }

        return { ...resultStyleSet, ...(additionalStyleSet?.value ?? {}) };
    });

    const styleSetVariables: ComputedRef<Record<string, string>> = computed(() => {
        return Object.entries(componentStyleSet.value).reduce(
            (acc, [key, value]) => {
                if (objectUtil.isObject(value)) {
                    const nestedStyleSet = value;
                    Object.entries(nestedStyleSet).forEach(([nestedKey, nestedValue]) => {
                        const variableName = `--${stringUtil.kebabCase(component)}-${key}-${nestedKey}`;
                        acc[variableName] = nestedValue;
                    });
                } else {
                    const variableName = `--${stringUtil.kebabCase(component)}-${key}`;
                    acc[variableName] = value;
                }

                return acc;
            },
            {} as Record<string, string>,
        );
    });

    return {
        componentStyleSet,
        styleSetVariables,
    };
}
