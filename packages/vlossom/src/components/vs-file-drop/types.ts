import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsFileDrop from './VsFileDrop.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFileDrop: typeof VsFileDrop;
    }
}

export type { VsFileDrop };

export interface VsFileDropRef extends ComponentPublicInstance<typeof VsFileDrop>, FocusableRef, FormChildRef {}

export type FileDropValueType = File[];

/**
 * VsFileDrop의 StyleSet
 * @since 2.0.0 - 새로운 Style-Set 시스템으로 마이그레이션
 */
export interface VsFileDropStyleSet {
    /**
     * CSS 변수로 노출될 커스터마이징 포인트
     */
    variables?: {
        /** 파일 영역 내부 여백 */
        padding?: string;
        /** 드래그 시 배경색 */
        dragBackgroundColor?: string;
        /** 아이콘 색상 */
        iconColor?: string;
    };

    /** 루트 요소 직접 스타일 */
    component?: CSSProperties;

    /** placeholder 영역 스타일 */
    placeholder?: CSSProperties;

    /** 파일 목록 영역 스타일 */
    files?: CSSProperties;

    /** 닫기 버튼 스타일 */
    closeButton?: CSSProperties;

    /** 하위 VsInputWrapper 스타일 */
    wrapper?: VsInputWrapperStyleSet;
}
