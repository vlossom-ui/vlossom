import type { Component } from 'vue';
import type { COLORS } from './constants';
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

export interface FlexStyleSet {
    flex?: string;
    flexDirection?: string;
    flexWrap?: string;
    alignItems?: string;
    justifyContent?: string;
    gap?: string;
}

export interface TextStyleSet {
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    lineHeight?: string;
    whiteSpace?: string;
}
