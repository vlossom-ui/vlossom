import type { Component, Ref } from 'vue';
import type { VsComponentRegistry } from '@/components/component-map';
import type { ALIGNMENTS, COLOR_SCHEMES, PLACEMENTS, SIZES, TEXT_ALIGNMENTS, VERTICAL_ALIGNMENTS } from './constants';
import type { VsComponent } from './enums';

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export type VlossomMessageParams = Record<string, string | number>;
export type VlossomMessage = string | ((params: VlossomMessageParams) => string);

export type Theme = 'light' | 'dark';

export type GlobalColorSchemes = { [key in VsComponent]?: ColorScheme } & { default?: ColorScheme } & {
    [key: string]: ColorScheme;
};

export type GlobalStyleSets = {
    [key: string]: { [key in VsComponent]?: any } & { [key: string]: any };
};

export interface VlossomMessages {
    VS_VALIDATION_REQUIRED: string;
    VS_VALIDATION_MAX_VALUE: VlossomMessage;
    VS_VALIDATION_MIN_VALUE: VlossomMessage;
    VS_VALIDATION_MAX_LENGTH: VlossomMessage;
    VS_VALIDATION_MIN_LENGTH: VlossomMessage;
    VS_VALIDATION_MAX_ITEMS: VlossomMessage;
    VS_VALIDATION_MIN_ITEMS: VlossomMessage;
    VS_VALIDATION_DATE_MIN: VlossomMessage;
    VS_VALIDATION_DATE_MAX: VlossomMessage;
    VS_VALIDATION_FILE_MAX: VlossomMessage;
    VS_VALIDATION_FILE_MIN: VlossomMessage;
    VS_VALIDATION_FILE_TYPE: VlossomMessage;
    VS_VALIDATION_SINGLE_FILE: VlossomMessage;
    VS_TABLE_NO_DATA: string;
    VS_TABLE_ITEMS_SUMMARY: string;
    VS_TABLE_PAGE_SIZE_ALL: string;
    VS_TABLE_PAGE_SIZE_ITEMS: string;
    VS_SELECT_NO_OPTIONS: string;
    VS_GROUPED_LIST_UNGROUPED: string;
    VS_SEARCH_INPUT_PLACEHOLDER: string;
    VS_ARIA_INPUT_CLEAR: string;
    VS_ARIA_SELECT_CLEAR: string;
    VS_ARIA_FILE_DROP_CLEAR: string;
    VS_ARIA_CHIP_CLOSE: string;
    VS_ARIA_TEXT_WRAP_COPY: string;
    VS_ARIA_TEXT_WRAP_LINK: string;
    VS_ARIA_PAGINATION_FIRST: string;
    VS_ARIA_PAGINATION_PREVIOUS: string;
    VS_ARIA_PAGINATION_PAGE: string;
    VS_ARIA_PAGINATION_NEXT: string;
    VS_ARIA_PAGINATION_LAST: string;
    VS_ARIA_TABS_PREVIOUS_HORIZONTAL: string;
    VS_ARIA_TABS_PREVIOUS_VERTICAL: string;
    VS_ARIA_TABS_NEXT_HORIZONTAL: string;
    VS_ARIA_TABS_NEXT_VERTICAL: string;
    VS_ARIA_SEARCH_INPUT_CASE_SENSITIVE: string;
    VS_ARIA_SEARCH_INPUT_CASE_INSENSITIVE: string;
    VS_ARIA_SEARCH_INPUT_REGEX: string;
    VS_ARIA_SEARCH_INPUT_NO_REGEX: string;
    VS_ARIA_THEME_BUTTON_LIGHT: string;
    VS_ARIA_THEME_BUTTON_DARK: string;
    VS_ARIA_MODAL_LABEL: string;
    VS_ALERT_OK: string;
    VS_CONFIRM_OK: string;
    VS_CONFIRM_CANCEL: string;
    VS_PROMPT_OK: string;
    VS_PROMPT_CANCEL: string;
}

export interface VlossomOptions {
    components: { [key: string]: Component };
    colorScheme?: GlobalColorSchemes;
    styleSet?: GlobalStyleSets;
    theme?: Theme;
    radiusRatio?: number;
    messages?: Partial<VlossomMessages>;
}

export type CssPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type Placement = (typeof PLACEMENTS)[number];

export type Alignment = (typeof ALIGNMENTS)[number];

export type TextAlignment = (typeof TEXT_ALIGNMENTS)[number];

export type VerticalAlignment = (typeof VERTICAL_ALIGNMENTS)[number];

export interface BarLayout {
    position: CssPosition;
    height: string;
}

export type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right';

export type OverlayTuple = [string, Ref<OverlayCallbacks>];

export type OverlayCallbacks<T = void> = { [eventName: string]: (...args: any[]) => T | Promise<T> };

export interface DrawerLayout {
    isOpen: boolean;
    pushContainer: boolean;
    placement: DrawerPlacement;
    size: string;
}

export type DrawerLayouts = { [key in DrawerPlacement]: DrawerLayout };

export type Size = (typeof SIZES)[number];

export type SizeProp = Size | string | number;

export interface Breakpoints {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
}

export type UIState = 'idle' | 'success' | 'info' | 'error' | 'warning';

export interface StateMessage<T extends string = UIState> {
    state: T;
    text: string;
}

export type ValueOrFunction<T = any, V = any> = V | ((value: T) => V) | ((value: T) => PromiseLike<V>);

export type Rule<T = any> = ((v: T) => string) | ((v: T) => PromiseLike<string>);

export type Message<T = any> = ValueOrFunction<T, StateMessage>;

export type PropsOf<K extends keyof VsComponentRegistry> = InstanceType<VsComponentRegistry[K]>['$props'];

// rest of the component 'props' bypassed to the component
export type AttrsOf<K extends keyof VsComponentRegistry> = InstanceType<VsComponentRegistry[K]>['$attrs'];

export type EmitsOf<K extends keyof VsComponentRegistry> = InstanceType<VsComponentRegistry[K]>['$emit'];

export type SlotsOf<K extends keyof VsComponentRegistry> = InstanceType<VsComponentRegistry[K]>['$slots'];

export interface InputComponentParams<T = unknown> {
    inputValue: Ref<T>;
    modelValue: Ref<T>;
    id?: Ref<string>;
    disabled?: Ref<boolean>;
    readonly?: Ref<boolean>;
    messages?: Ref<Message<T>[]>;
    rules?: Ref<Rule<T>[]>;
    defaultRules?: Ref<Rule<T>[]>;
    noDefaultRules?: Ref<boolean>;
    state?: Ref<UIState>;
    callbacks?: {
        onBeforeMount?: () => void;
        onMounted?: () => void;
        onChange?: (newValue: T, oldValue: T) => void;
        onClear?: () => void;
        onBeforeUnmount?: () => void;
        onUnmounted?: () => void;
    };
}

export interface FormChildRef {
    validate: () => boolean;
    clear: () => void;
    reset: () => void;
}

export interface FocusableRef {
    focus: () => void;
    blur: () => void;
}

export interface StringModifiers {
    capitalize?: boolean;
    lower?: boolean;
    upper?: boolean;
}

export interface SearchOptions {
    useRegex?: boolean;
    useCaseSensitive?: boolean;
    placeholder?: string;
}

export type SearchProps = boolean | SearchOptions;

export interface OptionItem {
    id: string;
    item: any;
    label: string;
    value: any;
    index: number;
    disabled: boolean;
}
