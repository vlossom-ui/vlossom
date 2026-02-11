import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { FocusableRef } from '@/declaration';
import type VsSelect from './VsSelect.vue';
import type VsSelectTrigger from './VsSelectTrigger.vue';

import type { VsChipStyleSet } from '@/components/vs-chip/types';
import type { VsGroupedListStyleSet } from '@/components/vs-grouped-list/types';
import type { VsCheckboxStyleSet } from '@/components/vs-checkbox/types';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
declare module 'vue' {
    interface GlobalComponents {
        VsSelect: typeof VsSelect;
    }
}

export type { VsSelect, VsSelectTrigger };

export interface VsSelectRef extends ComponentPublicInstance<typeof VsSelect> {}

export interface VsSelectTriggerRef extends ComponentPublicInstance<typeof VsSelectTrigger>, FocusableRef {}

export interface VsSelectStyleSet {
    variables?: {
        height?: string;
        focused?: {
            border?: string;
            borderRadius?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
    selectedOption?: CSSProperties;
}
