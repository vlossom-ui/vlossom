import type { ToastInfo, ModalInfo } from '@/plugins';
import { ContainerStore } from './container-store';
import { ModalHistoryStore } from './modal-history-store';
import { OptionsStore } from './options-store';
import { OverlayCallbackStore } from './overlay-callback-store';
import { OverlayContainerStore } from './overlay-container-store';
import { ScrollLockStore } from './scroll-lock-store';

const optionsStore = new OptionsStore();

const overlayCallbackStore = new OverlayCallbackStore();
const overlayContainerStore = new OverlayContainerStore();
const scrollLockStore = new ScrollLockStore();

const modalHistoryStore = new ModalHistoryStore(overlayCallbackStore);
const modalContainerStore = new ContainerStore<ModalInfo>();
const toastContainerStore = new ContainerStore<ToastInfo>();

export function useModalContainerStore() {
    return modalContainerStore;
}

export function useModalHistoryStore() {
    return modalHistoryStore;
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

export function useScrollLockStore() {
    return scrollLockStore;
}

export function useToastContainerStore() {
    return toastContainerStore;
}
