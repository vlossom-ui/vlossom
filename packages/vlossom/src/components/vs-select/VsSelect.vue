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

        <div :class="['vs-select', colorSchemeClass, triggerClassObj, stateClasses]" :style="styleSetVariables">
            <div ref="triggerRef" :id="triggerId" class="vs-select-trigger" @click="toggleOpen">
                <div class="vs-select-value" style="flex: 1">
                    <template v-if="isEmpty">
                        <span class="vs-select-placeholder">{{ placeholder }}</span>
                    </template>
                    <template v-else-if="multiple">
                        <template v-if="collapseChips && selectedOptions.length > 1">
                            <vs-chip small :closable="closableChips" @close="deselectOption(selectedOptions[0].id)">
                                {{ selectedOptions[0].label }}
                            </vs-chip>
                            <span class="vs-select-collapsed-count">+{{ selectedOptions.length - 1 }}</span>
                        </template>
                        <template v-else>
                            <vs-chip
                                v-for="chip in selectedOptions"
                                :key="chip.id"
                                small
                                :closable="closableChips"
                                @close="deselectOption(chip.id)"
                            >
                                {{ chip.label }}
                            </vs-chip>
                        </template>
                    </template>
                    <template v-else>
                        {{ displayLabel }}
                    </template>
                </div>
                <div :class="['vs-select-icon', { 'vs-select-icon-open': isOpen }]">
                    <vs-render :content="selectIcons.arrowDown" />
                </div>
            </div>
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
                        <div class="vs-select-search">
                            <vs-search-input
                                v-if="isUsingSearch"
                                ref="searchInputRef"
                                v-model="searchText"
                                v-bind="searchProps"
                            />
                        </div>
                        <div v-if="multiple && selectAll" class="vs-select-all" @click.prevent.stop="toggleSelectAll">
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
                        <slot name="option" v-bind="itemSlotProps">
                            <div class="vs-select-option">
                                {{ itemSlotProps.label }}
                            </div>
                        </slot>
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
    toRefs,
    useTemplateRef,
    ref,
    type PropType,
    type Ref,
    type TemplateRef,
    type ComputedRef,
    watch,
    nextTick,
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
import { useColorScheme, useStyleSet, useInput, useStateClass, useInputOption, useOptionList } from '@/composables';
import { objectUtil } from '@/utils';
import type { VsSelectStyleSet } from './types';
import { selectIcons } from './icons';
import { useSelectRules } from './vs-select-rules';
import { useSelectValue } from './composables/select-value-composable';
import { useSelectSearch } from './composables/select-search-composable';

import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import type { VsGroupedListRef } from '@/components/vs-grouped-list/types';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';
import VsChip from '@/components/vs-chip/VsChip.vue';
import VsFloating from '@/components/vs-floating/VsFloating.vue';
import VsGroupedList from '@/components/vs-grouped-list/VsGroupedList.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';

const componentName = VsComponent.VsSelect;
export default defineComponent({
    name: componentName,
    components: { VsFloating, VsInputWrapper, VsSearchInput, VsCheckbox, VsChip, VsGroupedList, VsRender },
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
        optionsDisabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number, options: any[]) => boolean)>,
            default: false,
        },
        search: {
            type: [Boolean, Object] as PropType<
                boolean | { useRegex?: boolean; useCaseSensitive?: boolean; placeholder?: string }
            >,
            default: false,
        },
        selectAll: { type: Boolean, default: false },

        // v-model
        modelValue: {
            type: null as any,
            default: null,
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur', 'click-option'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            options,
            optionLabel,
            optionValue,
            optionsDisabled,
            groupBy,
            groupOrder,
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
            placeholder,
        } = toRefs(props);

        const isOpen = ref(false);
        const searchText = ref('');
        const inputValue: Ref<any> = ref(modelValue.value);

        const triggerRef: TemplateRef<HTMLElement> = useTemplateRef('triggerRef');
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
            closeOptions();
            searchText.value = '';
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
            availableOptionIds,
            isSelectedAll,
            isEmpty,
            selectedOptions,
            convertValue,
            deselectOption,
            toggleSelect,
            clearSelected,
            toggleSelectAll,
        } = useSelectValue({
            computedReadonly,
            computedDisabled,
            computedOptions,
            filteredOptions,
            multiple,
        });

        const { stateClasses } = useStateClass(computedState);

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

        const displayLabel = computed(() => {
            if (isEmpty.value || !inputValue.value) {
                return '';
            }

            return selectedOptions.value[0]?.label ?? '';
        });

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
        }

        function closeOptions() {
            isOpen.value = false;
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

        watch(isOpen, () => {
            if (isOpen.value) {
                nextTick(() => {
                    document.addEventListener('click', onOutsideClick, true);
                });
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
            stateClasses,
            computedId,
            computedMessages,
            computedDisabled,
            computedReadonly,
            filteredOptions,
            shake,
            options,
            optionLabel,
            optionValue,
            openOptions,
            closeOptions,
            toggleSelectAll,
            groupBy,
            groupOrder,
            searchText,
            isUsingSearch,
            searchProps,
            toggleOpen,
            onClickOption,
            isSelectedAll,
            computedColorScheme,
            availableOptionIds,
            selectedOptionIds,
            onFocus,
            onBlur,
            focus,
            blur,
            validate,
            clear,
            selectIcons,
            isEmpty,
            displayLabel,
            selectedOptions,
            placeholder,
            deselectOption,
            computedOptions,
        };
    },
});
</script>

<style src="./VsSelect.css" />
