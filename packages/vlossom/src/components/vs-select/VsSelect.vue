<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style-set="componentStyleSet.$wrapper"
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
                :placeholder="computedPlaceholder"
                :multiple
                :collapse-chips
                :closable-chips
                :selected-options
                :state="computedState"
                :no-clear
                :disabled="computedDisabled"
                :readonly="computedReadonly"
                :loading
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
                    :class="['vs-select-options', colorSchemeClass, sizeClass]"
                    :style="styleSetVariables"
                    :style-set="componentStyleSet.$options"
                    :items="filteredOptions"
                    :group-by
                    :group-order
                    :no-virtual
                    @click-item="selectOptionItem"
                >
                    <template #header v-if="isUsingSearch || $slots['options-header']">
                        <div
                            v-if="isUsingSearch"
                            :class="[
                                'vs-select-search',
                                { 'vs-focusable-active': isFocusedKey(SELECT_FOCUS_KEY.search) },
                            ]"
                            :data-focusable="SELECT_FOCUS_KEY.search"
                        >
                            <vs-search-input ref="searchInputRef" v-bind="searchProps" :size />
                        </div>
                        <div
                            v-if="isUsingSelectAll"
                            :class="[
                                'vs-select-all',
                                { 'vs-focusable-active': isFocusedKey(SELECT_FOCUS_KEY.selectAll) },
                            ]"
                            :data-focusable="SELECT_FOCUS_KEY.selectAll"
                            @click.prevent.stop="toggleSelectAll"
                        >
                            <vs-checkbox
                                :model-value="isSelectedAll"
                                :color-scheme="computedColorScheme"
                                :style-set="componentStyleSet.$selectAllCheckbox"
                                :size
                                check-label="Select All"
                                readonly
                                no-label
                                no-messages
                            />
                        </div>
                        <div class="vs-select-slot" v-if="$slots['options-header']" @keydown.stop>
                            <slot name="options-header" />
                        </div>
                    </template>
                    <template #group="groupSlotProps" v-if="$slots.group">
                        <slot name="group" v-bind="groupSlotProps" />
                    </template>
                    <template #item="{ item, ...itemSlotProps }">
                        <div
                            :class="[
                                'vs-select-option-wrap',
                                {
                                    selected: isSelected(itemSlotProps.id),
                                    'vs-focusable-active': isFocusedKey(itemSlotProps.id),
                                },
                            ]"
                            :style="getOptionStyleSet(itemSlotProps.id)"
                            :data-id="itemSlotProps.id"
                            :data-focusable="itemSlotProps.disabled ? undefined : itemSlotProps.id"
                        >
                            <slot
                                name="option"
                                v-bind="{ ...itemSlotProps, option: item, selected: isSelected(itemSlotProps.id) }"
                            >
                                <div class="vs-select-option">
                                    {{ itemSlotProps.label }}
                                </div>
                            </slot>
                        </div>
                    </template>
                    <template #empty>
                        <div class="vs-select-empty" @keydown.stop>
                            <slot name="empty">
                                <BanIcon class="vs-select-empty-icon" />
                                <p class="vs-select-empty-text">{{ optionMessages.VS_SELECT_NO_OPTIONS }}</p>
                            </slot>
                        </div>
                    </template>
                    <template #footer v-if="$slots['options-footer']">
                        <div class="vs-select-slot" @keydown.stop>
                            <slot name="options-footer" />
                        </div>
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
import { VsComponent, type OptionItem, type Size } from '@/declaration';
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
    useGroupedItems,
    useOverlayCallback,
    useClickOutside,
    useSizeClass,
    useMessages,
} from '@/composables';
import { logUtil, objectUtil } from '@/utils';
import type { VsSelectStyleSet, VsSelectTriggerRef } from './types';
import { useSelectRules } from './vs-select-rules';
import { useSelectValue, useSelectSearch, useSelectKeyboard } from './composables';
import { SELECT_FOCUS_KEY } from './constants';

import { BanIcon } from '@lucide/vue';
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
    components: { VsFloating, VsInputWrapper, VsSearchInput, VsCheckbox, VsGroupedList, VsSelectTrigger, BanIcon },
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
        emptyValue: { type: null },
        loading: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        noClear: { type: Boolean, default: false },
        noVirtual: { type: Boolean, default: false },
        optionsDisabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number, options: any[]) => boolean)>,
            default: false,
        },
        selectAll: { type: Boolean, default: false },
        size: { type: String as PropType<Size>, default: 'md' },

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
        const { optionMessages } = useMessages();
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
            size,
            placeholder,
            focusPlaceholder,
            selectAll,
            groupBy,
            groupOrder,
            emptyValue,
            loading,
        } = toRefs(props);

        const isOpen = ref(false);
        const isFocused = ref(false);
        const inputValue: Ref<any> = ref(modelValue.value);

        const computedEmptyValue = computed(() => {
            if (emptyValue.value !== undefined) {
                return emptyValue.value;
            }
            return multiple.value ? [] : null;
        });

        const triggerRef: TemplateRef<VsSelectTriggerRef> = useTemplateRef('triggerRef');
        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');
        const optionsListRef: TemplateRef<VsGroupedListRef> = useTemplateRef('optionsListRef');

        const isUsingSelect = computed(() => isFocused.value || isOpen.value);

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsSelectStyleSet> = computed(() => {
            return {
                $loading: { width: '1.25em', height: '1em' },
                $options: { maxHeight: '20rem' },
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

        const optionsListElement = computed(() => optionsListRef.value?.$el as HTMLElement);

        const isUsingSelectAll = computed(() => multiple.value && selectAll.value);

        const { groupedItems } = useGroupedItems(filteredOptions, groupBy, groupOrder);
        const displayedOptions = computed(() => groupedItems.value.flatMap((group) => group.items));

        const focusableKeys = computed(() => [
            ...(isUsingSearch.value ? [SELECT_FOCUS_KEY.search] : []),
            ...(isUsingSelectAll.value ? [SELECT_FOCUS_KEY.selectAll] : []),
            ...displayedOptions.value.filter((option) => !option.disabled).map((option) => option.id),
        ]);

        const {
            focusIndex,
            focusedKey,
            isFocused: isFocusedKey,
            updateFocusIndex,
            addMouseMoveListener,
            removeMouseMoveListener,
        } = useFocusable(optionsListElement, focusableKeys);

        function scrollToOption(optionId: string) {
            const optionElement = optionsListElement.value?.querySelector(`[data-id="${optionId}"]`);
            if (optionElement) {
                optionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                optionsListRef.value?.scrollToItem(optionId);
            }
        }

        const { isOptionValue } = useInputOption(
            inputValue,
            options,
            optionLabel,
            optionValue,
            multiple,
            computedEmptyValue,
        );

        const { requiredCheck, maxCheck, minCheck } = useSelectRules(required, multiple, min, max, isOptionValue);

        const defaultRules = computed(() => {
            const arr = [];
            if (required.value) {
                arr.push(requiredCheck);
            }
            if (multiple.value) {
                if (Number(min.value) > 0) {
                    arr.push(minCheck);
                }
                if (Number(max.value) < Number.MAX_SAFE_INTEGER) {
                    arr.push(maxCheck);
                }
            }
            return arr;
        });

        const {
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            shake,
            validate,
            clear,
            reset,
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
                defaultRules,
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = sanitizeValue(modelValue.value);
                    },
                    onChange: () => {
                        inputValue.value = sanitizeValue(inputValue.value);
                    },
                    onClear: () => {
                        clearSelected();
                        searchInputRef.value?.clear();
                    },
                },
            },
        );

        const isSelectUnavailable = computed(() => {
            return computedDisabled.value || computedReadonly.value || loading.value;
        });

        const {
            selectedOptionIds,
            isSelectedAll,
            isEmpty,
            selectedOptions,
            convertValue,
            isEmptyValue,
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
            isOptionValue,
            emptyValue: computedEmptyValue,
        });

        function sanitizeValue(value: any) {
            if (isEmptyValue(value)) {
                return convertValue(value);
            }
            const isArrayMultiple = multiple.value && Array.isArray(value);
            // options를 비동기로 불러오는 중일 수 있어 정리를 미루고, options가 들어오면 useInputOption이 정리한다
            if (computedOptions.value.length === 0) {
                return multiple.value && !isArrayMultiple ? [value] : value;
            }
            const valueArray = isArrayMultiple ? value : [value];
            const removed = valueArray.filter((v: any) => !isOptionValue(v));
            if (removed.length > 0) {
                const attempted = JSON.stringify(value);
                if (isArrayMultiple) {
                    const missing = JSON.stringify(removed);
                    logUtil.warning(
                        'VsSelect',
                        `Tried to set ${attempted}, but some values are not in options: ${missing}. Removed them.`,
                    );
                } else {
                    const resetTo = JSON.stringify(computedEmptyValue.value);
                    logUtil.warning(
                        'VsSelect',
                        `Tried to set ${attempted}, but it is not in options. Reset to ${resetTo}.`,
                    );
                }
            }
            return convertValue(value);
        }

        const { computedCallbacks } = useSelectKeyboard({
            isOpen,
            focusIndex,
            focusableKeys,
            focusedKey,
            searchInputRef,
            filteredOptions,
            isSelected,
            updateFocusIndex,
            scrollToOption,
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

        const { sizeClass } = useSizeClass(size);

        const classObj = computed(() => ({
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        const computedPlaceholder = computed(() => {
            if (isUsingSelect.value && focusPlaceholder.value) {
                return focusPlaceholder.value;
            }
            return placeholder.value ?? '';
        });

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

                    const selectedId = displayedOptions.value.find((option) => isSelected(option.id))?.id;
                    if (selectedId && optionsListRef.value?.hasScroll()) {
                        optionsListRef.value?.scrollToItem(selectedId, 50);
                    }

                    if (isUsingSearch.value) {
                        searchInputRef.value?.focus();
                        updateFocusIndex(0);
                    } else if (selectedId) {
                        updateFocusIndex(focusableKeys.value.indexOf(selectedId));
                    }
                });
            }, 50);
        }

        function getOptionStyleSet(optionId: string): CSSProperties {
            const { $focused = {}, $selected = {}, ...base } = componentStyleSet.value.$option ?? {};
            const isOptionFocused = focusedKey.value === optionId;
            if (isSelected(optionId)) {
                return objectUtil.assign(base, $selected);
            }
            if (isOptionFocused) {
                return objectUtil.assign(base, $focused);
            }
            return base;
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
                const nextValue = getSelectedValue();

                // emptyValue와 같은 값의 옵션이 있으면 clear 후에도 값이 그대로라 inputValue watch가 돌지 않는다
                if (objectUtil.isEqual(nextValue, inputValue.value)) {
                    syncSelectedOptionIds(nextValue);
                } else {
                    inputValue.value = nextValue;
                }
            },
            { deep: true },
        );

        function getSelectedValue() {
            if (multiple.value) {
                const values = selectedOptionIds.value
                    .map((optionId) => {
                        const option = computedOptions.value.find((o) => o.id === optionId);
                        return option ? option.value : null;
                    })
                    .filter((v) => v !== null);
                return values.length > 0 ? values : computedEmptyValue.value;
            }

            const selectedOptionId = selectedOptionIds.value[0];
            const selectedOption = computedOptions.value.find((o) => o.id === selectedOptionId);
            return selectedOption ? selectedOption.value : computedEmptyValue.value;
        }

        function syncSelectedOptionIds(value: any) {
            const isArrayMultiple = multiple.value && Array.isArray(value);
            const valueArray = value === undefined || value === null ? [] : isArrayMultiple ? value : [value];

            const nextIds = valueArray
                .map((v: any) => computedOptions.value.find((option) => objectUtil.isEqual(option.value, v))?.id)
                .filter((optionId: string | undefined): optionId is string => optionId !== undefined);

            if (!objectUtil.isEqual(nextIds, selectedOptionIds.value)) {
                selectedOptionIds.value = nextIds;
            }
        }

        watch(
            inputValue,
            (newInputValue, oldInputValue) => {
                if (objectUtil.isEqual(newInputValue, oldInputValue)) {
                    return;
                }
                syncSelectedOptionIds(newInputValue);
            },
            { immediate: true },
        );

        // options가 나중에 들어오거나 다시 불러와지면 값은 그대로여도 선택된 옵션 id를 다시 찾아야 한다
        watch(computedOptions, () => {
            // 빈 options로 동기화하면 선택이 비워지면서 값까지 emptyValue로 덮어쓰게 된다
            if (computedOptions.value.length === 0) {
                return;
            }
            syncSelectedOptionIds(inputValue.value);
        });

        watch([computedDisabled, computedReadonly, loading], () => {
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
            sizeClass,
            styleSetVariables,
            componentStyleSet,
            optionMessages,
            classObj,
            computedId,
            computedMessages,
            computedState,
            computedDisabled,
            computedReadonly,
            computedPlaceholder,
            filteredOptions,
            shake,
            openOptions,
            closeOptions,
            isSelected,
            toggleSelectAll,
            isUsingSearch,
            isUsingSelectAll,
            isFocusedKey,
            SELECT_FOCUS_KEY,
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
            reset,
            isEmpty,
            selectedOptions,
            deselectOption,
            getOptionStyleSet,
        };
    },
});
</script>

<style src="./VsSelect.css" />
