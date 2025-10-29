import { readonly, ref, type Component, type Ref } from 'vue';

export class OverlayContainerStore {
    private _overlayViewMap: Ref<Map<string, { container: string; component: string | Component }>> = ref(new Map());

    public overlayViewMap = readonly(this._overlayViewMap);

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

const overlayContainerStore = new OverlayContainerStore();

export function useOverlayContainerStore() {
    return overlayContainerStore;
}
