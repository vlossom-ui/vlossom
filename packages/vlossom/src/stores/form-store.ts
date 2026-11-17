import { ref, computed, shallowReactive } from 'vue';
import type { FormInputEntry } from '@/declaration';

export class FormStore {
    private _disabled = ref(false);
    private _readonly = ref(false);
    // shallow so that each entry keeps its own Refs instead of being unwrapped
    private _inputs = shallowReactive(new Map<string, FormInputEntry>());

    public static getDefaultFormStore(): FormStore {
        return new FormStore();
    }

    public disabled = computed(() => this._disabled.value);

    public setDisabled(value: boolean) {
        this._disabled.value = value;
    }

    public readonly = computed(() => this._readonly.value);

    public setReadonly(value: boolean) {
        this._readonly.value = value;
    }

    public inputs: ReadonlyMap<string, FormInputEntry> = this._inputs;

    public register(id: string, entry: FormInputEntry) {
        this._inputs.set(id, entry);
    }

    public unregister(id: string) {
        this._inputs.delete(id);
    }
}
