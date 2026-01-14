import { computed, ref, watch, type ComputedRef, type Ref, type WritableComputedRef } from 'vue';
import type { BodyCell, DragPayload } from '../types';
import { getRowId, getRowItem } from '../types';
import type { SortableEvent } from 'sortablejs';

/**
 * Draggable table row 기능을 위한 composable
 *
 * @description
 * - displayOrder: 현재 표시 순서를 추적하는 인덱스 배열
 * - displayedBodyCells: 드래그로 재정렬된 bodyCells (v-model로 바인딩)
 * - bodyCells가 변경되면 displayOrder를 자동으로 초기화
 *
 * @param bodyCells - 필터/정렬/페이지네이션이 적용된 body cells
 * @param pageStartIndex - 현재 페이지의 시작 인덱스 (글로벌 인덱스 계산용)
 * @returns Drag 관련 상태와 헬퍼 함수들
 */
export function useTableDrag(bodyCells: ComputedRef<BodyCell[][]>, pageStartIndex: ComputedRef<number>) {
    const displayOrder = ref<number[]>([]);

    /**
     * displayedBodyCells: 드래그로 재정렬된 bodyCells
     *
     * getter: displayOrder에 따라 bodyCells를 재정렬하여 반환
     * setter: vuedraggable이 순서를 변경할 때 호출되어 displayOrder를 업데이트
     */
    const displayedBodyCells: WritableComputedRef<BodyCell[][]> = computed({
        get(): BodyCell[][] {
            const baseCells = bodyCells.value;

            // displayOrder가 초기화되지 않았거나 길이가 맞지 않으면 초기화
            if (displayOrder.value.length !== baseCells.length) {
                displayOrder.value = baseCells.map((_, idx) => idx);
                return baseCells;
            }

            // displayOrder에 따라 재정렬 (filter 제거 - 항상 유효한 인덱스여야 함)
            return displayOrder.value.map((idx) => baseCells[idx]);
        },
        set(newCells: BodyCell[][]): void {
            const baseCells = bodyCells.value;

            // 새로운 순서로 displayOrder 업데이트
            // row ID를 기준으로 원본 인덱스를 찾음
            displayOrder.value = newCells.map((cellRow) => {
                const rowId = getRowId(cellRow);
                return baseCells.findIndex((originalRow) => getRowId(originalRow) === rowId);
            });
        },
    });

    /**
     * bodyCells가 변경되면 displayOrder를 초기화
     * - 필터, 정렬, 페이지네이션이 변경되면 드래그 순서를 리셋
     */
    watch(
        bodyCells,
        () => {
            displayOrder.value = [];
        },
        { flush: 'sync' },
    );

    /**
     * SortableEvent를 받아서 DragPayload를 생성
     *
     * @param event - Sortable.js의 드래그 이벤트
     * @returns DragPayload - from/to 글로벌 인덱스 및 아이템 정보
     */
    function createDragPayload(event: SortableEvent): DragPayload | null {
        const { oldIndex, newIndex } = event;

        // oldIndex 또는 newIndex가 없으면 null 반환
        if (oldIndex === undefined || newIndex === undefined) {
            return null;
        }

        // displayOrder를 통해 bodyCells의 실제 인덱스 찾기
        const fromBodyIndex = displayOrder.value[oldIndex];
        const toBodyIndex = displayOrder.value[newIndex];

        // 유효하지 않은 인덱스면 null 반환
        if (fromBodyIndex === undefined || toBodyIndex === undefined) {
            return null;
        }

        const baseCells = bodyCells.value;

        // bodyCells 범위 검증
        if (fromBodyIndex < 0 || fromBodyIndex >= baseCells.length) {
            return null;
        }
        if (toBodyIndex < 0 || toBodyIndex >= baseCells.length) {
            return null;
        }

        // 페이지네이션이 활성화된 경우 pageStartIndex를 더해 글로벌 인덱스 계산
        const fromGlobalIndex = pageStartIndex.value + fromBodyIndex;
        const toGlobalIndex = pageStartIndex.value + toBodyIndex;

        // 드래그된 row와 목적지 row의 아이템 가져오기
        const fromRow = baseCells[fromBodyIndex];
        const toRow = baseCells[toBodyIndex];

        const fromItem = getRowItem(fromRow);
        const toItem = getRowItem(toRow);

        return {
            from: fromGlobalIndex,
            to: toGlobalIndex,
            fromItem,
            toItem,
        };
    }

    /**
     * displayOrder를 명시적으로 초기화하는 함수
     * - 외부에서 강제로 드래그 순서를 리셋할 때 사용
     */
    function resetDisplayOrder(): void {
        displayOrder.value = [];
    }

    return {
        displayOrder,
        displayedBodyCells,
        createDragPayload,
        resetDisplayOrder,
    };
}

export type TableDragComposable = {
    displayOrder: Ref<number[]>;
    displayedBodyCells: WritableComputedRef<BodyCell[][]>;
    createDragPayload: (event: SortableEvent) => DragPayload | null;
    resetDisplayOrder: () => void;
};
