import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputStyleSet } from '@/components/vs-input/types';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type VsDatePicker from './VsDatePicker.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDatePicker: typeof VsDatePicker;
    }
}

export type { VsDatePicker };

export type VsDatePickerValueType = string;

export type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

export type VsDatePickerFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' | 'HH:mm' | 'YYYY-MM';

export interface VsDatePickerRef extends ComponentPublicInstance<typeof VsDatePicker>, FocusableRef, FormChildRef {
    open: () => void;
}

export interface VsDatePickerStyleSet extends CSSProperties {
    $input?: VsInputStyleSet;
    $wrapper?: VsInputWrapperStyleSet;
}
