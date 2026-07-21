import { domUtil, deviceUtil } from '@/utils';

interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}

interface ScrollLockEntry {
    owners: Set<string>;
    original: ScrollLockState;
}

const SCROLLBAR_WIDTH = '8px';

export class ScrollLockStore {
    private _locks: Map<HTMLElement, ScrollLockEntry> = new Map();

    public lock(ownerId: string, element: HTMLElement): void {
        const entry = this._locks.get(element);
        if (entry) {
            entry.owners.add(ownerId);
            return;
        }

        const created: ScrollLockEntry = {
            owners: new Set([ownerId]),
            original: this._capture(element),
        };
        this._locks.set(element, created);
        this._apply(element);
    }

    public unlock(ownerId: string, element: HTMLElement): void {
        const entry = this._locks.get(element);
        if (!entry) {
            return;
        }

        entry.owners.delete(ownerId);
        if (entry.owners.size > 0) {
            return;
        }

        this._locks.delete(element);
        this._restore(element, entry.original);
    }

    public clear(): void {
        this._locks.clear();
    }

    private _capture(element: HTMLElement): ScrollLockState {
        return {
            overflow: element.style.overflow,
            paddingRight: element.style.paddingRight,
            paddingBottom: element.style.paddingBottom,
        };
    }

    private _apply(element: HTMLElement): void {
        if (domUtil.isBrowser() && deviceUtil.isTouchDevice()) {
            return;
        }

        const hasVerticalScrollbar = domUtil.isViewport(element)
            ? window.innerWidth > document.documentElement.clientWidth
            : element.scrollHeight > element.clientHeight;
        const hasHorizontalScrollbar = domUtil.isViewport(element)
            ? window.innerHeight > document.documentElement.clientHeight
            : element.scrollWidth > element.clientWidth;

        if (hasVerticalScrollbar) {
            element.style.paddingRight = SCROLLBAR_WIDTH;
        }
        if (hasHorizontalScrollbar) {
            element.style.paddingBottom = SCROLLBAR_WIDTH;
        }

        element.style.overflow = 'hidden';
    }

    private _restore(element: HTMLElement, original: ScrollLockState): void {
        element.style.overflow = original.overflow;
        element.style.paddingRight = original.paddingRight;
        element.style.paddingBottom = original.paddingBottom;
    }
}
