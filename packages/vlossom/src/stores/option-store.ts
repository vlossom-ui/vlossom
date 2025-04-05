import { ref, readonly, type Ref } from 'vue';
import { utils } from '@/utils';

import type { GlobalColorScheme, StyleSet } from '@/declaration';

interface OptionStoreState {
    theme: 'light' | 'dark';
    globalColorScheme: GlobalColorScheme;
    styleSets: StyleSet;
    globalRadiusRatio: number;
}

export class OptionStore {
    private _options: Ref<OptionStoreState> = ref({
        theme: 'light',
        globalColorScheme: {},
        styleSets: {},
        globalRadiusRatio: 1,
    });

    get options() {
        return readonly(this._options.value);
    }

    private updateOptions(updater: (current: OptionStoreState) => OptionStoreState) {
        this._options.value = updater(this._options.value);
    }

    getTheme() {
        return this._options.value.theme;
    }

    setTheme(theme: 'light' | 'dark') {
        this.updateOptions((current) => ({
            ...current,
            theme,
        }));
    }

    setGlobalColorScheme(colorScheme: GlobalColorScheme) {
        this.updateOptions((current) => ({
            ...current,
            globalColorScheme: { ...colorScheme },
        }));
    }

    getGlobalColorScheme(component: string) {
        return this._options.value.globalColorScheme[component] || this._options.value.globalColorScheme.default;
    }

    setGlobalRadiusRatio(radiusRatio: number) {
        if (isNaN(radiusRatio) || radiusRatio < 0 || radiusRatio > 1) {
            utils.log.error('VlossomOptions', 'The radius ratio must be between 0 and 1');
            return;
        }

        this.updateOptions((current) => ({
            ...current,
            globalRadiusRatio: radiusRatio,
        }));

        const root: HTMLElement | null = document.querySelector(':root');
        if (root) {
            root.style.setProperty('--vs-radius-ratio', radiusRatio.toString());
        }
    }

    registerStyleSet(styleSet: StyleSet) {
        this.updateOptions((current) => {
            const newStyleSets = { ...current.styleSets };

            Object.entries(styleSet).forEach(([key, value]) => {
                const styleSets = newStyleSets[key as keyof StyleSet];

                if (!styleSets) {
                    newStyleSets[key as keyof StyleSet] = { ...value };
                } else {
                    Object.assign(styleSets, { ...value });
                }
            });

            return {
                ...current,
                styleSets: newStyleSets,
            };
        });
    }

    getStyleSet(component: string, styleSetName: string) {
        return this._options.value.styleSets[component as keyof StyleSet]?.[styleSetName];
    }
}
