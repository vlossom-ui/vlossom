<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.wrapper"
        :width
        :grid
        :disabled="computedDisabled"
        :hidden
        :id="computedId"
        :label
        :no-label
        :no-messages
        :required
        :messages="computedMessages"
        :shake
    >
        <template #label v-if="!noLabel && (!!label || !!$slots.label)">
            <slot name="label" />
        </template>

        <div :class="['vs-select', colorSchemeClass, classObj]" :style="styleSetVariables">
            <vs-select-trigger
                ref="triggerRef"
                :id="triggerId"
                :style-set="componentStyleSet"
                :color-scheme="computedColorScheme"
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
                @focus="onFocus"
                @blur="onBlur"
            />
            <vs-floating :target="`#${triggerId}`" v-model="isOpen" placement="bottom" align="start" follow-width>
                <vs-grouped-list
                    ref="optionsListRef"
                    :id="optionsId"
                    :class="['vs-select-options', colorSchemeClass]"
                    :style="styleSetVariables"
                    :style-set="componentStyleSet.options"
                    :items="filteredOptions"
                    :group-by
                    :group-order
                    @click-item="selectOptionItem"
                >
                    <template #header v-if="isUsingSearch || $slots['options-header']">
                        <div class="vs-select-search vs-select-focusable" data-focusable data-role="search">
                            <vs-search-input v-if="isUsingSearch" ref="searchInputRef" v-bind="searchProps" />
                        </div>
                        <div
                            v-if="multiple && selectAll"
                            class="vs-select-all vs-select-focusable"
                            data-focusable
                            data-role="select-all"
                            @click.prevent.stop="toggleSelectAll"
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
                            :class="[
                                'vs-select-option-wrap',
                                'vs-select-focusable',
                                { selected: isSelected(itemSlotProps.id) },
                            ]"
                            :style="componentStyleSet.option"
                            :data-id="itemSlotProps.id"
                            :data-focusable="itemSlotProps.disabled ? undefined : true"
                        >
                            <slot name="option" v-bind="{ ...itemSlotProps, selected: isSelected(itemSlotProps.id) }">
                                <div class="vs-select-option" :style="getOptionStyleSet(itemSlotProps.id)">
                                    {{ itemSlotProps.label }}
                                </div>
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
    type CSSProperties,
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
    getSearchProps,
} from '@/props';
import {
    useColorScheme,
    useStyleSet,
    useInput,
    useInputOption,
    useOptionList,
    useFocusable,
    useOverlayCallback,
    useClickOutside,
} from '@/composables';
import { objectUtil } from '@/utils';
import type { VsSelectStyleSet, VsSelectTriggerRef } from './types';
import { useSelectRules } from './vs-select-rules';
import { useSelectValue } from './composables/select-value-composable';
import { useSelectSearch } from './composables/select-search-composable';
import { useSelectKeyboard } from './composables/select-keyboard-composable';

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
        ...getSearchProps(),
        closableChips: { type: Boolean, default: false },
        collapseChips: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        noClear: { type: Boolean, default: false },
        optionsDisabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number, options: any[]) => boolean)>,
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
            disabled,
            search,
            multiple,
            min,
            max,
        } = toRefs(props);

        const isOpen = ref(false);
        const isFocused = ref(false);
        const inputValue: Ref<any> = ref(modelValue.value);

        const triggerRef: TemplateRef<VsSelectTriggerRef> = useTemplateRef('triggerRef');
        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');
        const optionsListRef: TemplateRef<VsGroupedListRef> = useTemplateRef('optionsListRef');

        const isUsingSelect = computed(() => isFocused.value || isOpen.value);

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsSelectStyleSet> = computed(() => {
            return {
                options: {
                    variables: {
                        height: '30rem',
                    },
                    layout: {
                        content: {
                            padding: '0.6rem 0.4rem',
                        },
                    },
                },
            };
        });
        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSelectStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

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
            searchInputRef.value?.clear();
            emit('clear');
        }

        const optionsListElement = computed(() => optionsListRef.value?.$el as HTMLElement);

        const {
            focusIndex,
            updateFocusIndex,
            currentFocusableElement,
            getFocusableElements,
            addMouseMoveListener,
            removeMouseMoveListener,
        } = useFocusable(optionsListElement);

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

        const isSelectUnavailable = computed(() => {
            return computedDisabled.value || computedReadonly.value;
        });

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
            isSelectUnavailable,
            computedOptions,
            filteredOptions,
            multiple,
        });

        const { computedCallbacks } = useSelectKeyboard({
            isOpen,
            focusIndex,
            currentFocusableElement,
            searchInputRef,
            filteredOptions,
            updateFocusIndex,
            getFocusableElements,
            openOptions,
            closeOptions,
            focusTrigger: focus,
            toggleSelectAll,
            selectOptionItem,
        });

        const { activate: activateOverlayCallback, deactivate: deactivateOverlayCallback } = useOverlayCallback(
            computedId,
            computedCallbacks,
        );

        const triggerId = computed(() => `${computedId.value}-trigger`);
        const optionsId = computed(() => `${computedId.value}-options`);
        const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(
            [`#${triggerId.value}`, `#${optionsId.value}`],
            closeOptions,
        );

        const classObj = computed(() => ({
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        function toggleOpen() {
            if (isSelectUnavailable.value) {
                return;
            }

            if (isOpen.value) {
                closeOptions();
            } else {
                openOptions();
            }
        }

        function selectOptionItem(optionItem: OptionItem) {
            if (isSelectUnavailable.value) {
                return;
            }

            toggleSelect(optionItem.id);

            if (!multiple.value) {
                closeOptions();
            }

            emit('click-option', optionItem);
        }

        function onFocus(e: FocusEvent) {
            isFocused.value = true;
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            isFocused.value = false;
            emit('blur', e);
        }

        function focus() {
            triggerRef.value?.focus();
        }

        function blur() {
            triggerRef.value?.blur();
        }

        function openOptions() {
            if (isSelectUnavailable.value || isOpen.value) {
                return;
            }

            isOpen.value = true;
            emit('open');

            // setTimeout + nextTick을 사용해야 DOM이 완전히 렌더링된 후 스크롤 가능
            setTimeout(() => {
                nextTick(() => {
                    addMouseMoveListener();

                    const selectedId = selectedOptionIds.value[0];
                    if (selectedId && optionsListRef.value?.hasScroll()) {
                        optionsListRef.value?.scrollToItem(selectedId);
                    }

                    if (isUsingSearch.value) {
                        searchInputRef.value?.focus();
                        updateFocusIndex(0);
                    } else if (selectedId) {
                        const targetFocusIndex = getFocusableElements().findIndex(
                            (element) => element.dataset['id'] === selectedId,
                        );
                        updateFocusIndex(targetFocusIndex);
                    }
                });
            }, 50);
        }

        function getOptionStyleSet(optionId: string): CSSProperties {
            return {
                ...componentStyleSet.value.option,
                ...(isSelected(optionId) ? componentStyleSet.value.selectedOption : {}),
            };
        }

        function closeOptions() {
            if (!isOpen.value) {
                return;
            }

            removeMouseMoveListener();
            isOpen.value = false;
            emit('close');

            setTimeout(() => {
                searchInputRef.value?.clear();
            }, 250); // wait for the animation
        }

        watch(isUsingSelect, () => {
            if (isUsingSelect.value) {
                activateOverlayCallback();
            } else {
                deactivateOverlayCallback();
            }
        });

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
                addClickOutsideListener();
            } else {
                removeClickOutsideListener();
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
            classObj,
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
            isUsingSearch,
            searchProps,
            toggleOpen,
            selectOptionItem,
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
            getOptionStyleSet,
        };
    },
});
</script>

<style src="./VsSelect.css" />
