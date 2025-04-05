import type { Component, Ref } from 'vue';
import type { COLORS, PLACEMENTS, ALIGNS, CSS_POSITION, SIZES } from './constants';
import type { VsComponentType } from './enums';

export type ColorScheme = (typeof COLORS)[number];

export type GlobalColorScheme = { default?: ColorScheme } & { [key in VsComponentType]?: ColorScheme } & {
    [key: string]: ColorScheme;
};

// TODO: plugin type이 정의되면 추가할 예정
export interface VsPlugins {}

export interface VsBoxStyleSet {
    backgroundColor?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    padding?: string;
}

// TODO: 각 컴포넌트의 style set이 정의되면 추가할 예정
export interface VsComponentStyleSet {
    // VsAccordion?: Record<string, VsAccordionStyleSet>;
    // VsAvatar?: Record<string, VsAvatarStyleSet>;
    // VsBlock?: Record<string, VsBlockStyleSet>;
    // VsButton?: Record<string, VsButtonStyleSet>;
    // VsCheckbox?: Record<string, VsCheckboxStyleSet>;
    // VsCheckboxNode?: Record<string, VsCheckboxNodeStyleSet>;
    // VsCheckboxSet?: Record<string, VsCheckboxSetStyleSet>;
    // VsChip?: Record<string, VsChipStyleSet>;
    // VsConfirm?: Record<string, VsConfirmStyleSet>;
    // VsDivider?: Record<string, VsDividerStyleSet>;
    // VsDrawer?: Record<string, VsDrawerStyleSet>;
    // VsFileInput?: Record<string, VsFileInputStyleSet>;
    // VsFooter?: Record<string, VsFooterStyleSet>;
    // VsHeader?: Record<string, VsHeaderStyleSet>;
    // VsImage?: Record<string, VsImageStyleSet>;
    // VsInput?: Record<string, VsInputStyleSet>;
    // VsLabelValue?: Record<string, VsLabelValueStyleSet>;
    // VsLoading?: Record<string, VsLoadingStyleSet>;
    // VsMenuButton?: Record<string, VsMenuButtonStyleSet>;
    // VsModal?: Record<string, VsModalNodeStyleSet>;
    // VsModalNode?: Record<string, VsModalNodeStyleSet>;
    // VsNotice?: Record<string, VsNoticeStyleSet>;
    // VsPage?: Record<string, VsPageStyleSet>;
    // VsPagination?: Record<string, VsPaginationStyleSet>;
    // VsProgress?: Record<string, VsProgressStyleSet>;
    // VsRadio?: Record<string, VsRadioStyleSet>;
    // VsRadioNode?: Record<string, VsRadioNodeStyleSet>;
    // VsRadioSet?: Record<string, VsRadioSetStyleSet>;
    // VsSection?: Record<string, VsSectionStyleSet>;
    // VsSelect?: Record<string, VsSelectStyleSet>;
    // VsStepper?: Record<string, VsStepperStyleSet>;
    // VsSwitch?: Record<string, VsSwitchStyleSet>;
    // VsTable?: Record<string, VsTableStyleSet>;
    // VsTabs?: Record<string, VsTabsStyleSet>;
    // VsTextarea?: Record<string, VsTextareaStyleSet>;
    // VsTextWrap?: Record<string, VsTextWrapStyleSet>;
    // VsThemeButton?: Record<string, VsThemeButtonStyleSet>;
    // VsTooltip?: Record<string, VsTooltipStyleSet>;
}

export type StyleSet = VsComponentStyleSet & Record<string, Record<string, unknown>>;

export interface VlossomOptions {
    components?: string[];
    colorScheme?: GlobalColorScheme;
    styleSet?: StyleSet;
    theme?: 'light' | 'dark';
    darkThemeClass?: string;
    detectOSTheme?: boolean;
    radiusRatio?: number;
}

export interface Breakpoints {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
}

export type UIState = 'idle' | 'success' | 'info' | 'error' | 'warning' | 'selected';

export interface StateMessage {
    state: UIState;
    text: string;
}

export type Rule<T = any> = ((v: T) => string) | ((v: T) => PromiseLike<string>);
export type MessageHandler<T> = (value: T) => StateMessage | Promise<StateMessage>;
export type Message<T> = StateMessage | MessageHandler<T>;

export interface InputComponentParams<T = unknown> {
    inputValue: Ref<T>;
    modelValue: Ref<T>;
    id?: Ref<string>;
    disabled?: Ref<boolean>;
    readonly?: Ref<boolean>;
    messages?: Ref<Message<T>[]>;
    rules?: Ref<Rule<T>[]>;
    defaultRules?: Rule<T>[];
    noDefaultRules?: Ref<boolean>;
    state?: Ref<UIState>;
    callbacks?: {
        onChange?: (newValue: T, oldValue: T) => void;
        onMounted?: () => void;
        onClear?: () => void;
    };
}

export interface StringModifiers {
    capitalize?: boolean;
    lower?: boolean;
    upper?: boolean;
}

export interface VsFormProvide {
    disabled: Ref<boolean>;
    readonly: Ref<boolean>;
    changedObj: Ref<Record<string, boolean>>;
    validObj: Ref<Record<string, boolean>>;
    validateFlag: Ref<boolean>;
    clearFlag: Ref<boolean>;
    updateChanged: (id: string, changed: boolean) => void;
    updateValid: (id: string, valid: boolean) => void;
    removeFromForm: (id: string) => void;
}

export interface BarLayout {
    position: (typeof CSS_POSITION)[number];
    height: string;
}

export interface DrawerLayout {
    drawerOpen: boolean;
    placement: Exclude<Placement, 'middle'>;
    size: string;
}

export interface DrawerLayouts {
    left: DrawerLayout;
    top: DrawerLayout;
    right: DrawerLayout;
    bottom: DrawerLayout;
}
export interface VsLayoutProvide {
    header: Ref<BarLayout>;
    footer: Ref<BarLayout>;
    drawers: Ref<DrawerLayouts>;
    setHeaderLayout: (headerLayout: BarLayout) => void;
    setFooterLayout: (footerLayout: BarLayout) => void;
    setDrawerLayout: (drawerLayout: DrawerLayout) => void;
}

export type Placement = (typeof PLACEMENTS)[number];

export type Size = (typeof SIZES)[number];

export type SizeProp = Size | string | number;

export interface LabelValue<T = any> {
    label: string;
    value: T;
}

export type Align = (typeof ALIGNS)[number];

export interface Focusable {
    focus(): void;
    blur(): void;
}

export interface AttachInfo {
    placement?: Exclude<Placement, 'middle'>;
    align?: Align;
    margin?: number;
    followWidth?: boolean;
}

export type EventCallback<T = void> = (...args: unknown[]) => T | Promise<T>;
export type EventCallbacks<T = void> = Record<string, EventCallback<T>>;

export interface ModalOptions<T> {
    component: string | Component;
    props?: Record<string, any>;
    container?: string;
    // sync with getOverlayProps function
    colorScheme?: ColorScheme;
    styleSet?: string | T;
    callbacks?: EventCallbacks;
    dimClose?: boolean;
    dimmed?: boolean;
    escClose?: boolean;
    focusLock?: boolean;
    id?: string;
    initialFocusRef?: HTMLElement | null;
    scrollLock?: boolean;
    size?: string | number | { width?: string | number; height?: string | number };
}

export interface ToastOptions<T> {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | T;
    align?: Align;
    autoClose?: boolean;
    placement?: Exclude<Placement, 'left' | 'right'>;
    primary?: boolean;
    timeout?: number;
    logger?: (message: string | Component) => string;
}

export interface ToastInfo<T> extends ToastOptions<T> {
    id: string;
    content: string | Component;
}
