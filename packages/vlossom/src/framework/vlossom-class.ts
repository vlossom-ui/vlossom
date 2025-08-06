import {
    THEME_KEY,
    type GlobalColorSchemes,
    type GlobalStyleSets,
    type Theme,
    type VlossomOptions,
} from '@/declaration';
import { useOptionsStore } from '@/stores';

export class Vlossom {
    private optionsStore = useOptionsStore();

    constructor(options?: VlossomOptions) {
        const { colorScheme = {}, styleSet = {}, theme = 'light', radiusRatio = 1 } = options || {};

        this.optionsStore.colorScheme = colorScheme;
        this.optionsStore.styleSet = styleSet;
        this.optionsStore.radiusRatio = radiusRatio;

        this.setDefaultTheme(theme);
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
        document.documentElement.classList.toggle('vs-dark', theme === 'dark');
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

    public toggleTheme() {
        this.theme = this.optionsStore.theme.value === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, this.theme);
    }

    private setDefaultTheme(optionTheme: Theme = 'light') {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (savedTheme === 'dark' || (!savedTheme && mediaQuery.matches) || (!savedTheme && optionTheme === 'dark')) {
            this.theme = 'dark';
        }
    }
}
