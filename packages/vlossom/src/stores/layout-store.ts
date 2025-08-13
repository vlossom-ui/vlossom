import { ref, type Ref } from 'vue';
import type { BarLayout, DrawerLayout, DrawerLayouts } from '@/declaration';
import { objectUtil } from '@/utils';

export class LayoutStore {
    private _header: Ref<BarLayout> = ref({ position: 'relative', height: '' });
    private _footer: Ref<BarLayout> = ref({ position: 'relative', height: '' });
    private _drawers: Ref<DrawerLayouts> = ref({
        left: { isOpen: false, responsive: false, placement: 'left', size: '' },
        top: { isOpen: false, responsive: false, placement: 'top', size: '' },
        right: { isOpen: false, responsive: false, placement: 'right', size: '' },
        bottom: { isOpen: false, responsive: false, placement: 'bottom', size: '' },
    });

    public static getDefaultLayout(): LayoutStore {
        return new LayoutStore();
    }

    public get header(): Ref<BarLayout> {
        return this._header;
    }

    public set header(layout: BarLayout) {
        if (objectUtil.isEqual(this._header.value, layout)) {
            return;
        }

        this._header.value = layout;
    }

    public get footer(): Ref<BarLayout> {
        return this._footer;
    }

    public set footer(layout: BarLayout) {
        if (objectUtil.isEqual(this._footer.value, layout)) {
            return;
        }

        this._footer.value = layout;
    }

    public get drawers(): Ref<DrawerLayouts> {
        return this._drawers;
    }

    public set drawer(layout: DrawerLayout) {
        const targetDrawer = this._drawers.value[layout.placement];

        if (objectUtil.isEqual(targetDrawer, layout)) {
            return;
        }

        this._drawers.value = {
            ...this._drawers.value,
            [layout.placement]: layout,
        };
    }
}
