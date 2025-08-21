import { ref, type Ref, computed } from 'vue';
import type { GlobalColorSchemes, GlobalStyleSets, Theme, VsComponent } from '@/declaration';

export class OptionsStore {
    private _colorScheme: Ref<GlobalColorSchemes> = ref({});
    private _styleSet: Ref<GlobalStyleSets> = ref({});
    private _theme: Ref<Theme> = ref('light');
    private _radiusRatio: Ref<number> = ref(1);

    public colorScheme = computed(() => this._colorScheme.value);

    public setColorScheme(colorScheme: GlobalColorSchemes) {
        this._colorScheme.value = colorScheme;
    }

    public styleSet = computed(() => this._styleSet.value);

    public setStyleSet(styleSet: GlobalStyleSets) {
        this._styleSet.value = styleSet;
    }

    public theme = computed(() => this._theme.value);

    public setTheme(theme: Theme) {
        this._theme.value = theme;
    }

    public radiusRatio = computed(() => this._radiusRatio.value);

    public setRadiusRatio(radiusRatio: number) {
        this._radiusRatio.value = radiusRatio;
    }

    public getComponentStyleSet<T extends { [key: string]: any }>(
        styleSetName: string,
        component: VsComponent | string,
    ): Partial<T> {
        return this._styleSet.value[styleSetName]?.[component] || {};
    }
}

const optionsStore = new OptionsStore();

export function useOptionsStore() {
    return optionsStore;
}
