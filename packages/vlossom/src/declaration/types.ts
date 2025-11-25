import type { Component, Ref } from 'vue';
import type { ALIGNMENTS, COLORS, PLACEMENTS, SIZES } from './constants';
import type { VsComponent } from './enums';
import type { VlossomComponents } from '@/main';

export type ColorScheme = (typeof COLORS)[number];

export type Theme = 'light' | 'dark';

export type GlobalColorSchemes = { default?: ColorScheme } & { [key in VsComponent]?: ColorScheme } & {
    [key: string]: ColorScheme;
};

export type GlobalStyleSets = {
    [key: string]: { [key in VsComponent]?: any } & { [key: string]: any };
};

export interface VlossomOptions {
    components: { [key: string]: Component };
    colorScheme?: GlobalColorSchemes;
    styleSet?: GlobalStyleSets;
    theme?: Theme;
    radiusRatio?: number;
}

export type CssPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export type Placement = (typeof PLACEMENTS)[number];

export type Alignment = (typeof ALIGNMENTS)[number];

export interface BarLayout {
    position: CssPosition;
    height: string;
}

export type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right';

export type OverlayTuple = [string, Ref<OverlayCallbacks>];

export type OverlayCallbacks<T = void> = { [eventName: string]: (...args: any[]) => T | Promise<T> };

export interface DrawerLayout {
    isOpen: boolean;
    responsive: boolean;
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

export interface SizeStyleSet {
    width?: string;
    height?: string;
}

export interface BoxStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
}

export interface TextStyleSet {
    fontColor?: string;
    fontSize?: string;
    fontWeight?: number;
}

export interface Focusable {
    focus(): void;
    blur(): void;
}

export type UIState = 'idle' | 'success' | 'info' | 'error' | 'warning';

export interface StateMessage<T extends string = UIState> {
    state: T;
    text: string;
}

export type ValueOrFunction<T = any, V = any> = V | ((value: T) => V) | ((value: T) => PromiseLike<V>);

export type Rule<T = any> = ((v: T) => string) | ((v: T) => PromiseLike<string>);

export type Message<T = any> = ValueOrFunction<T, StateMessage>;

export type PropsOf<C extends keyof typeof VlossomComponents> = InstanceType<(typeof VlossomComponents)[C]>['$props'];

// rest of the component 'props' bypassed to the component
export type AttrsOf<C extends keyof typeof VlossomComponents> = InstanceType<(typeof VlossomComponents)[C]>['$attrs'];

export type EmitsOf<C extends keyof typeof VlossomComponents> = InstanceType<(typeof VlossomComponents)[C]>['$emit'];

export type SlotsOf<C extends keyof typeof VlossomComponents> = InstanceType<(typeof VlossomComponents)[C]>['$slots'];

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

export interface FormRef {
    validate: () => void;
    clear: () => void;
}

export interface InputRef extends FormRef {
    focus: () => void;
    blur: () => void;
}

export interface StringModifiers {
    capitalize?: boolean;
    lower?: boolean;
    upper?: boolean;
}
