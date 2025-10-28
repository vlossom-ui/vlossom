import { ref, readonly, type Ref } from 'vue';
import type { ToastInfo } from '@/plugins';

export class ContainerStore<T extends { container: string; id: string }> {
    private _map: Ref<Map<string, T[]>> = ref(new Map());

    public map = readonly(this._map);

    get size(): number {
        return this._map.value.size;
    }

    has(container: string): boolean {
        return this._map.value.has(container);
    }

    get(container: string): T[] {
        return this._map.value.get(container) || [];
    }

    set(container: string, value: T[]): void {
        this._map.value.set(container, value);
    }

    push(container: string, value: T): void {
        const current = this._map.value.get(container) || [];
        this._map.value.set(container, [...current, value]);
    }

    remove(container: string, id: string): void {
        const current = this._map.value.get(container);
        if (!current) {
            return;
        }

        const filtered = current.filter((item) => item.id !== id);
        this._updateOrDelete(container, filtered);
    }

    pop(container: string): void {
        const current = this._map.value.get(container);
        if (!current || current.length === 0) {
            return;
        }

        const filtered = current.slice(0, -1);
        this._updateOrDelete(container, filtered);
    }

    delete(container: string): void {
        this._map.value.delete(container);
    }

    clear(): void {
        this._map.value.clear();
    }

    private _updateOrDelete(container: string, filtered: T[]): void {
        if (filtered.length === 0) {
            this._map.value.delete(container);
        } else {
            this._map.value.set(container, filtered);
        }
    }
}

const toastContainerStore = new ContainerStore<ToastInfo>();

export function useToastContainerStore() {
    return toastContainerStore;
}
