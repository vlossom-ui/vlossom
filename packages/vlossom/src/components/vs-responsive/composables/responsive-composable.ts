import { type ComputedRef, type Ref, computed } from 'vue';
import { stringUtil, objectUtil } from '@/utils';

import type { Breakpoints } from '@/declaration';

function hasValue(value: unknown): value is string | number | Breakpoints {
    return value !== undefined && value !== null && value !== '';
}

export function useResponsive(
    width: Ref<string | number | Breakpoints | undefined>,
    grid: Ref<string | number | Breakpoints | undefined>,
) {
    const responsiveClasses: ComputedRef<string[]> = computed(() => {
        const classes: string[] = [];

        if (hasValue(width.value) && objectUtil.isObject(width.value)) {
            const { sm, md, lg, xl } = width.value;
            const widthClasses = [
                ...(hasValue(sm) ? ['vs-width-sm'] : []),
                ...(hasValue(md) ? ['vs-width-md'] : []),
                ...(hasValue(lg) ? ['vs-width-lg'] : []),
                ...(hasValue(xl) ? ['vs-width-xl'] : []),
            ];
            classes.push(...widthClasses);
        }

        if (hasValue(grid.value) && objectUtil.isObject(grid.value)) {
            const { sm, md, lg, xl } = grid.value;
            const gridClasses = [
                ...(hasValue(sm) ? ['vs-grid-sm'] : []),
                ...(hasValue(md) ? ['vs-grid-md'] : []),
                ...(hasValue(lg) ? ['vs-grid-lg'] : []),
                ...(hasValue(xl) ? ['vs-grid-xl'] : []),
            ];
            classes.push(...gridClasses);
        }

        return classes;
    });

    const responsiveStyles: ComputedRef<Record<string, string>> = computed(() => {
        const styles: Record<string, string> = {};
        if (hasValue(width.value)) {
            if (objectUtil.isObject(width.value)) {
                const { xs, sm, md, lg, xl } = width.value;
                const widthStyles = {
                    ...(hasValue(xs) && { ['--vs-width-xs']: stringUtil.toStringSize(xs) }),
                    ...(hasValue(sm) && { ['--vs-width-sm']: stringUtil.toStringSize(sm) }),
                    ...(hasValue(md) && { ['--vs-width-md']: stringUtil.toStringSize(md) }),
                    ...(hasValue(lg) && { ['--vs-width-lg']: stringUtil.toStringSize(lg) }),
                    ...(hasValue(xl) && { ['--vs-width-xl']: stringUtil.toStringSize(xl) }),
                };

                Object.assign(styles, widthStyles);
            } else {
                styles['width'] = stringUtil.toStringSize(width.value);
            }
        }

        if (hasValue(grid.value)) {
            if (objectUtil.isObject(grid.value)) {
                const { xs, sm, md, lg, xl } = grid.value;
                const gridStyles = {
                    ...(hasValue(xs) && { ['--vs-grid-xs']: xs?.toString() }),
                    ...(hasValue(sm) && { ['--vs-grid-sm']: sm?.toString() }),
                    ...(hasValue(md) && { ['--vs-grid-md']: md?.toString() }),
                    ...(hasValue(lg) && { ['--vs-grid-lg']: lg?.toString() }),
                    ...(hasValue(xl) && { ['--vs-grid-xl']: xl?.toString() }),
                };
                Object.assign(styles, gridStyles);
            } else {
                const gridStyles = {
                    '--vs-grid-xs': grid.value?.toString(),
                };
                Object.assign(styles, gridStyles);
            }
        }

        return styles;
    });

    return {
        responsiveClasses,
        responsiveStyles,
    };
}
