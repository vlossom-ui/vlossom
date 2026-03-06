import type { BodyCell, HeaderCell } from '../../types';
import NoColumnDefCellStrategy from './no-column-def-cell-strategy';
import ObjectColumnDefCellStrategy from './object-column-def-cell-strategy';
import StringKeyColumnDefCellStrategy from './string-column-def-cell-strategy';

export interface TableCellStrategy {
    createHeaderCell(): HeaderCell[];
    createBodyCell(): BodyCell[][];
}

export const HEADER_ROW_INDEX = 0;

export { NoColumnDefCellStrategy, ObjectColumnDefCellStrategy, StringKeyColumnDefCellStrategy };
