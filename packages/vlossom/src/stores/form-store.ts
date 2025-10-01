import { ref, type Ref, computed } from 'vue';

export class FormStore {
    private _disabled = ref(false);
    private _readonly = ref(false);
    private _changedObj: Ref<Record<string, boolean>> = ref({});
    private _validObj: Ref<Record<string, boolean>> = ref({});
    private _validateFlag = ref(false);
    private _clearFlag = ref(false);

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

    public changedObj = computed(() => this._changedObj.value);

    public updateChanged(id: string, changed: boolean) {
        this._changedObj.value[id] = changed;
    }

    public validObj = computed(() => this._validObj.value);

    public updateValid(id: string, valid: boolean) {
        this._validObj.value[id] = valid;
    }

    public removeFromForm(id: string) {
        delete this._changedObj.value[id];
        delete this._validObj.value[id];
    }

    public validateFlag = computed(() => this._validateFlag.value);

    public toggleValidateFlag() {
        this._validateFlag.value = !this._validateFlag.value;
    }

    public clearFlag = computed(() => this._clearFlag.value);

    public toggleClearFlag() {
        this._clearFlag.value = !this._clearFlag.value;
    }
}
