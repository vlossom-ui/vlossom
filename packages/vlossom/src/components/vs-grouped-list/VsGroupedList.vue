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
            ref="listRef"
            :key="isVirtual ? 'virtual' : 'static'"
            :class="['vs-grouped-list-list', { 'vs-virtual': isVirtual }]"
            :style="isVirtual ? { height: `${virtualizer.getTotalSize()}px` } : undefined"
            tabindex="-1"
        >
            <template v-for="{ row, index, style } in renderedRows" :key="row.key">
                <div
                    v-if="row.type === 'group'"
                    :ref="measureRow"
                    :data-index="index"
                    class="vs-grouped-list-group"
                    :style="[componentStyleSet.$group, style]"
                >
                    <slot name="group" :group="row.group.name" :groupIndex="row.groupIndex" :items="row.group.items">
                        <div class="vs-grouped-list-group-content">
                            <span>{{ row.group.name || optionMessages.VS_GROUPED_LIST_UNGROUPED }}</span>
                        </div>
                    </slot>
                </div>
                <div
                    v-else
                    :ref="measureRow"
                    :data-index="index"
                    :id="row.item.id"
                    :class="['vs-grouped-list-item', { 'vs-disabled': row.item.disabled }]"
                    :style="[componentStyleSet.$item, style]"
                    @click.stop="emitClickItem(row.item, row.groupedIndex, row.group, row.groupIndex)"
                >
                    <slot
                        name="item"
                        v-bind="row.item"
                        :groupedIndex="row.groupedIndex"
                        :group="row.group"
                        :groupIndex="row.groupIndex"
                    >
                        <div class="vs-grouped-list-item-content">
                            <span>{{ row.item.label }}</span>
                        </div>
                    </slot>
                </div>
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
    ref,
    toRefs,
    useTemplateRef,
    type ComponentPublicInstance,
    type ComputedRef,
    type CSSProperties,
    type PropType,
    type TemplateRef,
} from 'vue';
import { useVirtualizer } from '@tanstack/vue-virtual';
import type { OptionItem } from '@/declaration';
import { VsComponent } from '@/declaration';
import { getGroupByProps, getStyleSetProps } from '@/props';
import { useStyleSet, useMessages } from '@/composables';
import type { VsGroupedListGroup, VsGroupedListRow, VsGroupedListStyleSet } from './types';
import { ESTIMATED_ROW_HEIGHT, VIRTUAL_THRESHOLD } from './constants';

import type { VsInnerScrollRef } from '@/components/vs-inner-scroll/types';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';

const componentName = VsComponent.VsGroupedList;
export default defineComponent({
    name: componentName,
    components: { VsInnerScroll },
    props: {
        ...getStyleSetProps<VsGroupedListStyleSet>(),
        ...getGroupByProps(),
        items: {
            type: Array as PropType<OptionItem[]>,
            default: () => [],
        },
        noVirtual: { type: Boolean, default: false },
    },
    emits: ['click-item'],
    // expose: ['scrollToItem'],
    setup(props, { emit }) {
        const { optionMessages } = useMessages();
        const { styleSet, items, groupBy, groupOrder, noVirtual } = toRefs(props);

        const innerScrollRef: TemplateRef<VsInnerScrollRef> = useTemplateRef('innerScrollRef');
        const listRef: TemplateRef<HTMLElement> = useTemplateRef('listRef');

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsGroupedListStyleSet>(
            componentName,
            styleSet,
        );

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

        const rows: ComputedRef<VsGroupedListRow[]> = computed(() =>
            groupedItems.value.flatMap((group, groupIndex) => {
                const itemRows: VsGroupedListRow[] = group.items.map((item, groupedIndex) => ({
                    type: 'item',
                    key: item.id,
                    item,
                    groupedIndex,
                    group,
                    groupIndex,
                }));
                if (!groupBy.value) {
                    return itemRows;
                }
                return [{ type: 'group', key: `group:${group.name}`, group, groupIndex }, ...itemRows];
            }),
        );

        const isVirtual = computed(() => !noVirtual.value && items.value.length > VIRTUAL_THRESHOLD);
        const scrollPaddingStart = ref(0);

        const virtualizer = useVirtualizer<HTMLElement, HTMLElement>(
            computed(() => ({
                enabled: isVirtual.value,
                count: rows.value.length,
                getScrollElement: () => innerScrollRef.value?.bodyRef ?? null,
                estimateSize: () => ESTIMATED_ROW_HEIGHT,
                getItemKey: (index: number) => rows.value[index]?.key ?? index,
                overscan: 10,
                scrollPaddingStart: scrollPaddingStart.value,
            })),
        );

        const renderedRows: ComputedRef<{ row: VsGroupedListRow; index: number; style?: CSSProperties }[]> = computed(
            () => {
                if (!isVirtual.value) {
                    return rows.value.map((row, index) => ({ row, index }));
                }
                return virtualizer.value
                    .getVirtualItems()
                    .filter((virtualItem) => !!rows.value[virtualItem.index])
                    .map((virtualItem) => ({
                        row: rows.value[virtualItem.index]!,
                        index: virtualItem.index,
                        style: { transform: `translateY(${virtualItem.start}px)` },
                    }));
            },
        );

        function measureRow(el: Element | ComponentPublicInstance | null) {
            if (isVirtual.value && el instanceof HTMLElement) {
                virtualizer.value.measureElement(el);
            }
        }

        function emitClickItem(item: OptionItem, groupedIndex: number, group: VsGroupedListGroup, groupIndex: number) {
            emit('click-item', { ...item, groupedIndex, group, groupIndex });
        }

        function scrollToItem(id: string, offset: number = 0) {
            if (isVirtual.value) {
                const index = rows.value.findIndex((row) => row.type === 'item' && row.item.id === id);
                if (index === -1) {
                    return;
                }
                // scrollToIndex는 행 높이가 측정될 때마다 목표 위치를 다시 맞추고, offset은 scrollPaddingStart로만 반영된다.
                // 옵션 변경은 watch로 virtualizer에 전달되므로 다음 tick에 스크롤한다.
                scrollPaddingStart.value = offset;
                nextTick(() => virtualizer.value.scrollToIndex(index, { align: 'start' }));
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
                    const targetScrollTop =
                        scrollContainer.scrollTop + targetRect.top - containerRect.top - offset;
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
            listRef,
            innerScrollRef,
            componentStyleSet,
            optionMessages,
            styleSetVariables,
            componentInlineStyle,
            groupedItems,
            isVirtual,
            virtualizer,
            renderedRows,
            measureRow,
            emitClickItem,
            scrollToItem,
            hasScroll,
        };
    },
});
</script>

<style src="./VsGroupedList.css" />
