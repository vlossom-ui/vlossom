import { MODAL_BACK } from '@/declaration';
import { logUtil } from '@/utils';
import type { OverlayCallbackStore } from './overlay-callback-store';

const MODAL_HISTORY_STATE_KEY = '__vlossomModalId';

interface ModalHistoryEntry {
    id: string;
    active: boolean;
    popped: boolean;
    closing: boolean;
}

export class ModalHistoryStore {
    private entries: ModalHistoryEntry[] = [];
    private rewinding = false;
    private pendingPushes: string[] = [];

    constructor(private overlayCallbackStore: OverlayCallbackStore) {}

    private pushState(id: string): void {
        window.history.pushState({ ...window.history.state, [MODAL_HISTORY_STATE_KEY]: id }, '');
    }

    private restore(entry: ModalHistoryEntry): void {
        this.pushState(entry.id);
        entry.popped = false;
    }

    private syncHistory(): void {
        if (this.rewinding) {
            return;
        }

        // A lower modal can close first. Rewind its entry once everything above it has closed.
        let count = 0;
        while (this.entries.length && !this.entries[this.entries.length - 1].active) {
            const entry = this.entries.pop()!;
            if (!entry.popped) {
                count++;
            }
        }
        if (count) {
            this.rewinding = true;
            window.history.go(-count);
            return;
        }
        for (const id of this.pendingPushes.splice(0)) {
            this.push(id);
        }
        if (!this.entries.length) {
            window.removeEventListener('popstate', this.handleBack);
        }
    }

    private handleBack = async (): Promise<void> => {
        if (this.rewinding) {
            this.rewinding = false;
            this.syncHistory();
            return;
        }

        const entry = this.entries[this.entries.length - 1];
        if (!entry || window.history.state?.[MODAL_HISTORY_STATE_KEY] === entry.id) {
            return;
        }

        entry.popped = true;
        const overlays = this.overlayCallbackStore.overlays.value;
        const topModal = [...overlays].reverse().find(([, callbacks]) => callbacks.value[MODAL_BACK]);
        if (topModal?.[0] !== entry.id || entry.closing) {
            this.restore(entry);
            return;
        }

        entry.closing = true;
        try {
            if ((await this.overlayCallbackStore.run<boolean>(entry.id, MODAL_BACK)) === true) {
                entry.active = false;
            }
        } catch {
            logUtil.error('ModalHistoryStore', 'Modal back-close callback failed.');
        } finally {
            entry.closing = false;
            if (entry.active && entry.popped) {
                this.restore(entry);
            }
            this.syncHistory();
        }
    };

    public push(id: string): void {
        if (typeof window === 'undefined' || !window.history?.pushState || !window.history?.go) {
            return;
        }
        if (this.rewinding) {
            this.pendingPushes.push(id);
            return;
        }
        // A beforeClose hook can open a confirmation while its own entry is popped.
        const parent = this.entries[this.entries.length - 1];
        if (parent?.active && parent.popped) {
            this.restore(parent);
        }
        this.pushState(id);
        this.entries.push({ id, active: true, popped: false, closing: false });
        window.addEventListener('popstate', this.handleBack);
    }

    public release(id: string): void {
        this.pendingPushes = this.pendingPushes.filter((pending) => pending !== id);
        const entry = this.entries.find((item) => item.active && item.id === id);
        if (entry) {
            entry.active = false;
            this.syncHistory();
        }
    }
}
