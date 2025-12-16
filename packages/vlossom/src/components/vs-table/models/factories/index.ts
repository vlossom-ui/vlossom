import type { BodyCell, HeaderCell } from '../../types';
import NoColumnDefCellFactory from './no-column-def-cell-factory';
import ObjectColumnDefCellFactory from './object-column-def-cell-factory';
import StringKeyColumnDefCellFactory from './string-column-def-cell-factory';

export interface TableCellFactory {
    createHeaderCell(): HeaderCell[];
    createBodyCell(): BodyCell[][];
}

export const HEADER_ROW_INDEX = 0 as const;

export { NoColumnDefCellFactory, ObjectColumnDefCellFactory, StringKeyColumnDefCellFactory };
