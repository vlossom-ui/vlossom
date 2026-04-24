export const THEME_KEY = 'vlossom:theme-mode';
export const LAYOUT_STORE_KEY = 'vlossom:layout-store';
export const FORM_STORE_KEY = 'vlossom:form-store';

export const OVERLAY_OPEN = 'vlossom:overlay-open';
export const OVERLAY_CLOSE = 'vlossom:overlay-close';

export const ALERT_OK = 'vlossom:alert-ok';

export const CONFIRM_OK = 'vlossom:confirm-ok';
export const CONFIRM_CANCEL = 'vlossom:confirm-cancel';

export const PROMPT_OK = 'vlossom:prompt-ok';
export const PROMPT_CANCEL = 'vlossom:prompt-cancel';

export const ANIMATION_DURATION = 300;

export const COLORS = [
    'brown',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'gray',
] as const;

export const COLOR_SCHEMES = [...COLORS, 'none'] as const;

export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const PLACEMENTS = ['top', 'right', 'bottom', 'left', 'middle'] as const;

export const ALIGNMENTS = ['start', 'center', 'end'] as const;

export const TEXT_ALIGNMENTS = ['left', 'center', 'right'] as const;

export const VERTICAL_ALIGNMENTS = ['top', 'middle', 'bottom'] as const;

export const NOT_SELECTED = -1;
