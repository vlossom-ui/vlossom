import {
    computed,
    shallowRef,
    watch,
    type ComputedRef,
    type ShallowRef,
    type WritableComputedRef,
} from 'vue';
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
    // shallowRef 사용: 배열 내부 요소가 아닌 배열 자체 교체만 추적
    const displayOrder = shallowRef<number[]>([]);

    /**
     * displayedBodyCells: 드래그로 재정렬된 bodyCells
     *
     * getter: displayOrder에 따라 bodyCells를 재정렬하여 반환
     * setter: vuedraggable이 순서를 변경할 때 호출되어 displayOrder를 업데이트
     */
    const displayedBodyCells: WritableComputedRef<BodyCell[][]> = computed({
        get(): BodyCell[][] {
            const baseCells = bodyCells.value;

            // displayOrder가 비어있으면 원본 그대로 반환 (초기화는 watch에서 처리)
            if (displayOrder.value.length === 0) {
                return baseCells;
            }

            // displayOrder에 따라 재정렬 (watch가 길이를 보장하므로 filter 불필요)
            return displayOrder.value.map((idx) => baseCells[idx]);
        },
        set(newCells: BodyCell[][]): void {
            const baseCells = bodyCells.value;

            // O(n) 최적화: Map을 사용하여 ID -> 인덱스 매핑 생성
            const idToIndexMap = new Map<string | undefined, number>();
            baseCells.forEach((row, idx) => {
                idToIndexMap.set(getRowId(row), idx);
            });

            // 새로운 순서로 displayOrder 업데이트
            const mappedIndices = newCells.map((cellRow) => idToIndexMap.get(getRowId(cellRow)));
            const filteredIndices = mappedIndices.filter((idx): idx is number => idx !== undefined);

            displayOrder.value = filteredIndices;
        },
    });

    /**
     * bodyCells가 변경되면 displayOrder를 초기화
     * - 필터, 정렬, 페이지네이션이 변경되면 드래그 순서를 리셋
     * - 초기 로드 시에도 displayOrder를 설정
     */
    watch(
        bodyCells,
        (newCells) => {
            // 길이가 변경되거나 비어있으면 원본 순서로 초기화
            if (displayOrder.value.length !== newCells.length) {
                displayOrder.value = newCells.map((_, idx) => idx);
            }
        },
        { immediate: true, flush: 'sync' },
    );

    /**
     * SortableEvent를 받아서 DragPayload를 생성
     *
     * @param event - Sortable.js의 드래그 이벤트
     * @returns DragPayload - from/to 글로벌 인덱스, 원본 인덱스, 아이템 정보
     */
    function createDragPayload(event: SortableEvent): DragPayload | null {
        const { oldIndex, newIndex } = event;

        // 인덱스 검증
        if (oldIndex === undefined || newIndex === undefined) return null;

        // displayOrder를 통해 bodyCells의 실제 인덱스 찾기
        const fromBodyIndex = displayOrder.value[oldIndex];
        const toBodyIndex = displayOrder.value[newIndex];
        if (fromBodyIndex === undefined || toBodyIndex === undefined) return null;

        const baseCells = bodyCells.value;

        // bodyCells 범위 검증 (한 번에 처리)
        const isValidIndex = (idx: number) => idx >= 0 && idx < baseCells.length;
        if (!isValidIndex(fromBodyIndex) || !isValidIndex(toBodyIndex)) return null;

        // 페이지네이션을 고려한 글로벌 인덱스 계산
        const globalOffset = pageStartIndex.value;

        return {
            from: globalOffset + fromBodyIndex,
            to: globalOffset + toBodyIndex,
            oldIndex, // 디버깅용
            newIndex, // 디버깅용
            fromItem: getRowItem(baseCells[fromBodyIndex]),
            toItem: getRowItem(baseCells[toBodyIndex]),
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
    displayOrder: ShallowRef<number[]>;
    displayedBodyCells: WritableComputedRef<BodyCell[][]>;
    createDragPayload: (event: SortableEvent) => DragPayload | null;
    resetDisplayOrder: () => void;
};
