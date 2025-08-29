import { ref, type Ref, readonly } from 'vue';
import { type OverlayCallbacks, VS_OVERLAY_CLOSE, VS_OVERLAY_OPEN } from '@/declaration';

export class OverlayCallbackStore {
    // overlay tuple: [id, { [eventName: callback }]
    private _overlays: Ref<[string, Ref<OverlayCallbacks>][]> = ref([]);
    private _historyStateKey = 'vlossom-overlay';
    private _isHandlingPopstate = false;

    public overlays = readonly(this._overlays);

    constructor() {
        // Handle keyboard events
        document.addEventListener('keydown', (event: KeyboardEvent) => {
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
        });

        // Handle Android back button via popstate event
        window.addEventListener('popstate', (event: PopStateEvent) => {
            if (this._isHandlingPopstate || this._overlays.value.length === 0) {
                return;
            }

            // Check if this popstate event is related to our overlay
            const currentState = event.state;
            const shouldHandleBackButton =
                !currentState ||
                !currentState[this._historyStateKey] ||
                currentState[this._historyStateKey] < this._overlays.value.length;

            if (shouldHandleBackButton) {
                const [lastOverlayId, callbacks] = this._overlays.value[this._overlays.value.length - 1];

                // Try to run android-back callback first, fallback to key-Escape
                const backEventName = 'android-back';
                const escEventName = 'key-Escape';

                if (callbacks.value[backEventName]) {
                    this.run(lastOverlayId, backEventName, event);
                } else if (callbacks.value[escEventName]) {
                    this.run(lastOverlayId, escEventName, event);
                }
            }
        });
    }

    private async run<T = void>(id: string, eventName: string, ...args: any[]): Promise<T | void> {
        const index = this._overlays.value.findIndex(([overlayId]) => overlayId === id);
        if (index === -1) {
            return;
        }
        const [, callbacks] = this._overlays.value[index];
        return await callbacks.value[eventName]?.(...args);
    }

    public getLastOverlayId() {
        return this._overlays.value.length > 0 ? this._overlays.value[this._overlays.value.length - 1][0] : '';
    }

    public push(id: string, callbacks: Ref<OverlayCallbacks>) {
        this._overlays.value.push([id, callbacks]);

        // Add history state for Android back button support
        const newState = {
            ...window.history.state,
            [this._historyStateKey]: this._overlays.value.length,
        };
        window.history.pushState(newState, '', window.location.href);

        this.run(id, VS_OVERLAY_OPEN);
        return this.run(id, 'open');
    }

    public pop(...args: any[]) {
        const [targetId] = this._overlays.value[this._overlays.value.length - 1];
        this.run(targetId, VS_OVERLAY_CLOSE, ...args);
        const result = this.run(targetId, 'close', ...args);
        this._overlays.value.pop();

        // Handle history state when popping overlay
        this._isHandlingPopstate = true;
        try {
            // Only go back in history if current state has our overlay key
            const currentState = window.history.state;
            if (currentState && currentState[this._historyStateKey]) {
                window.history.back();
            }
        } finally {
            // Reset flag after a short delay to avoid interference
            setTimeout(() => {
                this._isHandlingPopstate = false;
            }, 10);
        }

        return result;
    }

    public remove(id: string, ...args: any[]) {
        const index = this._overlays.value.findIndex(([stackId]) => stackId === id);
        if (index === -1) {
            return;
        }
        const [targetId] = this._overlays.value[index];
        this.run(targetId, VS_OVERLAY_CLOSE, ...args);
        const result = this.run(targetId, 'close', ...args);
        this._overlays.value.splice(index, 1);

        // Handle history state when removing specific overlay
        this._isHandlingPopstate = true;
        try {
            const currentState = window.history.state;
            if (currentState && currentState[this._historyStateKey]) {
                // If removing the last overlay or there are no overlays left
                if (this._overlays.value.length === 0) {
                    window.history.back();
                } else {
                    // Update the state to reflect current overlay count
                    const updatedState = {
                        ...currentState,
                        [this._historyStateKey]: this._overlays.value.length,
                    };
                    window.history.replaceState(updatedState, '', window.location.href);
                }
            }
        } finally {
            setTimeout(() => {
                this._isHandlingPopstate = false;
            }, 10);
        }

        return result;
    }

    public clear(...args: any[]) {
        const overlayCount = this._overlays.value.length;

        while (this._overlays.value.length > 0) {
            this.pop(...args);
        }

        // Handle history state when clearing all overlays
        if (overlayCount > 0) {
            this._isHandlingPopstate = true;
            try {
                const currentState = window.history.state;
                if (currentState && currentState[this._historyStateKey]) {
                    // Go back in history for each overlay that was cleared
                    for (let i = 0; i < overlayCount - 1; i++) {
                        window.history.back();
                    }
                }
            } finally {
                setTimeout(() => {
                    this._isHandlingPopstate = false;
                }, 10);
            }
        }
    }
}
