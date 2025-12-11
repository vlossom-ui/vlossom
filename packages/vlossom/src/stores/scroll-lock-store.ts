import { readonly, ref, type Ref } from 'vue';

export class ScrollLockStore {
    private _scrollLockMap: Ref<Map<string, Set<string>>> = ref(new Map());

    public scrollLockMap = readonly(this._scrollLockMap) as Readonly<Ref<Map<string, Set<string>>>>;

    public isLocked(container: string): boolean {
        const lockSet = this._scrollLockMap.value.get(container);
        if (!lockSet) {
            return false;
        }

        return lockSet.size > 0;
    }

    public add(container: string, overlayId: string) {
        const lockSet = this._scrollLockMap.value.get(container);
        if (!lockSet) {
            this._scrollLockMap.value.set(container, new Set([overlayId]));
            return;
        }

        lockSet.add(overlayId);
        this._scrollLockMap.value.set(container, lockSet);
    }

    public remove(container: string, overlayId: string) {
        const lockSet = this._scrollLockMap.value.get(container);
        if (!lockSet) {
            return;
        }

        lockSet.delete(overlayId);
        if (lockSet.size === 0) {
            this._scrollLockMap.value.delete(container);
        } else {
            this._scrollLockMap.value.set(container, lockSet);
        }
    }

    public clear(container: string) {
        this._scrollLockMap.value.delete(container);
    }
}
