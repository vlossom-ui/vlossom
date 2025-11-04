import type { BoxStyleSet, SizeStyleSet } from '@/declaration';
import type VsModal from './VsModal.vue';
import type VsModalNode from './VsModalNode.vue';
import type VsModalView from './VsModalView.vue';
import type { VsDimmedStyleSet } from '@/components/vs-dimmed/types';
import type { VsInnerScrollStyleSet } from '@/components/vs-inner-scroll/types';

declare module 'vue' {
    interface GlobalComponents {
        VsModal: typeof VsModal;
        VsModalNode: typeof VsModalNode;
        VsModalView: typeof VsModalView;
    }
}

export type { VsModal, VsModalNode, VsModalView };

export interface VsModalNodeStyleSet extends SizeStyleSet, BoxStyleSet {
    boxShadow?: string;
    fontColor?: string;
    zIndex?: string;

    dimmed?: VsDimmedStyleSet;
    layout?: VsInnerScrollStyleSet;
}
