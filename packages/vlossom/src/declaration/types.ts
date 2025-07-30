import type { COLORS } from './constants';
import type { VsComponent } from './enums';

export type ColorScheme = (typeof COLORS)[number];

export type Theme = 'light' | 'dark';

export type GlobalColorScheme = { default?: ColorScheme } & { [key in VsComponent]?: ColorScheme } & {
    [key: string]: ColorScheme;
};

export interface VlossomOptions {
    components?: VsComponent[];
    colorScheme?: GlobalColorScheme;
    theme?: Theme;
}
