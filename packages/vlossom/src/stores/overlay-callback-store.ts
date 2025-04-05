import { ref, readonly, type Ref } from 'vue';
import { VS_OVERLAY_CLOSE, VS_OVERLAY_OPEN, type EventCallbacks } from '@/declaration';

export class OverlayCallbackStore {
    // overlay tuple: [id, { [eventName: callback }]
    private _overlays: Ref<[string, Ref<EventCallbacks>][]> = ref([]);

    private handleKeydown: (event: KeyboardEvent) => void;

    constructor() {
        this.handleKeydown = (event: KeyboardEvent) => {
            if (this._overlays.value.length === 0) {
                return;
            }

            const keyEventName = `key-${event.key}`;
            const [lastOverlayId, callbacks] = this._overlays.value[this._overlays.value.length - 1];
            if (!callbacks.value[keyEventName]) {
                return;
            }

            // Prevent default action for registered key event (ex. enter, esc)
            event.preventDefault();

            this.run(lastOverlayId, keyEventName, event);
        };

        document.addEventListener('keydown', this.handleKeydown);
    }

    // Readonly access to overlays state
    get overlays() {
        return readonly(this._overlays.value);
    }

    private updateOverlays(updater: (current: [string, Ref<EventCallbacks>][]) => [string, Ref<EventCallbacks>][]) {
        this._overlays.value = updater(this._overlays.value);
    }

    getLastOverlayId() {
        return this._overlays.value.length > 0 ? this._overlays.value[this._overlays.value.length - 1][0] : '';
    }

    getOverlayCount() {
        return this._overlays.value.length;
    }

    hasOverlay(id: string) {
        return this._overlays.value.some(([overlayId]) => overlayId === id);
    }

    async run<T = void>(id: string, eventName: string, ...args: unknown[]): Promise<T | void> {
        const index = this._overlays.value.findIndex(([overlayId]) => overlayId === id);
        if (index === -1) {
            return;
        }
        const [, callbacks] = this._overlays.value[index];
        const callback = callbacks.value[eventName];
        if (!callback) {
            return;
        }
        return await callback(...args);
    }

    push(id: string, callbacks: Ref<EventCallbacks>) {
        this.updateOverlays((current) => [...current, [id, callbacks]]);
        this.run(id, VS_OVERLAY_OPEN);
        return this.run(id, 'open');
    }

    pop(...args: unknown[]) {
        if (this._overlays.value.length === 0) {
            throw new Error('No overlays to pop');
        }
        const [targetId] = this._overlays.value[this._overlays.value.length - 1];
        this.run(targetId, VS_OVERLAY_CLOSE, ...args);
        const result = this.run(targetId, 'close', ...args);
        this.updateOverlays((current) => current.slice(0, -1));
        return result;
    }

    remove(id: string, ...args: unknown[]) {
        const index = this._overlays.value.findIndex(([stackId]) => stackId === id);
        if (index === -1) {
            return;
        }
        const [targetId] = this._overlays.value[index];
        this.run(targetId, VS_OVERLAY_CLOSE, ...args);
        const result = this.run(targetId, 'close', ...args);
        this.updateOverlays((current) => current.filter((_, i) => i !== index));
        return result;
    }

    clear(...args: unknown[]) {
        while (this._overlays.value.length > 0) {
            this.pop(...args);
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.handleKeydown);
        this.clear();
    }
}
