<template>
    <vs-inner-scroll
        ref="innerScrollRef"
        class="vs-grouped-list"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :style-set="{
            $header: componentStyleSet.$header,
            $content: componentStyleSet.$content,
            $footer: componentStyleSet.$footer,
        }"
    >
        <template #header v-if="$slots.header">
            <slot name="header" />
        </template>

        <div
            class="vs-grouped-list-list"
            ref="listRef"
            tabindex="-1"
            :style="isVirtual ? { position: 'relative', height: `${virtualizer.getTotalSize()}px` } : {}"
        >
            <!-- Virtual scroll mode -->
            <template v-if="isVirtual">
                <div
                    v-for="vRow in virtualRowData"
                    :key="vRow.key"
                    :data-index="vRow.index"
                    :ref="(el) => virtualizer.measureElement(el as Element)"
                    :style="{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${vRow.start}px)`,
                    }"
                >
                    <vs-grouped-list-group-row
                        v-if="vRow.type === 'group'"
                        :row="vRow"
                        :styleSet="componentStyleSet.$group"
                    >
                        <template #default="slotProps">
                            <slot name="group" v-bind="slotProps" />
                        </template>
                    </vs-grouped-list-group-row>
                    <vs-grouped-list-item-row
                        v-else
                        :row="vRow"
                        :styleSet="componentStyleSet.$item"
                        @click="emitClickItem(vRow)"
                    >
                        <template #default="slotProps">
                            <slot name="item" v-bind="slotProps" />
                        </template>
                    </vs-grouped-list-item-row>
                </div>
            </template>

            <!-- Regular rendering mode -->
            <template v-else>
                <template v-for="row in flatRows" :key="getRowKey(row)">
                    <vs-grouped-list-group-row
                        v-if="row.type === 'group'"
                        :row="row"
                        :styleSet="componentStyleSet.$group"
                    >
                        <template #default="slotProps">
                            <slot name="group" v-bind="slotProps" />
                        </template>
                    </vs-grouped-list-group-row>
                    <vs-grouped-list-item-row
                        v-else
                        :row="row"
                        :styleSet="componentStyleSet.$item"
                        @click="emitClickItem(row)"
                    >
                        <template #default="slotProps">
                            <slot name="item" v-bind="slotProps" />
                        </template>
                    </vs-grouped-list-item-row>
                </template>
            </template>
        </div>

        <slot name="empty" v-if="items.length === 0" />

        <template #footer v-if="$slots.footer">
            <slot name="footer" />
        </template>
    </vs-inner-scroll>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    nextTick,
    toRefs,
    useTemplateRef,
    type ComputedRef,
    type PropType,
    type TemplateRef,
} from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';
import type { OptionItem } from '@/declaration';
import { VsComponent } from '@/declaration';
import { getGroupByProps, getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsGroupedListGroup, VsGroupedListStyleSet, GroupRow, ItemRow, Row, VirtualRow } from './types';

import type { VsInnerScrollRef } from '@/components/vs-inner-scroll/types';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';
import VsGroupedListGroupRow from './VsGroupedListGroupRow.vue';
import VsGroupedListItemRow from './VsGroupedListItemRow.vue';
import { VIRTUAL_ITEM_THRESHOLD, ESTIMATED_ITEM_SIZE, VIRTUAL_OVERSCAN } from './constants';

const componentName = VsComponent.VsGroupedList;
export default defineComponent({
    name: componentName,
    components: { VsInnerScroll, VsGroupedListGroupRow, VsGroupedListItemRow },
    props: {
        ...getStyleSetProps<VsGroupedListStyleSet>(),
        ...getGroupByProps(),
        items: {
            type: Array as PropType<OptionItem[]>,
            default: () => [],
        },
    },
    emits: ['click-item'],
    // expose: ['scrollToItem'],
    setup(props, { emit }) {
        const { styleSet, items, groupBy, groupOrder } = toRefs(props);

        const innerScrollRef: TemplateRef<VsInnerScrollRef> = useTemplateRef('innerScrollRef');
        const listRef: TemplateRef<HTMLElement> = useTemplateRef('listRef');

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsGroupedListStyleSet>(
            componentName,
            styleSet,
        );

        const isVirtual = computed(() => items.value.length >= VIRTUAL_ITEM_THRESHOLD);

        const groupedItems: ComputedRef<VsGroupedListGroup[]> = computed(() => {
            // groupBy가 없으면 모든 아이템을 하나의 그룹으로 반환
            if (!groupBy.value) {
                return [
                    {
                        name: '',
                        items: items.value,
                    },
                ];
            }

            // 그룹별로 아이템 분류 및 등장 순서 기록
            const groupMap = new Map<string, any[]>();
            // item에서 등장하는 그룹 순서
            const groupOrderInItems: string[] = [];

            items.value.forEach((item, index) => {
                const groupName: string = groupBy.value(item.item, index) || '';
                if (!groupMap.has(groupName)) {
                    groupMap.set(groupName, []);
                }
                groupMap.get(groupName)?.push(item);

                // 처음 등장하는 그룹이면 순서에 추가 (빈 스트링 제외)
                if (groupName !== '' && !groupOrderInItems.includes(groupName)) {
                    groupOrderInItems.push(groupName);
                }
            });

            // 그룹 순서 결정
            const allGroups: string[] = Array.from(groupMap.keys()).filter((g) => g !== '');
            let orderedGroups: string[] = [];

            if (!groupOrder.value || groupOrder.value.length === 0) {
                orderedGroups = groupOrderInItems;
            } else {
                // groupOrder가 있으면 그 순서대로, 나머지는 순서대로
                const orderedSet = new Set<string>();
                for (const groupName of groupOrder.value) {
                    if (!orderedSet.has(groupName) && allGroups.includes(groupName)) {
                        orderedSet.add(groupName);
                        orderedGroups.push(groupName);
                    }
                }
                // 나머지 그룹들 추가 (item에서 등장하는 순서대로)
                for (const groupName of groupOrderInItems) {
                    if (!orderedSet.has(groupName)) {
                        orderedGroups.push(groupName);
                    }
                }
            }

            const result: VsGroupedListGroup[] = [];
            for (const groupName of orderedGroups) {
                const groupItems = groupMap.get(groupName);
                if (groupItems && groupItems.length > 0) {
                    result.push({ name: groupName, items: groupItems });
                }
            }

            // ungrouped는 제일 밑으로
            const ungroupedItems = groupMap.get('') || [];
            if (ungroupedItems.length > 0) {
                result.push({ name: '', items: ungroupedItems });
            }

            return result;
        });

        // Group headers + items를 하나의 평탄화 배열로 (virtual/regular 공용)
        const flatRows = computed<Row[]>(() => {
            const rows: Row[] = [];
            groupedItems.value.forEach((group, groupIndex) => {
                if (groupBy.value != null) {
                    const groupRow: GroupRow = { type: 'group', name: group.name, groupIndex, items: group.items };
                    rows.push(groupRow);
                }
                group.items.forEach((item, itemIndex) => {
                    const itemRow: ItemRow = { type: 'item', item, itemIndex, group, groupIndex };
                    rows.push(itemRow);
                });
            });
            return rows;
        });

        const virtualizer = useVirtualizer(
            computed(() => ({
                count: flatRows.value.length,
                getScrollElement: () => (innerScrollRef.value?.bodyRef as HTMLElement | null) ?? null,
                estimateSize: () => ESTIMATED_ITEM_SIZE,
                overscan: VIRTUAL_OVERSCAN,
            })),
        );

        const virtualRowData = computed<VirtualRow[]>(() => {
            if (!isVirtual.value) {
                return [];
            }
            return virtualizer.value.getVirtualItems().reduce<VirtualRow[]>((acc, vRow) => {
                const row = flatRows.value[vRow.index];
                if (!row) {
                    return acc;
                }
                const positioned = { key: String(vRow.key), index: vRow.index, start: vRow.start };
                acc.push({ ...positioned, ...row } as VirtualRow);
                return acc;
            }, []);
        });

        function getRowKey(row: Row): string {
            return row.type === 'group' ? `group-${row.groupIndex}` : row.item.id;
        }

        function emitClickItem({ item, itemIndex, group, groupIndex }: ItemRow) {
            emit('click-item', { ...item, itemIndex, group, groupIndex });
        }

        function scrollToItem(id: string, offset: number = 0) {
            if (isVirtual.value) {
                const targetIndex = flatRows.value.findIndex((row) => row.type === 'item' && row.item.id === id);
                if (targetIndex === -1) {
                    return;
                }
                virtualizer.value.scrollToIndex(targetIndex, { align: 'start' });
                if (offset !== 0) {
                    nextTick(() => {
                        requestAnimationFrame(() => {
                            const scrollContainer = innerScrollRef.value?.bodyRef as HTMLElement | null;
                            if (scrollContainer) {
                                scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - offset);
                            }
                        });
                    });
                }
                return;
            }

            const targetItem = items.value.find((i) => i.id === id);
            if (!targetItem || !listRef.value || !innerScrollRef.value) {
                return;
            }

            const targetElement: HTMLElement | null = listRef.value.querySelector(`#${targetItem.id}`);
            if (!targetElement) {
                return;
            }

            nextTick(() => {
                requestAnimationFrame(() => {
                    const scrollContainer = innerScrollRef.value?.bodyRef as HTMLElement | null;
                    if (!scrollContainer || !targetElement) {
                        return;
                    }
                    const containerRect = scrollContainer.getBoundingClientRect();
                    const targetRect = targetElement.getBoundingClientRect();
                    const targetScrollTop = scrollContainer.scrollTop + targetRect.top - containerRect.top - offset;
                    scrollContainer.scrollTo({ top: targetScrollTop, behavior: 'auto' });
                });
            });
        }

        function hasScroll() {
            if (!innerScrollRef.value) {
                return false;
            }
            return innerScrollRef.value.hasScroll();
        }

        return {
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            isVirtual,
            virtualizer,
            virtualRowData,
            flatRows,
            groupedItems,
            getRowKey,
            emitClickItem,
            scrollToItem,
            hasScroll,
        };
    },
});
</script>

<style src="./VsGroupedList.css" />
