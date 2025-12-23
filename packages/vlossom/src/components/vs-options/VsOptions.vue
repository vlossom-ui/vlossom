<template>
    <vs-inner-scroll class="vs-options" :style="styleSetVariables">
        <template #header v-if="$slots.header">
            <slot name="header" />
        </template>

        <vs-visible-render class="vs-options-list" ref="visibleRenderRef" root-margin="10px" tabindex="-1">
            <template v-for="(group, groupIndex) in groupedOptions" :key="`group-${groupIndex}`">
                <div v-if="!!groupBy" class="vs-options-group">
                    <slot name="group" :group="group.name" :groupIndex :options="group.options">
                        <div class="vs-options-group-content">
                            <span>{{ group.name || 'Ungrouped' }}</span>
                        </div>
                    </slot>
                </div>
                <div
                    v-for="(option, groupedIndex) in group.options"
                    :key="`${option.id}-${groupedIndex}`"
                    :id="option.id"
                    :class="['vs-options-option', { 'vs-disabled': option.disabled }]"
                    @click.prevent.stop="emitClickOption(option, groupedIndex, group, groupIndex)"
                >
                    <slot name="option" v-bind="option" :groupedIndex :group :groupIndex>
                        <div class="vs-options-option-content">
                            <span>{{ option.label }}</span>
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
import { VsComponent } from '@/declaration';
import { getGroupByProps, getOptionsProps, getStyleSetProps } from '@/props';
import { useStyleSet, useOptionLabelValue } from '@/composables';
import { objectUtil, stringUtil } from '@/utils';
import type { VsOptionsGroup, VsOptionsItem, VsOptionsStyleSet } from './types';

import type { VsVisibleRenderRef } from '@/components/vs-visible-render/types';
import VsVisibleRender from '@/components/vs-visible-render/VsVisibleRender.vue';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';

const componentName = VsComponent.VsOptions;
export default defineComponent({
    name: componentName,
    components: { VsInnerScroll, VsVisibleRender },
    props: {
        ...getStyleSetProps<VsOptionsStyleSet>(),
        ...getOptionsProps(),
        ...getGroupByProps(),
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number, options: any[]) => boolean)>,
            default: false,
        },
    },
    emits: ['click-option'],
    setup(props, { emit }) {
        const { styleSet, options, optionLabel, optionValue, groupBy, groupOrder, disabled } = toRefs(props);

        const visibleRenderRef: TemplateRef<VsVisibleRenderRef> = useTemplateRef('visibleRenderRef');

        const { styleSetVariables, componentStyleSet } = useStyleSet<VsOptionsStyleSet>(componentName, styleSet);

        const { getOptionLabel, getOptionValue } = useOptionLabelValue(optionLabel, optionValue);

        const computedOptions: ComputedRef<VsOptionsItem[]> = computed(() => {
            return options.value.map((option, index) => {
                const label = getOptionLabel(option);
                const value = getOptionValue(option);
                return {
                    id: stringUtil.hash(label),
                    item: option,
                    label,
                    value,
                    index,
                    disabled:
                        typeof disabled.value === 'function'
                            ? disabled.value(option, index, options.value)
                            : disabled.value,
                };
            });
        });

        const groupedOptions: ComputedRef<VsOptionsGroup[]> = computed(() => {
            // groupBy가 없으면 모든 옵션을 하나의 그룹으로 반환
            if (!groupBy.value) {
                return [
                    {
                        name: '',
                        options: computedOptions.value,
                    },
                ];
            }

            // 그룹별로 옵션 분류 및 등장 순서 기록
            const groupMap = new Map<string, any[]>();
            // option에서 등장하는 그룹 순서
            const groupOrderInOptions: string[] = [];

            computedOptions.value.forEach((option, index) => {
                const groupName: string = groupBy.value(option.item, index) || '';
                if (!groupMap.has(groupName)) {
                    groupMap.set(groupName, []);
                }
                groupMap.get(groupName)?.push(option);

                // 처음 등장하는 그룹이면 순서에 추가 (빈 스트링 제외)
                if (groupName !== '' && !groupOrderInOptions.includes(groupName)) {
                    groupOrderInOptions.push(groupName);
                }
            });

            // 그룹 순서 결정
            const allGroups: string[] = Array.from(groupMap.keys()).filter((g) => g !== '');
            let orderedGroups: string[] = [];

            if (!groupOrder.value || groupOrder.value.length === 0) {
                orderedGroups = groupOrderInOptions;
            } else {
                // groupOrder가 있으면 그 순서대로, 나머지는 순서대로
                const orderedSet = new Set<string>();
                for (const groupName of groupOrder.value) {
                    if (allGroups.includes(groupName)) {
                        orderedSet.add(groupName);
                        orderedGroups.push(groupName);
                    }
                }
                // 나머지 그룹들 추가 (option에서 등장하는 순서대로)
                for (const groupName of groupOrderInOptions) {
                    if (!orderedSet.has(groupName)) {
                        orderedGroups.push(groupName);
                    }
                }
            }

            const result: VsOptionsGroup[] = [];
            for (const groupName of orderedGroups) {
                const groupOptions = groupMap.get(groupName);
                if (groupOptions && groupOptions.length > 0) {
                    result.push({ name: groupName, options: groupOptions });
                }
            }

            // ungrouped는 제일 밑으로
            const ungroupedOptions = groupMap.get('') || [];
            if (ungroupedOptions.length > 0) {
                result.push({ name: '', options: ungroupedOptions });
            }

            return result;
        });

        function emitClickOption(
            option: VsOptionsItem,
            graoupedIndex: number,
            group: VsOptionsGroup,
            groupIndex: number,
        ) {
            emit('click-option', { ...option, graoupedIndex, group, groupIndex });
        }

        function scrollToOption(option: any) {
            if (!visibleRenderRef.value) {
                return;
            }

            const targetOption = computedOptions.value.find((o) => objectUtil.isEqual(o.item, option));
            if (!targetOption) {
                return;
            }

            const targetElement: HTMLElement | null =
                visibleRenderRef.value?.$el.querySelector(`#${targetOption.id}`) || null;
            if (!targetElement) {
                return;
            }

            visibleRenderRef.value.scrollToElement(targetElement);
        }

        return {
            visibleRenderRef,
            styleSetVariables,
            componentStyleSet,
            groupedOptions,
            emitClickOption,
            scrollToOption,
        };
    },
});
</script>

<style src="./VsOptions.css" />
