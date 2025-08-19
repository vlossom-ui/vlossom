import { ref, type Ref } from 'vue';

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

    public get disabled(): Ref<boolean> {
        return this._disabled;
    }

    public set disabled(value: boolean) {
        this._disabled.value = value;
    }

    public get readonly(): Ref<boolean> {
        return this._readonly;
    }

    public set readonly(value: boolean) {
        this._readonly.value = value;
    }

    public get changedObj(): Ref<Record<string, boolean>> {
        return this._changedObj;
    }

    public set changedObj(value: Record<string, boolean>) {
        this._changedObj.value = value;
    }

    public get validObj(): Ref<Record<string, boolean>> {
        return this._validObj;
    }

    public set validObj(value: Record<string, boolean>) {
        this._validObj.value = value;
    }

    public get validateFlag(): Ref<boolean> {
        return this._validateFlag;
    }

    public get clearFlag(): Ref<boolean> {
        return this._clearFlag;
    }

    public toggleValidateFlag() {
        this._validateFlag.value = !this._validateFlag.value;
    }

    public toggleClearFlag() {
        this._clearFlag.value = !this._clearFlag.value;
    }
}
