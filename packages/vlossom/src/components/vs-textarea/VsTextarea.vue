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

        <textarea
            ref="textareaRef"
            :id="computedId"
            :class="['vs-textarea', colorSchemeClass, classObj, stateClasses]"
            :style="componentStyleSet.component"
            :disabled="computedDisabled"
            :readonly="computedReadonly"
            :name
            :placeholder="placeholder"
            :value="inputValue"
            :aria-required="required"
            :autocomplete="autocomplete ? 'on' : 'off'"
            @input.stop="updateValue"
            @focus.stop="onFocus"
            @blur.stop="onBlur"
            @change.stop
        />

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, useTemplateRef, type TemplateRef, type PropType, type Ref } from 'vue';
import { VsComponent, type StringModifiers } from '@/declaration';
import { getColorSchemeProps, getInputProps, getMinMaxProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStateClass, useStyleSet, useStringModifier } from '@/composables';

import type { VsTextareaStyleSet, VsTextareaValueType } from './types';
import { useVsTextareaRules } from './vs-textarea-rules';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const componentName = VsComponent.VsTextarea;

export default defineComponent({
    name: componentName,
    components: { VsInputWrapper },
    props: {
        ...getInputProps<VsTextareaValueType>(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTextareaStyleSet>(),
        ...getResponsiveProps(),
        ...getMinMaxProps(componentName),
        autocomplete: { type: Boolean, default: false },
        // v-model
        modelValue: { type: String, default: '' },
        modelModifiers: {
            type: Object as PropType<StringModifiers>,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    // expose: ['focus', 'blur', 'validate', 'clear', 'select'],
    setup(props, { emit }) {
        const {
            colorScheme,
            disabled,
            id,
            messages,
            modelValue,
            noDefaultRules,
            readonly,
            required,
            rules,
            max,
            min,
            state,
            styleSet,
            modelModifiers,
        } = toRefs(props);

        const textareaRef: TemplateRef<HTMLTextAreaElement> = useTemplateRef('textareaRef');
        const inputValue: Ref<VsTextareaValueType> = ref(modelValue.value);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet } = useStyleSet<VsTextareaStyleSet>(componentName, styleSet);

        const { modifyStringValue } = useStringModifier(modelModifiers);
        const { requiredCheck, maxCheck, minCheck } = useVsTextareaRules(required, max, min);

        function convertValue(v: string): string {
            if (!v) {
                return '';
            }

            return modifyStringValue(v.toString());
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
                defaultRules: computed(() => [requiredCheck, maxCheck, minCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        inputValue.value = convertValue(modelValue.value || '');
                    },
                    onChange: () => {
                        inputValue.value = convertValue(inputValue.value);
                    },
                },
            },
        );

        const classObj = computed(() => ({
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            'vs-focus-visible': !computedDisabled.value && !computedReadonly.value,
        }));

        const { stateClasses } = useStateClass(computedState);

        function updateValue(event: Event) {
            const target = event.target as HTMLTextAreaElement;
            const value = target.value || '';
            inputValue.value = convertValue(value);
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function focus() {
            textareaRef.value?.focus();
        }

        function blur() {
            textareaRef.value?.blur();
        }

        function select() {
            textareaRef.value?.select();
        }

        return {
            // Refs
            textareaRef,

            // Computed
            classObj,
            colorSchemeClass,
            componentStyleSet,
            stateClasses,
            computedId,
            computedDisabled,
            computedReadonly,
            computedMessages,
            computedState,
            inputValue,
            shake,

            // Methods
            updateValue,
            onFocus,
            onBlur,
            clear,
            validate,
            focus,
            blur,
            select,
        };
    },
});
</script>

<style src="./VsTextarea.css" />
