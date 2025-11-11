import type { VsButtonStyleSet } from '@/components/vs-button/types';

import type VsConfirm from './VsConfirm.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsConfirm: typeof VsConfirm;
    }
}

export type { VsConfirm };

export interface VsConfirmStyleSet {
    okButton?: VsButtonStyleSet;
    cancelButton?: VsButtonStyleSet;
}
