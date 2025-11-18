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

        <div :class="['vs-textarea', colorSchemeClass, classObj, stateClasses]" :style="styleSetVariables">
            <textarea
                ref="textareaRef"
                :id="computedId"
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
        </div>

        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, useTemplateRef, type TemplateRef, type PropType, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStateClass, useStyleSet, useStringModifier } from '@/composables';
import type { VsTextareaStyleSet, VsTextareaValueType } from './types';
import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';
import { useVsTextareaRules } from './vs-textarea-rules';
import { propsUtil } from '@/utils';
import type { StringModifiers } from '@/declaration';

const name = VsComponent.VsTextarea;

export default defineComponent({
    name,
    components: { VsInputWrapper },
    props: {
        ...getInputProps<VsTextareaValueType>(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTextareaStyleSet>(),
        ...getResponsiveProps(),
        autocomplete: { type: Boolean, default: false },
        max: {
            type: [Number, String],
            default: Number.MAX_SAFE_INTEGER,
            validator: (value: number | string) => propsUtil.checkValidNumber(name, 'max', value),
        },
        min: {
            type: [Number, String],
            default: Number.MIN_SAFE_INTEGER,
            validator: (value: number | string) => propsUtil.checkValidNumber(name, 'min', value),
        },
        // v-model
        modelValue: { type: String, default: '' },
        modelModifiers: {
            type: Object as PropType<StringModifiers>,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
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
            small,
            max,
            min,
            state,
            styleSet,
            modelModifiers,
        } = toRefs(props);

        const textareaRef: TemplateRef<HTMLTextAreaElement> = useTemplateRef('textareaRef');
        const inputValue: Ref<VsTextareaValueType> = ref(modelValue.value);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { styleSetVariables } = useStyleSet<VsTextareaStyleSet>(name, styleSet);
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
            'vs-small': small.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
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
            styleSetVariables,
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
