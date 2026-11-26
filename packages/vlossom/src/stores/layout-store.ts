import { ref, type Ref, computed } from 'vue';
import type { BarLayout, DrawerLayout, DrawerLayouts } from '@/declaration';
import { objectUtil } from '@/utils';

export class LayoutStore {
    private _header: Ref<BarLayout> = ref({ position: 'relative', height: '' });
    private _footer: Ref<BarLayout> = ref({ position: 'relative', height: '' });
    private _drawers: Ref<DrawerLayouts> = ref({
        left: { isOpen: false, pushContainer: false, placement: 'left', size: '', resizing: false },
        top: { isOpen: false, pushContainer: false, placement: 'top', size: '', resizing: false },
        right: { isOpen: false, pushContainer: false, placement: 'right', size: '', resizing: false },
        bottom: { isOpen: false, pushContainer: false, placement: 'bottom', size: '', resizing: false },
    });

    public static getDefaultLayoutStore(): LayoutStore {
        return new LayoutStore();
    }

    public header = computed(() => this._header.value);

    public setHeader(layout: BarLayout) {
        if (objectUtil.isEqual(this._header.value, layout)) {
            return;
        }

        this._header.value = layout;
    }

    public footer = computed(() => this._footer.value);

    public setFooter(layout: BarLayout) {
        if (objectUtil.isEqual(this._footer.value, layout)) {
            return;
        }

        this._footer.value = layout;
    }

    public drawers = computed(() => this._drawers.value);

    public setDrawers(layouts: DrawerLayouts) {
        this._drawers.value = layouts;
    }

    public setDrawer(layout: DrawerLayout) {
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
