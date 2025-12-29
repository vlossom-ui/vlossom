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

        <div :class="['vs-select', colorSchemeClass, classObj, stateClasses]" :style="styleSetVariables">
            <div ref="triggerRef" :id="computedId" class="vs-select-trigger" @click="toggleOpen">
                <!-- TODO: 선택된 값 표시 영역 -->
            </div>
            <vs-floating :target="triggerSelector" v-model="isOpen" placement="bottom" align="start" follow-width>
                <vs-options
                    :options
                    :option-label
                    :option-value
                    :group-by
                    :group-order
                    :disabled="$props.optionsDisabled"
                    @click-option="onClickOption"
                >
                    <template #header v-if="hasSearchConfig || $slots['options-header']">
                        <vs-search-input
                            v-if="hasSearchConfig"
                            v-model="searchText"
                            :use-regex="search.useRegex || false"
                            :use-case-sensitive="search.useCaseSensitive || false"
                            :placeholder="search.placeholder || ''"
                            @search="onSearch"
                        />
                        <slot name="options-header" v-if="$slots['options-header']" />
                    </template>
                    <template #option="optionSlotProps" v-if="$slots.option">
                        <slot name="option" v-bind="optionSlotProps" />
                    </template>
                    <template #group="groupSlotProps" v-if="$slots.group">
                        <slot name="group" v-bind="groupSlotProps" />
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
} from '@/props';
import { useColorScheme, useStyleSet, useInput, useStateClass } from '@/composables';
import type { VsSelectStyleSet } from './types';

import VsFloating from '@/components/vs-floating/VsFloating.vue';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import VsOptions from '@/components/vs-options/VsOptions.vue';
import VsSearchInput from '@/components/vs-search-input/VsSearchInput.vue';

const componentName = VsComponent.VsSelect;
export default defineComponent({
    name: componentName,
    components: { VsFloating, VsOptions, VsInputWrapper, VsSearchInput },
    props: {
        ...getInputProps<any>(),
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSelectStyleSet>(),
        ...getOptionsProps(),
        ...getGroupByProps(),
        optionsDisabled: {
            type: [Boolean, Function] as PropType<boolean | ((option: any, index: number, options: any[]) => boolean)>,
            default: false,
        },
        search: {
            type: Object as PropType<{ useRegex?: boolean; useCaseSensitive?: boolean; placeholder?: string }>,
            default: () => ({}),
        },
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
        } = toRefs(props);

        const inputValue: Ref<any> = ref(modelValue.value);
        const searchText = ref('');

        const hasSearchConfig = computed(() => {
            return (
                search.value.useRegex !== undefined ||
                search.value.useCaseSensitive !== undefined ||
                search.value.placeholder !== undefined
            );
        });
        const triggerRef: TemplateRef<HTMLElement> = useTemplateRef('triggerRef');
        const isOpen = ref(false);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const { styleSetVariables } = useStyleSet<VsSelectStyleSet>(componentName, styleSet);

        function requiredCheck() {
            return required.value && !inputValue.value ? 'required' : '';
        }

        const {
            computedId: inputComputedId,
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
                defaultRules: computed(() => [requiredCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        // TODO: 초기값 처리
                    },
                    onChange: () => {
                        // TODO: 값 변경 처리
                    },
                    onClear: () => {
                        inputValue.value = null;
                    },
                },
            },
        );

        const { stateClasses } = useStateClass(computedState);

        const triggerSelector = computed(() => `#${inputComputedId.value}`);

        const classObj = computed(() => ({
            'vs-small': small.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
        }));

        function toggleOpen() {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }
            isOpen.value = !isOpen.value;
        }

        function onClickOption() {
            // TODO: 옵션 선택 처리
            isOpen.value = false;
        }

        function onSearch() {
            // TODO: 검색 처리
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
            triggerSelector,
            isOpen,
            colorSchemeClass,
            styleSetVariables,
            classObj,
            stateClasses,
            computedId: inputComputedId,
            computedMessages,
            computedDisabled,
            computedReadonly,
            shake,
            options,
            optionLabel,
            optionValue,
            groupBy,
            groupOrder,
            searchText,
            hasSearchConfig,
            toggleOpen,
            onClickOption,
            onSearch,
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
