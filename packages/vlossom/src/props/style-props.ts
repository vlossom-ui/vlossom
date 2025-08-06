import type { PropType } from 'vue';
import type { ColorScheme } from '@/declaration';

export function getColorSchemeProps() {
    return {
        colorScheme: { type: String as PropType<ColorScheme> },
    };
}

export function getStyleSetProps<T extends { [key: string]: any }>() {
    return {
        styleSet: { type: [String, Object] as PropType<string | T> },
    };
}
