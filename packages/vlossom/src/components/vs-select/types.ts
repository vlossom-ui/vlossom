import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, FocusableRef, SizeStyleSet } from '@/declaration';
import type VsSelect from './VsSelect.vue';
import type VsSelectTrigger from './VsSelectTrigger.vue';

import type { VsGroupedListStyleSet } from '@/components/vs-grouped-list/types';
import type { VsCheckboxStyleSet } from '@/components/vs-checkbox/types';

declare module 'vue' {
    interface GlobalComponents {
        VsSelect: typeof VsSelect;
    }
}

export type { VsSelect, VsSelectTrigger };

export type VsSelectSearchPropType = boolean | { useRegex?: boolean; useCaseSensitive?: boolean; placeholder?: string };

export interface VsSelectRef extends ComponentPublicInstance<typeof VsSelect> {}

export interface VsSelectTriggerRef extends ComponentPublicInstance<typeof VsSelectTrigger>, FocusableRef {}

export interface VsSelectStyleSet extends SizeStyleSet {
    trigger?: BoxStyleSet;
    options?: Omit<VsGroupedListStyleSet, 'width' | 'items'>;
    selectAllCheckbox?: VsCheckboxStyleSet;
    option?: BoxStyleSet & { selectedBackgroundColor?: string };
}
