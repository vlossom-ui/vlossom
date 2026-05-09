import { computed, ref, type ComputedRef, type CSSProperties, type Ref } from 'vue';
import type { VsComponent } from '@/declaration';
import { useOptionsStore } from '@/stores';
import { objectUtil, stringUtil } from '@/utils';

export function extractInlineStyle(styleSet: { [key: string]: any } | undefined | null): CSSProperties {
    const result: CSSProperties = {};

    if (!styleSet) {
        return result;
    }

    for (const [key, value] of Object.entries(styleSet)) {
        if (key.startsWith('$')) {
            continue;
        }
        if (value === undefined || value === null) {
            continue;
        }
        (result as Record<string, unknown>)[key] = value;
    }

    return result;
}

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
        const componentKey = stringUtil.kebabCase(component);
        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(componentStyleSet.value)) {
            if (!key.startsWith('$') || objectUtil.isObject(value)) {
                continue;
            }
            if (value === undefined || value === null) {
                continue;
            }
            result[`--${componentKey}-${key.slice(1)}`] = value as string;
        }

        return result;
    });

    const componentInlineStyle: ComputedRef<CSSProperties> = computed(() =>
        extractInlineStyle(componentStyleSet.value),
    );

    return {
        componentStyleSet,
        styleSetVariables,
        componentInlineStyle,
    };
}
