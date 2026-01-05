import { ref, type Ref, readonly } from 'vue';
import { type OverlayTuple, type OverlayCallbacks, OVERLAY_CLOSE, OVERLAY_OPEN } from '@/declaration';

export class OverlayCallbackStore {
    // overlay tuple: [id, { [eventName: callback }]
    private _overlays: Ref<OverlayTuple[]> = ref([]);

    public overlays = readonly(this._overlays);

    constructor() {
        this.addOverlayCallbackKeyEventListener();
    }

    private addOverlayCallbackKeyEventListener() {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (this.overlays.value.length === 0) {
                return;
            }

            const overlay = this.getLastOverlay();
            if (!overlay) {
                return;
            }

            const keyEventName = `key-${event.key}`;
            const [lastOverlayId, callbacks] = overlay;
            if (!callbacks.value[keyEventName]) {
                return;
            }

            this.run(lastOverlayId, keyEventName, event);
        });
    }

    public getLastOverlay(): [string, Ref<OverlayCallbacks>] | null {
        return this._overlays.value.length > 0 ? this._overlays.value[this._overlays.value.length - 1]! : null;
    }

    public getLastOverlayId(): string {
        const overlay = this.getLastOverlay();
        if (!overlay) {
            return '';
        }
        return overlay[0];
    }

    public async run<T = void>(id: string, eventName: string, ...args: any[]): Promise<T | void> {
        const index = this._overlays.value.findIndex(([overlayId]) => overlayId === id);
        if (index === -1) {
            return;
        }
        const [, callbacks] = this._overlays.value[index]!;
        return await callbacks.value[eventName]?.(...args);
    }

    public push(id: string, callbacks: Ref<OverlayCallbacks>) {
        this._overlays.value.push([id, callbacks]);
        this.run(id, OVERLAY_OPEN);
        return this.run(id, 'open');
    }

    public pop(...args: any[]) {
        const overlay = this.getLastOverlay();
        if (!overlay) {
            return;
        }
        const [targetId] = overlay;
        this.run(targetId, OVERLAY_CLOSE, ...args);
        const result = this.run(targetId, 'close', ...args);
        this._overlays.value.pop();

        return result;
    }

    public remove(id: string, ...args: any[]) {
        const index = this._overlays.value.findIndex(([stackId]) => stackId === id);
        if (index === -1) {
            return;
        }
        const [targetId] = this._overlays.value[index]!;
        this.run(targetId, OVERLAY_CLOSE, ...args);
        const result = this.run(targetId, 'close', ...args);
        this._overlays.value.splice(index, 1);

        return result;
    }

    public clear(...args: any[]) {
        while (this._overlays.value.length > 0) {
            this.pop(...args);
        }
    }
}
