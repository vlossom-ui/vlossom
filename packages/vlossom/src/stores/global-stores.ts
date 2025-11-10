import type { ToastInfo, ModalInfo } from '@/plugins';
import { ContainerStore } from './container-store';
import { OptionsStore } from './options-store';
import { OverlayCallbackStore } from './overlay-callback-store';
import { OverlayContainerStore } from './overlay-container-store';

const optionsStore = new OptionsStore();

const overlayCallbackStore = new OverlayCallbackStore();
const overlayContainerStore = new OverlayContainerStore();

const modalContainerStore = new ContainerStore<ModalInfo>();
const toastContainerStore = new ContainerStore<ToastInfo>();

export function useModalContainerStore() {
    return modalContainerStore;
}

export function useOptionsStore() {
    return optionsStore;
}

export function useOverlayCallbackStore() {
    return overlayCallbackStore;
}

export function useOverlayContainerStore() {
    return overlayContainerStore;
}

export function useToastContainerStore() {
    return toastContainerStore;
}
