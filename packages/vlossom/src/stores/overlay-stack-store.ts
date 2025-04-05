import { computed, ref, readonly, type ComputedRef, type Ref } from 'vue';

export class OverlayStackStore<T extends { id: string; container?: string }> {
    private _items: Ref<T[]> = ref([]);

    get items() {
        return readonly(this._items);
    }

    private updateItems(updater: (current: T[]) => T[]) {
        this._items.value = updater(this._items.value);
    }

    public itemsByContainer: ComputedRef<{ [container: string]: T[] }> = computed(() => {
        const result: { [container: string]: T[] } = {};
        this._items.value.forEach((modal) => {
            const { container = 'body' } = modal;
            if (!result[container]) {
                result[container] = [];
            }
            result[container].push(modal);
        });
        return result;
    });

    push(options: T) {
        if (this._items.value.some((item) => item.id === options.id)) {
            console.warn(`Item with id ${options.id} already exists in the stack`);
            return;
        }

        this.updateItems((current) => [...current, options]);
    }

    pop() {
        this.updateItems((current) => current.slice(0, -1));
    }

    remove(id: string) {
        this.updateItems((current) => current.filter(({ id: modalId }) => modalId !== id));
    }

    clear() {
        this.updateItems(() => []);
    }
}
