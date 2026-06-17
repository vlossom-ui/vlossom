import { ref, type Ref, computed } from 'vue';
import type { GlobalColorSchemes, GlobalStyleSets, Theme, VsComponent } from '@/declaration';
import { logUtil, numberUtil } from '@/utils';

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
        if (isNaN(radiusRatio)) {
            logUtil.warning('OptionsStore', 'Radius ratio should be a number');
        }

        if (radiusRatio < 0 || radiusRatio > 1) {
            logUtil.warning('OptionsStore', 'Radius ratio should be in the range of 0 to 1');
        }

        this._radiusRatio.value = numberUtil.clamp(radiusRatio, 0, 1);
    }

    public getComponentStyleSet<T extends { [key: string]: any }>(
        styleSetName: string,
        component: VsComponent | string,
    ): Partial<T> {
        return this._styleSet.value[styleSetName]?.[component] || {};
    }
}
