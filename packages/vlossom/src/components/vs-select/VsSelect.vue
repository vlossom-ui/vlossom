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
                <template v-if="isEmpty">
                    <span class="vs-select-placeholder">{{ placeholder }}</span>
                </template>
                <template v-else-if="multiple">
                    <template v-if="collapseChips && displayChips.length > 1">
                        <vs-chip
                            v-for="chip in displayChips.slice(0, 1)"
                            :key="chip.value"
                            small
                            :closable="closableChips"
                            @close="removeValue(chip.value)"
                        >
                            {{ chip.label }}
                        </vs-chip>
                        <span class="vs-select-collapsed-count">+{{ displayChips.length - 1 }}</span>
                    </template>
                    <template v-else>
                        <vs-chip
                            v-for="chip in displayChips"
                            :key="chip.value"
                            small
                            :closable="closableChips"
                            @close="removeValue(chip.value)"
                        >
                            {{ chip.label }}
                        </vs-chip>
                    </template>
                </template>
                <template v-else>
                    {{ displayLabel }}
                </template>
            </div>
            <vs-floating :target="`#${triggerId}`" v-model="isOpen" placement="bottom" align="start" follow-width>
                <vs-grouped-list
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
import { useVsSelectRules } from './vs-select-rules';

import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';
import VsChip from '@/components/vs-chip/VsChip.vue';
import VsFloating from '@/components/vs-floating/VsFloating.vue';
import VsGroupedList from '@/components/vs-grouped-list/VsGroupedList.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';

const componentName = VsComponent.VsSelect;
export default defineComponent({
    name: componentName,
    components: { VsFloating, VsInputWrapper, VsSearchInput, VsCheckbox, VsChip, VsGroupedList },
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

        const inputValue: Ref<any> = ref(modelValue.value);
        const isOpen = ref(false);
        const searchText = ref('');

        const triggerRef: TemplateRef<HTMLElement> = useTemplateRef('triggerRef');
        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSelectStyleSet>(componentName, styleSet);

        const { computedOptions } = useOptionList(options, optionLabel, optionValue, optionsDisabled);

        const filteredOptions: ComputedRef<OptionItem[]> = computed(() => {
            if (!searchInputRef.value) {
                return computedOptions.value;
            }
            return computedOptions.value.filter((option) => {
                return searchInputRef.value?.match(JSON.stringify(option.value));
            });
        });

        const isUsingSearch = computed(() => {
            if (typeof search.value === 'boolean') {
                return search.value;
            }

            return (
                search.value.useRegex !== undefined ||
                search.value.useCaseSensitive !== undefined ||
                search.value.placeholder !== undefined
            );
        });

        const searchProps = computed(() => {
            if (typeof search.value === 'boolean') {
                return {
                    useRegex: true,
                    useCaseSensitive: true,
                    placeholder: '',
                };
            }
            return {
                useRegex: search.value.useRegex ?? true,
                useCaseSensitive: search.value.useCaseSensitive ?? true,
                placeholder: search.value.placeholder ?? '',
            };
        });

        const isSelectedAll = computed(() => {
            return inputValue.value.length === options.value.length;
        });

        function optionsFilter({ value }: OptionItem) {
            return searchInputRef.value?.match(JSON.stringify(value)) ?? false;
        }

        const isEmpty = computed(() => {
            if (multiple.value) {
                return !Array.isArray(inputValue.value) || inputValue.value.length === 0;
            }
            return inputValue.value === null || inputValue.value === undefined || inputValue.value === '';
        });

        const displayLabel = computed(() => {
            if (isEmpty.value || !inputValue.value) {
                return '';
            }
            const option = computedOptions.value.find((opt) => objectUtil.isEqual(opt.value, inputValue.value));
            return option?.label ?? '';
        });

        const displayChips = computed(() => {
            if (!multiple.value || !Array.isArray(inputValue.value) || inputValue.value.length === 0) {
                return [];
            }
            return inputValue.value
                .map((value) => {
                    const option = computedOptions.value.find((opt) => objectUtil.isEqual(opt.value, value));
                    return option ? { value: option.value, label: option.label } : null;
                })
                .filter((chip): chip is { value: any; label: string } => chip !== null);
        });

        function removeValue(valueToRemove: any) {
            if (!multiple.value || !Array.isArray(inputValue.value)) {
                return;
            }
            inputValue.value = inputValue.value.filter((v: any) => !objectUtil.isEqual(v, valueToRemove));
        }

        const { requiredCheck, maxCheck, minCheck } = useVsSelectRules(required, multiple, min, max);

        useInputOption(inputValue, options, optionLabel, optionValue, multiple);

        function normalizeEmptyValue(value: any): any {
            if (value === null || value === undefined || value === '') {
                return multiple.value ? [] : null;
            }
            return value;
        }

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
                        inputValue.value = normalizeEmptyValue(inputValue.value);
                    },
                    onChange: () => {
                        inputValue.value = normalizeEmptyValue(inputValue.value);
                    },
                    onClear: () => {
                        inputValue.value = multiple.value ? [] : null;
                    },
                },
            },
        );

        const { stateClasses } = useStateClass(computedState);

        const triggerId = computed(() => `${computedId.value}-trigger`);

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
            isOpen.value = !isOpen.value;
        }

        function toggleSelectAll() {
            if (computedDisabled.value || computedReadonly.value || !multiple.value) {
                return;
            }
            inputValue.value = options.value.map((option: any) => option.value);
        }

        function onClickOption(optionItem: OptionItem) {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            const selectingValue = optionItem.value;

            if (multiple.value) {
                if (!Array.isArray(inputValue.value)) {
                    inputValue.value = [];
                }

                const currentValues = inputValue.value;
                const index = currentValues.findIndex((v: any) => {
                    return objectUtil.isEqual(v, selectingValue);
                });

                if (index >= 0) {
                    inputValue.value = currentValues.filter((_: any, i: number) => i !== index);
                } else {
                    inputValue.value = [...currentValues, selectingValue];
                }
            } else {
                inputValue.value = selectingValue;
                isOpen.value = false;
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

        return {
            triggerRef,
            searchInputRef,
            triggerId,
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
            optionsFilter,
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
            onFocus,
            onBlur,
            focus,
            blur,
            validate,
            clear,
            selectIcons,
            isEmpty,
            displayLabel,
            displayChips,
            placeholder,
            removeValue,
            computedOptions,
        };
    },
});
</script>

<style src="./VsSelect.css" />
