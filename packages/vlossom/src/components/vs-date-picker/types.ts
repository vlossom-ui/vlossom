import type { ComponentPublicInstance } from 'vue';
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

export type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

export type VsDatePickerValueType = Date | null;

export interface TimezoneOption {
    value: string;
    label: string;
    group?: string;
    disabled?: boolean;
}

export interface VsDatePickerRef extends ComponentPublicInstance<typeof VsDatePicker>, FocusableRef, FormChildRef {
    open: () => void;
    /**
     * Current timezone (read-only). Auto-unwrapped from a readonly Ref in setup.
     * To change it, use the timezone select UI or update timezoneOptions.
     */
    currentTimezone: string;
}

export interface VsDatePickerStyleSet {
    /** label / messages 를 담는 outer VsInputWrapper 의 styleSet. */
    $wrapper?: VsInputWrapperStyleSet;
    /** 내부 VsInput (date input field) 에 forward 되는 styleSet. */
    $input?: VsInputStyleSet;
    /** Timezone select 의 styleSet. timezone prop 이 true 일 때만 적용. */
    $timezoneSelect?: VsSelectStyleSet;
}
