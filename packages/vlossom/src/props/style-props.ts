import type { PropType } from 'vue';
import type { ColorScheme } from '@/declaration';

export function getStyleProps<T>() {
    return {
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: [String, Object] as PropType<string | T> },
    };
}
