import type { PropType } from 'vue';
import type { ColorScheme } from '@/declaration';

export function getColorSchemeProps() {
    return {
        colorScheme: { type: String as PropType<ColorScheme> },
    };
}
