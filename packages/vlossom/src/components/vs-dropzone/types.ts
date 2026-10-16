import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsDropzone from './VsDropzone.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDropzone: typeof VsDropzone;
    }
}

export type { VsDropzone };

export interface VsDropzoneRef extends ComponentPublicInstance<typeof VsDropzone> {}

export interface VsDropzoneStyleSet extends CSSProperties {
    $overlay?: CSSProperties;
}
