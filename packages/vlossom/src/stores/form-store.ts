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

    public setChangedObj(value: Record<string, boolean>) {
        this._changedObj.value = value;
    }

    public validObj = computed(() => this._validObj.value);

    public setValidObj(value: Record<string, boolean>) {
        this._validObj.value = value;
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
