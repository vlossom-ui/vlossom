import { MODAL_BACK } from '@/declaration';
import type { OverlayCallbackStore } from './overlay-callback-store';

const MODAL_HISTORY_STATE_KEY = '__vlossomModalId';

interface ModalHistoryEntry {
    id: string;
    active: boolean;
}

export class ModalHistoryStore {
    private _entries: ModalHistoryEntry[] = [];
    private _backId = '';
    private _rewindCount = 0;

    constructor(private overlayCallbackStore: OverlayCallbackStore) {
        if (!this.canUseHistory()) {
            return;
        }

        window.addEventListener('popstate', () => {
            this.handleBack();
        });
    }

    private canUseHistory(): boolean {
        return typeof window !== 'undefined' && !!window.history?.pushState && !!window.history?.go;
    }

    private pushHistory(id: string): void {
        if (!this.canUseHistory()) {
            return;
        }

        const currentState = window.history.state;
        const baseState = currentState && typeof currentState === 'object' ? currentState : {};
        window.history.pushState({ ...baseState, [MODAL_HISTORY_STATE_KEY]: id }, '');
    }

    private goBack(count: number): void {
        if (count < 1 || !this.canUseHistory()) {
            return;
        }

        this._rewindCount += 1;
        window.history.go(-count);
    }

    private rewindInactiveEntries(): void {
        let count = 0;
        while (this._entries.length > 0 && !this._entries[this._entries.length - 1].active) {
            this._entries.pop();
            count += 1;
        }
        this.goBack(count);
    }

    private findTopBackHandlerId(): string {
        const overlays = this.overlayCallbackStore.overlays.value;
        for (let i = overlays.length - 1; i >= 0; i--) {
            const [id, callbacks] = overlays[i];
            if (callbacks.value[MODAL_BACK]) {
                return id;
            }
        }
        return '';
    }

    private async handleBack(): Promise<void> {
        if (this._rewindCount > 0) {
            this._rewindCount -= 1;
            return;
        }

        const topEntry = this._entries[this._entries.length - 1];
        if (!topEntry) {
            return;
        }

        const isTopBackHandler = this.findTopBackHandlerId() === topEntry.id;
        this._backId = topEntry.id;
        const closed = isTopBackHandler && (await this.overlayCallbackStore.run<boolean>(topEntry.id, MODAL_BACK));
        if (!closed) {
            this._backId = '';
            this.pushHistory(topEntry.id);
        }
    }

    public push(id: string): void {
        this._entries.push({ id, active: true });
        this.pushHistory(id);
    }

    public release(id: string): void {
        const entry = this._entries.find((item) => item.id === id && item.active);
        if (!entry) {
            return;
        }

        entry.active = false;

        if (this._backId === id) {
            this._backId = '';
            this._entries.splice(this._entries.indexOf(entry), 1);
        }

        this.rewindInactiveEntries();
    }

    public clear(): void {
        this._entries = [];
        this._backId = '';
        this._rewindCount = 0;
    }
}
