import { readonly, ref, type Component, type Ref } from 'vue';

export type OverlayView = {
    container: string;
    component: string | Component;
};

export class OverlayContainerStore {
    private _overlayViewMap: Ref<Map<string, OverlayView>> = ref(new Map());

    public overlayViewMap = readonly(this._overlayViewMap) as Readonly<Ref<Map<string, OverlayView>>>;

    public push(id: string, container: string, component: string | Component) {
        if (this._overlayViewMap.value.has(id)) {
            return;
        }

        this._overlayViewMap.value.set(id, { container, component });
    }

    public clear() {
        this._overlayViewMap.value.clear();
    }

    public delete(id: string) {
        this._overlayViewMap.value.delete(id);
    }
}
