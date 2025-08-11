import { ref, type Ref } from 'vue';
import type { BarLayout } from '@/declaration';

export class LayoutStore {
    private _header: Ref<BarLayout> = ref({ position: 'relative', height: 'auto' });
    private _footer: Ref<BarLayout> = ref({ position: 'relative', height: 'auto' });

    public get header(): Ref<BarLayout> {
        return this._header;
    }

    public get footer(): Ref<BarLayout> {
        return this._footer;
    }

    public set header(value: BarLayout) {
        this._header.value = value;
    }

    public set footer(value: BarLayout) {
        this._footer.value = value;
    }
}
