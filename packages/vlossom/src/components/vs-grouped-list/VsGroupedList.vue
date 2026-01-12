<template>
    <vs-inner-scroll ref="innerScrollRef" class="vs-grouped-list" :style="styleSetVariables">
        <template #header v-if="$slots.header">
            <slot name="header" />
        </template>

        <vs-visible-render class="vs-grouped-list-list" ref="visibleRenderRef" root-margin="10px" tabindex="-1">
            <template v-for="(group, groupIndex) in groupedItems" :key="`group-${groupIndex}`">
                <div v-if="!!groupBy" class="vs-grouped-list-group">
                    <slot name="group" :group="group.name" :groupIndex :items="group.items">
                        <div class="vs-grouped-list-group-content">
                            <span>{{ group.name || 'Ungrouped' }}</span>
                        </div>
                    </slot>
                </div>
                <div
                    v-for="(item, groupedIndex) in group.items"
                    :key="`${item.id}-${groupedIndex}`"
                    :id="item.id"
                    :class="['vs-grouped-list-item', { 'vs-disabled': item.disabled }]"
                    @click.prevent.stop="emitClickItem(item, groupedIndex, group, groupIndex)"
                >
                    <slot name="item" v-bind="item" :groupedIndex :group :groupIndex>
                        <div class="vs-grouped-list-item-content">
                            <span>{{ item.label }}</span>
                        </div>
                    </slot>
                </div>
            </template>
        </vs-visible-render>

        <template #footer v-if="$slots.footer">
            <slot name="footer" />
        </template>
    </vs-inner-scroll>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    useTemplateRef,
    type ComputedRef,
    type PropType,
    type TemplateRef,
} from 'vue';
import type { OptionItem } from '@/declaration';
import { VsComponent } from '@/declaration';
import { getGroupByProps, getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsGroupedListGroup, VsGroupedListStyleSet } from './types';

import type { VsVisibleRenderRef } from '@/components/vs-visible-render/types';
import VsVisibleRender from '@/components/vs-visible-render/VsVisibleRender.vue';
import type { VsInnerScrollRef } from '@/components/vs-inner-scroll/types';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';

const componentName = VsComponent.VsGroupedList;
export default defineComponent({
    name: componentName,
    components: { VsInnerScroll, VsVisibleRender },
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
        const visibleRenderRef: TemplateRef<VsVisibleRenderRef> = useTemplateRef('visibleRenderRef');

        const { styleSetVariables, componentStyleSet } = useStyleSet<VsGroupedListStyleSet>(componentName, styleSet);

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
                    if (allGroups.includes(groupName)) {
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

        function emitClickItem(item: OptionItem, groupedIndex: number, group: VsGroupedListGroup, groupIndex: number) {
            emit('click-item', { ...item, groupedIndex, group, groupIndex });
        }

        function scrollToItem(id: string) {
            if (!visibleRenderRef.value) {
                return;
            }

            const targetItem = items.value.find((i) => i.id === id);
            if (!targetItem) {
                return;
            }

            const targetElement: HTMLElement | null =
                visibleRenderRef.value?.$el.querySelector(`#${targetItem.id}`) || null;
            if (!targetElement) {
                return;
            }

            visibleRenderRef.value.scrollToElement(targetElement);
        }

        function hasScroll() {
            if (!innerScrollRef.value) {
                return false;
            }
            return innerScrollRef.value.hasScroll();
        }

        return {
            visibleRenderRef,
            innerScrollRef,
            styleSetVariables,
            componentStyleSet,
            groupedItems,
            emitClickItem,
            scrollToItem,
            hasScroll,
        };
    },
});
</script>

<style src="./VsGroupedList.css" />
