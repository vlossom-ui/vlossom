import type { VsDatePickerFormat, VsDatePickerType } from './types';

export const TYPE_TO_FORMAT: Record<VsDatePickerType, VsDatePickerFormat> = {
    'datetime-local': 'YYYY-MM-DDTHH:mm',
    date: 'YYYY-MM-DD',
    time: 'HH:mm',
    month: 'YYYY-MM',
};

export const FORMAT_PATTERNS: Record<VsDatePickerType, RegExp> = {
    date: /^\d{4}-\d{2}-\d{2}$/,
    'datetime-local': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    time: /^\d{2}:\d{2}$/,
    month: /^\d{4}-\d{2}$/,
};
