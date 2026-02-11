import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { VsComponent } from '@/declaration';
import { useOptionsStore } from '@/stores';
import { objectUtil, stringUtil } from '@/utils';

export function useStyleSet<T extends { [key: string]: any }>(
    component: VsComponent | string,
    styleSet: Ref<string | T | undefined>,
    baseStyleSet: Ref<Partial<T>> = ref({}),
    additionalStyleSet: Ref<Partial<T>> = ref({}),
) {
    const componentStyleSet: ComputedRef<Partial<T>> = computed(() => {
        let resolvedStyleSet: Partial<T> = {};

        if (styleSet.value) {
            if (typeof styleSet.value === 'string') {
                resolvedStyleSet = useOptionsStore().getComponentStyleSet<T>(styleSet.value, component);
            } else {
                resolvedStyleSet = styleSet.value;
            }
        }

        const shakenBaseStyleSet = objectUtil.shake(baseStyleSet.value) as Partial<T>;
        const shakenAdditionalStyleSet = objectUtil.shake(additionalStyleSet.value) as Partial<T>;

        const mergedStyleSet = objectUtil.assign(shakenBaseStyleSet, resolvedStyleSet);
        return objectUtil.assign(mergedStyleSet, shakenAdditionalStyleSet);
    });

    const styleSetVariables: ComputedRef<Record<string, string>> = computed(() => {
        const variables = componentStyleSet.value.variables;

        if (!variables) {
            return {};
        }

        return Object.entries(variables).reduce(
            (acc, [key, value]) => {
                if (objectUtil.isObject(value)) {
                    const nestedStyleSet = value;
                    Object.entries(nestedStyleSet).forEach(([nestedKey, nestedValue]) => {
                        if (objectUtil.isObject(nestedValue)) {
                            return;
                        }
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
