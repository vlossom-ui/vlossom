import type { ComponentPublicInstance } from 'vue';
import type { VsDimmedStyleSet } from '@/components/vs-dimmed/types';
import type VsModal from './VsModal.vue';
import type VsModalNode from './VsModalNode.vue';
import type VsModalView from './VsModalView.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsModal: typeof VsModal;
        VsModalNode: typeof VsModalNode;
        VsModalView: typeof VsModalView;
    }
}

export type { VsModal, VsModalNode, VsModalView };

export interface VsModalRef extends ComponentPublicInstance<typeof VsModal> {}

export interface VsModalNodeRef extends ComponentPublicInstance<typeof VsModalNode> {}

export interface VsModalViewRef extends ComponentPublicInstance<typeof VsModalView> {}

export interface VsModalNodeStyleSet {
    variables?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: number;
        boxShadow?: string;
        fontColor?: string;
    };
    dimmed?: VsDimmedStyleSet;
}
