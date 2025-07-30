import type { Theme, VlossomOptions } from '@/declaration';
import { useOptionsStore } from '@/stores';

export class Vlossom {
    private optionsStore = useOptionsStore();

    constructor(options?: VlossomOptions) {
        const {
            colorScheme = {},
            // styleSet = {},
            theme = 'light',
            // radiusRatio = 1,
        } = options || {};

        this.optionsStore.setColorScheme(colorScheme);
        this.optionsStore.setTheme(theme);
    }

    set theme(theme: Theme) {
        this.optionsStore.setTheme(theme);
    }

    get theme(): Theme {
        return this.optionsStore.getTheme().value;
    }
}
