import { defineStore } from 'pinia';
import type { GlobalColorScheme } from '@/declaration';

export const useOptionsStore = defineStore('options', {
    state: () => ({
        colorScheme: {},
    }),
    actions: {
        setColorScheme(colorScheme: GlobalColorScheme) {
            this.colorScheme = colorScheme;
        },
    },
});
