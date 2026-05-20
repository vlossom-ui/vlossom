import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { FocusableRef, FormChildRef } from '@/declaration';
import type { VsInputStyleSet } from '@/components/vs-input/types';
import type { VsInputWrapperStyleSet } from '@/components/vs-input-wrapper/types';
import type { VsSelectStyleSet } from '@/components/vs-select/types';
import type VsDatePicker from './VsDatePicker.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDatePicker: typeof VsDatePicker;
    }
}

export type { VsDatePicker };

export type VsDatePickerValueType = Date | null;

export type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

export type VsDatePickerCanSelectDate = (date: Date) => boolean | undefined;

export interface TimezoneOption {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
}

export interface VsDatePickerRef extends ComponentPublicInstance<typeof VsDatePicker>, FocusableRef, FormChildRef {
    open: () => void;
}

export interface VsDatePickerStyleSet extends CSSProperties {
    $timezoneSelect?: VsSelectStyleSet;
    $input?: VsInputStyleSet;
    $wrapper?: VsInputWrapperStyleSet;
}
