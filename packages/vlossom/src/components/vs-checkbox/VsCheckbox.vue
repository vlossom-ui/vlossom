<template>
    <vs-input-wrapper
        v-show="!hidden"
        :style="componentStyleSet.wrapper"
        :id="checkLabel ? '' : computedId"
        :disabled="computedDisabled"
        :messages="computedMessages"
        :width
        :grid
        :label
        :no-label
        :required
        :small
        :no-messages
        :shake
    >
        <template #label v-if="label || $slots['label']">
            <slot name="label" />
        </template>

        <div :class="['vs-checkbox', colorSchemeClass, classObj]" :style="styleSetVariables">
            <label class="vs-checkbox-wrap" :for="computedId">
                <input
                    ref="checkboxRef"
                    type="checkbox"
                    :class="['vs-checkbox-input', stateClasses]"
                    :id="computedId"
                    :disabled="computedDisabled || computedReadonly"
                    :value="String(trueValue)"
                    :checked="isChecked"
                    :aria-required="required"
                    :name
                    @click.prevent.stop="toggle"
                />
                <div v-if="checkLabel || $slots['check-label']" class="vs-checkbox-label">
                    <slot name="check-label">{{ checkLabel }}</slot>
                </div>
            </label>
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
    type PropType,
    type TemplateRef,
} from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStyleSet, useStateClass, useValueMatcher } from '@/composables';
import type { VsCheckboxStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const name = VsComponent.VsCheckbox;
export default defineComponent({
    name,
    components: { VsInputWrapper },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsCheckboxStyleSet>(),
        ...getInputProps<any, 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        beforeChange: {
            type: Function as PropType<(from: any, to: any) => Promise<boolean> | null>,
            default: null,
        },
        checked: { type: Boolean, default: false },
        checkLabel: { type: String, default: '' },
        indeterminate: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        trueValue: { type: null, default: true },
        falseValue: { type: null, default: false },

        // v-model
        modelValue: { type: null, default: false },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'toggle'],
    // expose: ['clear', 'validate', 'focus', 'blur'],
    setup(props, { emit }) {
        const {
            beforeChange,
            checked,
            colorScheme,
            styleSet,
            id,
            disabled,
            readonly,
            modelValue,
            messages,
            required,
            rules,
            state,
            trueValue,
            falseValue,
            multiple,
            noDefaultRules,
            indeterminate,
            small,
        } = toRefs(props);

        const checkboxRef: TemplateRef<HTMLInputElement> = useTemplateRef('checkboxRef');

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsCheckboxStyleSet>(name, styleSet);

        const inputValue = ref(modelValue.value);

        const {
            isMatched: isChecked,
            getInitialValue,
            getClearedValue,
            getUpdatedValue,
            addTrueValue,
        } = useValueMatcher(multiple, inputValue, trueValue, falseValue);

        function requiredCheck() {
            return required.value && !isChecked.value ? 'required' : '';
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
                defaultRules: ref([requiredCheck]),
                noDefaultRules,
                state,
                callbacks: {
                    onMounted: () => {
                        if (checked.value) {
                            if (multiple.value) {
                                // 초기 input value를 공유할 수 없기 때문에 getUpdatedValue를 사용하지 않음
                                addTrueValue();
                            } else {
                                inputValue.value = getUpdatedValue(true);
                            }
                        } else {
                            inputValue.value = getInitialValue();
                        }
                    },
                    onChange: () => {
                        if (inputValue.value === undefined || inputValue.value === null) {
                            inputValue.value = getClearedValue();
                        }
                    },
                    onClear: () => {
                        inputValue.value = getClearedValue();
                    },
                },
            },
        );

        const { stateClasses } = useStateClass(computedState);

        const classObj = computed(() => ({
            'vs-checked': isChecked.value,
            'vs-disabled': computedDisabled.value,
            'vs-focusable': !computedDisabled.value && !computedReadonly.value,
            'vs-indeterminate': indeterminate.value,
            'vs-readonly': computedReadonly.value,
            'vs-small': small.value,
        }));

        async function toggle() {
            if (computedDisabled.value || computedReadonly.value) {
                return;
            }

            const toValue = getUpdatedValue(!isChecked.value);

            const beforeChangeFn = beforeChange.value;
            if (beforeChangeFn) {
                const result = await beforeChangeFn(inputValue.value, toValue);
                if (!result) {
                    return;
                }
            }

            inputValue.value = toValue;
            emit('toggle', isChecked.value);
        }

        function focus() {
            checkboxRef.value?.focus();
        }

        function blur() {
            checkboxRef.value?.blur();
        }

        watch(
            isChecked,
            (value) => {
                nextTick(() => {
                    if (checkboxRef.value) {
                        checkboxRef.value.checked = value;
                    }
                });
            },
            { immediate: true },
        );

        return {
            checkboxRef,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            classObj,
            stateClasses,
            computedId,
            computedDisabled,
            computedReadonly,
            computedMessages,
            computedState,
            inputValue,
            isChecked,
            shake,
            toggle,
            validate,
            clear,
            focus,
            blur,
        };
    },
});
</script>

<style src="./VsCheckbox.css" />
