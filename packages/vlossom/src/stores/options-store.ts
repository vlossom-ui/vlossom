import type { GlobalColorScheme, Theme } from '@/declaration';
import { ref, type Ref } from 'vue';
export class OptionsStore {
    private colorScheme: Ref<GlobalColorScheme> = ref({});
    private theme: Ref<Theme> = ref('light');

    setColorScheme(colorScheme: GlobalColorScheme) {
        this.colorScheme.value = colorScheme;
        return this;
    }

    getColorScheme() {
        return this.colorScheme;
    }

    setTheme(theme: Theme) {
        this.theme.value = theme;
        return this;
    }

    getTheme() {
        return this.theme;
    }
}

const optionsStore = new OptionsStore();

export function useOptionsStore() {
    return optionsStore;
}
