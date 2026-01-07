<template>
    <vs-input-wrapper
        v-show="!hidden"
        :width
        :grid
        :disabled="computedDisabled"
        :hidden
        :id="computedId"
        :label
        :no-label
        :no-messages
        :required
        :small
        :messages="computedMessages"
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div :class="['vs-select', colorSchemeClass, triggerClassObj]" :style="styleSetVariables">
            <vs-select-trigger
                ref="triggerRef"
                :id="triggerId"
                :is-empty
                :is-open
                :placeholder
                :multiple
                :collapse-chips
                :closable-chips
                :selected-options
                :state="computedState"
                :no-clear
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                @click="toggleOpen"
                @deselect="deselectOption"
                @clear="clear"
            />
            <vs-floating :target="`#${triggerId}`" v-model="isOpen" placement="bottom" align="start" follow-width>
                <vs-grouped-list
                    ref="optionsListRef"
                    :id="optionsId"
                    :class="['vs-select-options', colorSchemeClass]"
                    :style-set="componentStyleSet.options"
                    :items="filteredOptions"
                    :group-by
                    :group-order
                    @click-item="onClickOption"
                >
                    <template #header v-if="isUsingSearch || $slots['options-header']">
                        <div class="vs-select-search" data-focusable>
                            <vs-search-input
                                v-if="isUsingSearch"
                                ref="searchInputRef"
                                v-model="searchText"
                                v-bind="searchProps"
                            />
                        </div>
                        <div
                            v-if="multiple && selectAll"
                            class="vs-select-all"
                            @click.prevent.stop="toggleSelectAll"
                            data-focusable
                        >
                            <vs-checkbox
                                :model-value="isSelectedAll"
                                :color-scheme="computedColorScheme"
                                :style-set="componentStyleSet.selectAllCheckbox"
                                check-label="Select All"
                                readonly
                                no-label
                                no-messages
                            />
                        </div>
                        <slot name="options-header" v-if="$slots['options-header']" />
                    </template>
                    <template #group="groupSlotProps" v-if="$slots.group">
                        <slot name="group" v-bind="groupSlotProps" />
                    </template>
                    <template #item="itemSlotProps">
                        <div
                            class="vs-select-option"
                            :class="{ selected: isSelected(itemSlotProps.id) }"
                            data-focusable
                        >
                            <slot name="option" v-bind="itemSlotProps">
                                {{ itemSlotProps.label }}
                            </slot>
                        </div>
                    </template>
                    <template #footer v-if="$slots['options-footer']">
                        <slot name="options-footer" />
                    </template>
                </vs-grouped-list>
            </vs-floating>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    nextTick,
    ref,
    toRefs,
    useTemplateRef,
    watch,
    type ComputedRef,
    type PropType,
    type Ref,
    type TemplateRef,
} from 'vue';
import { VsComponent, type OptionItem } from '@/declaration';
import {
    getColorSchemeProps,
    getStyleSetProps,
    getOptionsProps,
    getGroupByProps,
    getInputProps,
    getResponsiveProps,
    getMinMaxProps,
} from '@/props';
import { useColorScheme, useStyleSet, useInput, useInputOption, useOptionList } from '@/composables';
import { objectUtil } from '@/utils';
import type { VsSelectSearchPropType, VsSelectStyleSet, VsSelectTriggerRef } from './types';
import { useSelectRules } from './vs-select-rules';
import { useSelectValue } from './composables/select-value-composable';
import { useSelectSearch } from './composables/select-search-composable';

import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import type { VsGroupedListRef } from '@/components/vs-grouped-list/types';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';
import VsFloating from '@/components/vs-floating/VsFloating.vue';
import VsGroupedList from '@/components/vs-grouped-list/VsGroupedList.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';
import VsSelectTrigger from './VsSelectTrigger.vue';

const componentName = VsComponent.VsSelect;
export default defineComponent({
    name: componentName,
    components: { VsFloating, VsInputWrapper, VsSearchInput, VsCheckbox, VsGroupedList, VsSelectTrigger },
    props: {
        ...getInputProps<any>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSelectStyleSet>(),
        ...getOptionsProps(),
        ...getGroupByProps(),
        ...getMinMaxProps(componentName),
        closableChips: { type: Boolean, default: false },
        collapseChips: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        noClear: { type: Boolean, default: false },
        optionsDisabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number, options: any[]) => boolean)>,
            default: false,
        },
        search: {
            type: [Boolean, Object] as PropType<VsSelectSearchPropType>,
            default: false,
        },
        selectAll: { type: Boolean, default: false },

        // v-model
        modelValue: { type: null, default: null },
    },
    emits: [
        'update:modelValue',
        'update:changed',
        'update:valid',
        'change',
        'focus',
        'blur',
        'click-option',
        'open',
        'close',
        'clear',
    ],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            options,
            optionLabel,
            optionValue,
            optionsDisabled,
            modelValue,
            id,
            readonly,
            messages,
            rules,
            noDefaultRules,
            state,
            required,
            small,
            disabled,
            search,
            multiple,
            min,
            max,
        } = toRefs(props);

        const isOpen = ref(false);
        const searchText = ref('');
        const inputValue: Ref<any> = ref(modelValue.value);

        const triggerRef: TemplateRef<VsSelectTriggerRef> = useTemplateRef('triggerRef');
        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');
        const optionsListRef: TemplateRef<VsGroupedListRef> = useTemplateRef('optionsListRef');

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSelectStyleSet>(componentName, styleSet);

        const { computedOptions } = useOptionList(options, optionLabel, optionValue, optionsDisabled);

        const filteredOptions: ComputedRef<OptionItem[]> = computed(() => {
            if (!searchInputRef.value) {
                return computedOptions.value;
            }
            return computedOptions.value.filter((option) => {
                return searchInputRef.value?.match(option.label);
            });
        });

        const { isUsingSearch, searchProps } = useSelectSearch(search);

        function onClear() {
            clearSelected();
            searchText.value = '';
            emit('clear');
        }

        const { requiredCheck, maxCheck, minCheck } = useSelectRules(required, multiple, min, max);

        useInputOption(inputValue, options, optionLabel, optionValue, multiple);

        const {
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            shake,
            validate,
            clear,
        } = useInput(
            { emit },
            {
                inputValue,
                modelValue,
                id,
                disabled,
                readonly,
                messages,
                rules,
                defaultRules: computed(() => {
                    const defaultRules = [requiredCheck];
                    if (multiple.value) {
                        defaultRules.push(minCheck, maxCheck);
                    }
                    return defaultRules;
                }),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = convertValue(inputValue.value);
                    },
                    onChange: () => {
                        inputValue.value = convertValue(inputValue.value);
                    },
                    onClear,
                },
            },
        );

        const {
            selectedOptionIds,
            isSelectedAll,
            isEmpty,
            selectedOptions,
            convertValue,
            deselectOption,
            toggleSelect,
            clearSelected,
            toggleSelectAll,
            isSelected,
        } = useSelectValue({
            computedReadonly,
            computedDisabled,
            computedOptions,
            filteredOptions,
            multiple,
        });

        const triggerId = computed(() => `${computedId.value}-trigger`);
        const optionsId = computed(() => `${computedId.value}-options`);

        const triggerClassObj = computed(() => ({
            'vs-small': small.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
            'vs-focus-within': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        function toggleOpen() {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            if (isOpen.value) {
                closeOptions();
            } else {
                openOptions();
            }
        }

        function onClickOption(optionItem: OptionItem) {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            toggleSelect(optionItem.id);

            if (!multiple.value) {
                closeOptions();
            }

            emit('click-option', optionItem);
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function focus() {
            triggerRef.value?.focus();
        }

        function blur() {
            triggerRef.value?.blur();
        }

        function openOptions() {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            isOpen.value = true;
            emit('open');

            // setTimeout + nextTick을 사용해야 DOM이 완전히 렌더링된 후 스크롤 가능
            setTimeout(() => {
                nextTick(() => {
                    const selectedId = selectedOptionIds.value[0];
                    if (selectedId) {
                        optionsListRef.value?.scrollToItem(selectedId);
                    }
                });
            }, 50);
        }

        function closeOptions() {
            isOpen.value = false;
            emit('close');

            setTimeout(() => {
                searchText.value = '';
            }, 250); // wait for the animation
        }

        function onOutsideClick(e: MouseEvent) {
            const target = e.target as HTMLElement;

            // check if click outside of select
            if (
                isOpen.value &&
                target.closest(`#${triggerId.value}`) === null &&
                target.closest(`#${optionsId.value}`) === null
            ) {
                closeOptions();
            }
        }

        watch(
            selectedOptionIds,
            () => {
                if (multiple.value) {
                    inputValue.value = selectedOptionIds.value
                        .map((optionId) => {
                            const option = computedOptions.value.find((o) => o.id === optionId);
                            return option ? option.value : null;
                        })
                        .filter((v) => v !== null);
                } else {
                    const selectedOptionId = selectedOptionIds.value[0];
                    const selectedOption = computedOptions.value.find((o) => o.id === selectedOptionId);
                    inputValue.value = selectedOption ? selectedOption.value : null;
                }
            },
            { deep: true },
        );

        watch(
            inputValue,
            (newInputValue, oldInputValue) => {
                if (objectUtil.isEqual(newInputValue, oldInputValue)) {
                    return;
                }

                if (newInputValue === undefined || newInputValue === null) {
                    selectedOptionIds.value = [];
                    return;
                }

                const isArrayMultiple = multiple.value && Array.isArray(inputValue.value);
                const inputValueArray = isArrayMultiple ? inputValue.value : [inputValue.value];

                selectedOptionIds.value = inputValueArray
                    .map((v: any) => {
                        for (const option of computedOptions.value) {
                            if (objectUtil.isEqual(option.value, v)) {
                                return option.id;
                            }
                        }
                        return null;
                    })
                    .filter((v: any) => v !== null);
            },
            { immediate: true },
        );

        watch([computedDisabled, computedReadonly], () => {
            closeOptions();
        });

        watch(isOpen, () => {
            if (isOpen.value) {
                document.addEventListener('click', onOutsideClick, true);
            } else {
                document.removeEventListener('click', onOutsideClick, true);
            }
        });

        return {
            triggerRef,
            searchInputRef,
            optionsListRef,
            triggerId,
            optionsId,
            isOpen,
            inputValue,
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
            triggerClassObj,
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            filteredOptions,
            shake,
            openOptions,
            closeOptions,
            isSelected,
            toggleSelectAll,
            searchText,
            isUsingSearch,
            searchProps,
            toggleOpen,
            onClickOption,
            isSelectedAll,
            computedColorScheme,
            onFocus,
            onBlur,
            focus,
            blur,
            validate,
            clear,
            isEmpty,
            selectedOptions,
            deselectOption,
        };
    },
});
</script>

<style src="./VsSelect.css" />
