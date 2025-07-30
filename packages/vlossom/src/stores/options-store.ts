import type { GlobalColorSchemes, GlobalStyleSets, Theme } from '@/declaration';
import { ref, type Ref } from 'vue';

export class OptionsStore {
    private _colorScheme: Ref<GlobalColorSchemes> = ref({});
    private _styleSet: Ref<GlobalStyleSets> = ref({});
    private _theme: Ref<Theme> = ref('light');
    private _radiusRatio: Ref<number> = ref(1);

    get colorScheme(): Ref<GlobalColorSchemes> {
        return this._colorScheme;
    }

    set colorScheme(colorScheme: GlobalColorSchemes) {
        this._colorScheme.value = colorScheme;
    }

    get styleSet(): Ref<GlobalStyleSets> {
        return this._styleSet;
    }

    set styleSet(styleSet: GlobalStyleSets) {
        this._styleSet.value = styleSet;
    }

    get theme(): Ref<Theme> {
        return this._theme;
    }

    set theme(theme: Theme) {
        this._theme.value = theme;
    }

    get radiusRatio(): Ref<number> {
        return this._radiusRatio;
    }

    set radiusRatio(radiusRatio: number) {
        this._radiusRatio.value = radiusRatio;
    }
}

const optionsStore = new OptionsStore();

export function useOptionsStore() {
    return optionsStore;
}
