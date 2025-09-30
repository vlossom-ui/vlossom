import type { Component, Ref } from 'vue';
import type { COLORS, SIZES } from './constants';
import type { VsComponent } from './enums';

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
    display?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: string | number;
}

export interface TextStyleSet {
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    lineHeight?: string;
    whiteSpace?: string;
}

export interface FlexStyleSet {
    flex?: string;
    flexDirection?: string;
    flexWrap?: string;
    alignItems?: string;
    justifyContent?: string;
    gap?: string;
}

export interface Focusable {
    focus(): void;
    blur(): void;
}

export type UIState = 'idle' | 'success' | 'info' | 'error' | 'warning' | 'selected';

export interface StateMessage<T extends string = UIState> {
    state: T;
    text: string;
}

export type Rule<T = any> = ((v: T) => string) | ((v: T) => PromiseLike<string>);

export type Message<T = any> = StateMessage | ((v: T) => StateMessage) | ((v: T) => PromiseLike<StateMessage>);

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
