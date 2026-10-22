import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsBreadcrumb from './VsBreadcrumb.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBreadcrumb: typeof VsBreadcrumb;
    }
}

export type { VsBreadcrumb };

export interface VsBreadcrumbRef extends ComponentPublicInstance<typeof VsBreadcrumb> {}

export interface VsBreadcrumbStyleSet extends CSSProperties {
    $list?: CSSProperties;
    $item?: CSSProperties & {
        $current?: CSSProperties;
    };
    $separator?: CSSProperties;
}
