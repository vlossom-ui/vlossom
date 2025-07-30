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
    components?: VsComponent[];
    colorScheme?: GlobalColorSchemes;
    styleSet?: GlobalStyleSets;
    theme?: Theme;
    radiusRatio?: number;
}
