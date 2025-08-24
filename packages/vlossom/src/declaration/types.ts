import type { Component } from 'vue';
import type { COLORS } from './constants';
import type { VsComponent } from './enums';

export type ColorScheme = (typeof COLORS)[number];

export type Theme = 'light' | 'dark';

export type GlobalColorSchemes = { default?: ColorScheme } & { [key in VsComponent]?: ColorScheme } & {
    [key: string]: ColorScheme;
};

export interface VsTextStyleSet {
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    whiteSpace?: string;
}

export type GlobalStyleSets = {
    [key: string]: { [key in VsComponent]?: any } & { [key: string]: any };
};

export interface VlossomOptions {
    components?: { [key: string]: Component };
    colorScheme?: GlobalColorSchemes;
    styleSet?: GlobalStyleSets;
    theme?: Theme;
    radiusRatio?: number;
}

export interface BarLayout {
    position: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static';
    height: string;
}

export type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerLayout {
    isOpen: boolean;
    responsive: boolean;
    placement: DrawerPlacement;
    size: string;
}

export type DrawerLayouts = { [key in DrawerPlacement]: DrawerLayout };

export interface Breakpoints {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
}
