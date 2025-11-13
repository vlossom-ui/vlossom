import type { VsButtonStyleSet } from '@/components/vs-button/types';
import type { VsModalNodeStyleSet } from '@/components/vs-modal/types';

import type VsConfirm from './VsConfirm.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsConfirm: typeof VsConfirm;
    }
}

export type { VsConfirm };

export interface VsConfirmStyleSet extends VsModalNodeStyleSet {
    okButton?: Omit<VsButtonStyleSet, 'loading'>;
    cancelButton?: Omit<VsButtonStyleSet, 'loading'>;
}
