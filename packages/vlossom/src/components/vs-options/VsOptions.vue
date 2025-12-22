<template>
    <Teleport :to="optionsOverlayId" v-if="isVisible">
        <div ref="optionsRef" :id :class="['vs-options', colorSchemeClass]" :style="styleSetVariables">
            <vs-inner-scroll>
                <template #header v-if="$slots.header">
                    <slot name="header" />
                </template>

                <vs-visible-render class="vs-options-list" ref="visibleRenderRef" root-margin="10px" tabindex="-1">
                    <template v-for="(group, groupIndex) in groupedOptions" :key="`group-${groupIndex}`">
                        <div v-if="!!groupBy">
                            <slot name="group" :group :groupIndex>
                                <div v-if="group.name !== ''" class="vs-options-group-name">
                                    {{ group.name }}
                                </div>
                                <vs-divider
                                    :color-scheme="computedColorScheme"
                                    :style-set="{ horizontal: { margin: '0.2rem 0' } }"
                                />
                            </slot>
                        </div>
                        <div
                            v-for="(option, index) in group.options"
                            :key="`${id}-${option.id}-${index}`"
                            :id="option.id"
                            :class="{ 'vs-disabled': option.disabled }"
                            :data-focusable="option.disabled ? undefined : 'option'"
                            @mouseenter="onMouseEnter"
                            @click.prevent.stop="handleOptionClick(option.id)"
                        >
                            <slot name="option" :option :index>
                                <div class="vs-options-option">
                                    <span>{{ option }}</span>
                                </div>
                            </slot>
                        </div>
                    </template>
                </vs-visible-render>

                <template #footer v-if="$slots.footer">
                    <slot name="footer" />
                </template>
            </vs-inner-scroll>
        </div>
    </Teleport>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    useTemplateRef,
    watch,
    ref,
    onMounted,
    onUnmounted,
    nextTick,
    type Ref,
    type ComputedRef,
    type TemplateRef,
    type PropType,
} from 'vue';
import { getColorSchemeProps, getGroupByProps, getOptionsProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet, useOverlayCallback, useOverlayDom, usePositioning } from '@/composables';
import { VsComponent, type Alignment, type OverlayCallbacks, type Placement } from '@/declaration';
import { stringUtil } from '@/utils';
import type { VsOptionsGroup, VsOptionsStyleSet } from './types';

import type { VsVisibleRenderRef } from '@/components/vs-visible-render/types';
import VsVisibleRender from '@/components/vs-visible-render/VsVisibleRender.vue';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';
import VsDivider from '@/components/vs-divider/VsDivider.vue';

const name = VsComponent.VsOptions;
export default defineComponent({
    name,
    components: { VsInnerScroll, VsDivider, VsVisibleRender },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsOptionsStyleSet>(),
        ...getOptionsProps(),
        ...getGroupByProps(),
        align: {
            type: String as PropType<Alignment>,
            default: 'start',
        },
        callbacks: { type: Object as PropType<OverlayCallbacks>, default: () => ({}) },
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number) => boolean)>,
            default: false,
        },
        id: { type: String, default: '' },
        target: { type: String, required: true, default: '' },
        placement: {
            type: String as PropType<Exclude<Placement, 'middle'>>,
            default: 'bottom',
        },

        // v-model
        modelValue: {
            type: Boolean,
            default: false,
        },
        focusIndex: {
            type: Number,
            default: -1,
        },
    },
    emits: ['option-click', 'key', 'update:modelValue', 'update:focusIndex'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            id,
            target,
            options,
            callbacks,
            groupBy,
            groupOrder,
            align,
            placement,
            modelValue,
            focusIndex,
        } = toRefs(props);

        const optionsRef: TemplateRef<HTMLElement> = useTemplateRef('optionsRef');
        const visibleRenderRef: TemplateRef<VsVisibleRenderRef> = useTemplateRef('visibleRenderRef');
        const currentFocusableElement: Ref<HTMLElement | null> = ref(null);

        const { colorSchemeClass, computedColorScheme } = useColorScheme(name, colorScheme);
        const { styleSetVariables, componentStyleSet } = useStyleSet<VsOptionsStyleSet>(name, styleSet);

        // VsOptions 전용 overlay id (VsSelect와 구분)
        const optionsId = id.value || stringUtil.createID();
        const optionsOverlayId = computed(() => `#vs-${optionsId}-overlay`);

        const { appendOverlayDom } = useOverlayDom();
        const { isVisible, appear, disappear } = usePositioning(target.value, optionsRef);
        appendOverlayDom(document.body, optionsOverlayId.value);
        const focusableElements: Ref<HTMLElement[]> = ref([]);

        function updateFocusableElements() {
            focusableElements.value = Array.from(
                optionsRef.value?.querySelectorAll<HTMLElement>('[data-focusable]') || [],
            );
        }

        function getFocusIndex(el: HTMLElement) {
            return focusableElements.value.indexOf(el);
        }

        // focusIndex를 v-model로 관리
        const innerFocusIndex = ref(focusIndex.value);
        watch(focusIndex, (newValue) => {
            innerFocusIndex.value = newValue;
        });
        watch(innerFocusIndex, (newValue) => {
            emit('update:focusIndex', newValue);
        });

        const computedCallbacks: ComputedRef<OverlayCallbacks> = computed(() => {
            return {
                ['key-Enter']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const currentElement = focusableElements.value[innerFocusIndex.value];
                    if (!currentElement) {
                        return;
                    }

                    const focusableValue = currentElement.getAttribute('data-focusable');

                    if (focusableValue === 'option') {
                        const optionId = currentElement.id;
                        if (optionId) {
                            emit('key', event);
                        }
                        return;
                    }
                },
                ['key-Space']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const currentElement = focusableElements.value[innerFocusIndex.value];
                    if (!currentElement) {
                        return;
                    }

                    const focusableValue = currentElement.getAttribute('data-focusable');

                    if (focusableValue === 'option') {
                        const optionId = currentElement.id;
                        if (optionId) {
                            emit('key', event);
                        }
                        return;
                    }
                },
                ['key-ArrowUp']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (innerFocusIndex.value > 0) {
                        innerFocusIndex.value = innerFocusIndex.value - 1;
                    }
                },
                ['key-ArrowDown']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const lastIndex = focusableElements.value.length - 1;
                    if (innerFocusIndex.value < lastIndex) {
                        innerFocusIndex.value = innerFocusIndex.value + 1;
                    }
                },
                ['key-Home']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    innerFocusIndex.value = 0;
                },
                ['key-End']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const lastIndex = focusableElements.value.length - 1;
                    innerFocusIndex.value = lastIndex;
                },
                ['key-Escape']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();
                    emit('key', { key: 'Escape', type: 'close', event });
                },
                ['key-Tab']: () => {
                    emit('key', { key: 'Tab', type: 'close' });
                },

                ...callbacks.value,
            };
        });
        const { mountOverlay, unmountOverlay } = useOverlayCallback(optionsOverlayId, computedCallbacks);

        watch(modelValue, () => {
            if (modelValue.value) {
                appear({ align: align.value, placement: placement.value, followWidth: true });
                mountOverlay();
            } else {
                disappear();
                unmountOverlay();
            }
        });

        const groupedOptions: ComputedRef<VsOptionsGroup[]> = computed(() => {
            // groupBy가 없으면 모든 옵션을 하나의 그룹으로 반환
            if (!groupBy.value) {
                return [
                    {
                        name: '',
                        options: options.value,
                    },
                ];
            }

            // 그룹별로 옵션 분류 및 등장 순서 기록
            const groupMap = new Map<string, any[]>();
            // option에서 등장하는 그룹 순서
            const groupOrderInOptions: string[] = [];
            const seenGroups = new Set<string>();

            for (const option of options.value) {
                const originalIndex = options.value.findIndex((o) => o === option);
                const groupName: string = groupBy.value(option.option, originalIndex) || '';
                if (!groupMap.has(groupName)) {
                    groupMap.set(groupName, []);
                }
                groupMap.get(groupName)?.push(option);

                // 처음 등장하는 그룹이면 순서에 추가 (빈 스트링 제외)
                if (groupName !== '' && !seenGroups.has(groupName)) {
                    seenGroups.add(groupName);
                    groupOrderInOptions.push(groupName);
                }
            }

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

        watch(groupedOptions, updateFocusableElements, { flush: 'post' });

        function onMouseEnter(event: MouseEvent) {
            const el: HTMLElement | null = event.target as HTMLElement;
            if (!el) {
                return;
            }
            const index = getFocusIndex(el);
            if (index >= 0) {
                innerFocusIndex.value = index;
            }
        }

        function handleOptionClick(optionId: string) {
            emit('option-click', optionId);
        }

        watch(innerFocusIndex, (newIndex, oldIndex) => {
            if (oldIndex >= 0) {
                const oldfocusableElement = focusableElements.value[oldIndex];
                if (oldfocusableElement) {
                    oldfocusableElement.classList.remove('vs-options-option-focused');
                    const oldfocusableValue = oldfocusableElement.getAttribute('data-focusable');
                    if (oldfocusableValue === 'search-input') {
                        emit('key', { key: 'Focus', type: 'search-input-blur' });
                    }
                }
            }

            if (newIndex >= 0) {
                const newfocusableElement = focusableElements.value[newIndex];
                if (newfocusableElement) {
                    newfocusableElement.classList.add('vs-options-option-focused');
                    currentFocusableElement.value = newfocusableElement;
                    newfocusableElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                    const newfocusableValue = newfocusableElement.getAttribute('data-focusable');
                    if (newfocusableValue === 'search-input') {
                        emit('key', { key: 'Focus', type: 'search-input-focus' });
                    }
                }
            }
        });

        onMounted(async () => {
            mountOverlay();
            await nextTick();
            updateFocusableElements();
        });

        onUnmounted(unmountOverlay);

        return {
            isVisible,
            optionsOverlayId,
            optionsRef,
            visibleRenderRef,
            colorSchemeClass,
            computedColorScheme,
            styleSetVariables,
            componentStyleSet,
            groupedOptions,
            onMouseEnter,
            handleOptionClick,
        };
    },
});
</script>

<style src="./VsOptions.css" />
