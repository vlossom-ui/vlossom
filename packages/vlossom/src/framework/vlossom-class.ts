import type { GlobalColorSchemes, GlobalStyleSets, Theme, VlossomOptions } from '@/declaration';
import { useOptionsStore } from '@/stores';

export class Vlossom {
    private optionsStore = useOptionsStore();

    constructor(options?: VlossomOptions) {
        const { colorScheme = {}, styleSet = {}, theme = 'light', radiusRatio = 1 } = options || {};

        this.optionsStore.colorScheme = colorScheme;
        this.optionsStore.styleSet = styleSet;
        this.optionsStore.theme = theme;
        this.optionsStore.radiusRatio = radiusRatio;
    }

    set colorScheme(colorScheme: GlobalColorSchemes) {
        this.optionsStore.colorScheme = colorScheme;
    }

    get colorScheme(): GlobalColorSchemes {
        return this.optionsStore.colorScheme.value;
    }

    set styleSet(styleSet: GlobalStyleSets) {
        this.optionsStore.styleSet = styleSet;
    }

    get styleSet(): GlobalStyleSets {
        return this.optionsStore.styleSet.value;
    }

    set theme(theme: Theme) {
        this.optionsStore.theme = theme;
    }

    get theme(): Theme {
        return this.optionsStore.theme.value;
    }

    set radiusRatio(radiusRatio: number) {
        this.optionsStore.radiusRatio = radiusRatio;
    }

    get radiusRatio(): number {
        return this.optionsStore.radiusRatio.value;
    }
}
