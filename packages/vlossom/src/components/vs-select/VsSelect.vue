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
                <!-- TODO: 선택된 값 표시 영역 -->
                {{ inputValue }}
            </div>
            <vs-floating :target="`#${triggerId}`" v-model="isOpen" placement="bottom" align="start" follow-width>
                <vs-options
                    :class="['vs-select-options', colorSchemeClass]"
                    :style-set="componentStyleSet.options"
                    :options
                    :option-label
                    :option-value
                    :group-by
                    :group-order
                    :disabled="optionsDisabled"
                    :filter="optionsFilter"
                    @click-option="onClickOption"
                >
                    <template #header v-if="useSearch || $slots['options-header']">
                        <div class="vs-select-search">
                            <vs-search-input
                                v-if="useSearch"
                                ref="searchInputRef"
                                v-model="searchText"
                                v-bind="searchConfig"
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
                    <template #option="optionSlotProps">
                        <slot name="option" v-bind="optionSlotProps">
                            <div class="vs-select-option">
                                {{ optionSlotProps.label }}
                            </div>
                        </slot>
                    </template>
                    <template #footer v-if="$slots['options-footer']">
                        <slot name="options-footer" />
                    </template>
                </vs-options>
            </vs-floating>
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, useTemplateRef, ref, type PropType, type Ref, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import {
    getColorSchemeProps,
    getStyleSetProps,
    getOptionsProps,
    getGroupByProps,
    getInputProps,
    getResponsiveProps,
    getMinMaxProps,
} from '@/props';
import { useColorScheme, useStyleSet, useInput, useStateClass, useInputOption } from '@/composables';
import { objectUtil } from '@/utils';
import type { VsSelectStyleSet } from './types';
import { useVsSelectRules } from './vs-select-rules';

import type { VsOptionsItem } from '@/components/vs-options/types';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';
import VsFloating from '@/components/vs-floating/VsFloating.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsOptions from '@/components/vs-options/VsOptions.vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';

const componentName = VsComponent.VsSelect;
export default defineComponent({
    name: componentName,
    components: { VsFloating, VsOptions, VsInputWrapper, VsSearchInput, VsCheckbox },
    props: {
        ...getInputProps<any>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSelectStyleSet>(),
        ...getOptionsProps(),
        ...getGroupByProps(),
        ...getMinMaxProps(componentName),
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
        multiple: { type: Boolean, default: false },

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
        } = toRefs(props);

        const inputValue: Ref<any> = ref(modelValue.value);
        const isOpen = ref(false);
        const searchText = ref('');

        const triggerRef: TemplateRef<HTMLElement> = useTemplateRef('triggerRef');
        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');

        const useSearch = computed(() => {
            if (typeof search.value === 'boolean') {
                return search.value;
            }

            return (
                search.value.useRegex !== undefined ||
                search.value.useCaseSensitive !== undefined ||
                search.value.placeholder !== undefined
            );
        });

        const searchConfig = computed(() => {
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

        function optionsFilter({ value }: VsOptionsItem) {
            return searchInputRef.value?.match(JSON.stringify(value)) ?? false;
        }

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);
        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSelectStyleSet>(componentName, styleSet);

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
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }
            inputValue.value = options.value.map((option: any) => option.value);
        }

        function onClickOption(optionItem: VsOptionsItem) {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            const selectedValue = optionItem.value;

            if (multiple.value) {
                if (!Array.isArray(inputValue.value)) {
                    inputValue.value = [];
                }

                const currentValues = inputValue.value;
                const index = currentValues.findIndex((v: any) => {
                    return objectUtil.isEqual(v, selectedValue);
                });

                if (index >= 0) {
                    // 이미 선택된 경우 제거
                    inputValue.value = currentValues.filter((_: any, i: number) => i !== index);
                } else {
                    // 선택되지 않은 경우 추가
                    inputValue.value = [...currentValues, selectedValue];
                }
            } else {
                // single select인 경우
                inputValue.value = selectedValue;
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
            shake,
            options,
            optionLabel,
            optionValue,
            optionsFilter,
            toggleSelectAll,
            groupBy,
            groupOrder,
            searchText,
            useSearch,
            searchConfig,
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
        };
    },
});
</script>

<style src="./VsSelect.css" />
