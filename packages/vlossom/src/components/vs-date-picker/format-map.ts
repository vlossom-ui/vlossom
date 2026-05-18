import type { IsoFormat } from '@/utils';
import type { VsDatePickerType } from './types';

export const TYPE_TO_FORMAT: Record<VsDatePickerType, IsoFormat> = {
    date: 'YYYY-MM-DD',
    'datetime-local': 'YYYY-MM-DDTHH:mm',
    time: 'HH:mm',
    month: 'YYYY-MM',
};
