import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';
import type VsSelect from './VsSelect.vue';

import type { VsGroupedListStyleSet } from '@/components/vs-grouped-list/types';
import type { VsCheckboxStyleSet } from '@/components/vs-checkbox/types';

declare module 'vue' {
    interface GlobalComponents {
        VsSelect: typeof VsSelect;
    }
}

export type { VsSelect };

export interface VsSelectRef extends ComponentPublicInstance<typeof VsSelect> {}

export interface VsSelectStyleSet extends SizeStyleSet {
    trigger?: BoxStyleSet;
    options?: Omit<VsGroupedListStyleSet, 'width'>;
    selectAllCheckbox?: VsCheckboxStyleSet;
}
