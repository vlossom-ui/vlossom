import { ContainerStore } from '@/stores';
import type { ToastInfo } from './../types';

const toastStore = new ContainerStore<ToastInfo>();

export function useToastStore() {
    return toastStore;
}
