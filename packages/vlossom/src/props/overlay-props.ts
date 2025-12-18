import type { PropType } from 'vue';
import type { OverlayCallbacks } from '@/declaration';

export function getOverlayProps() {
    return {
        callbacks: {
            type: Object as PropType<OverlayCallbacks>,
            default: () => ({}),
        },
        dimClose: { type: Boolean, default: false },
        dimmed: { type: Boolean, default: false },
        escClose: { type: Boolean, default: false },
        focusLock: { type: Boolean, default: false },
        hideScroll: { type: Boolean, default: false },
        id: { type: String, default: '' },
        scrollLock: { type: Boolean, default: false },
    };
}
