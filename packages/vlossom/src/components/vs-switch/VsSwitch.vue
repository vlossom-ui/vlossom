<template>
    <vs-input-wrapper
        v-show="!hidden"
        :width="width"
        :style="componentStyleSet.wrapper"
        :grid="grid"
        :id="computedId"
        :label="label"
        :required="required"
        :disabled="computedDisabled"
        :small="small"
        :messages="computedMessages"
        :no-messages="noMessages"
        :shake="shake"
    >
        <template #label v-if="label || $slots['label']">
            <slot name="label" />
        </template>

        <div :class="['vs-switch', colorSchemeClass, classObj]" :style="styleSetVariables">
            <label class="vs-switch-wrap" :for="computedId">
                <input
                    ref="switchRef"
                    type="checkbox"
                    class="vs-switch-input"
                    :id="computedId"
                    :disabled="computedDisabled || computedReadonly"
                    :name="name"
                    :value="String(trueValue)"
                    :checked="isChecked"
                    :aria-required="required"
                    @focus.stop="onFocus"
                    @blur.stop="onBlur"
                    @change.stop="onChange"
                />

                <div :class="['vs-switch-button', stateClasses]">
                    <span class="vs-status-label" data-value="true" v-show="isChecked">
                        {{ trueLabel }}
                    </span>
                    <span class="vs-status-label" data-value="false" v-show="!isChecked">
                        {{ falseLabel }}
                    </span>
                </div>
            </label>
        </div>
        <template #messages v-if="!noMessages">
            <slot name="messages" />
        </template>
    </vs-input-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, useTemplateRef, type PropType, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getInputProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useColorScheme, useInput, useStateClass, useStyleSet, useValueMatcher } from '@/composables';
import type { VsSwitchStyleSet } from './types';

import VsInputWrapper from '@/components/vs-input-wrapper/VsInputWrapper.vue';

const name = VsComponent.VsSwitch;

export default defineComponent({
    name,
    components: { VsInputWrapper },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSwitchStyleSet>(),
        ...getInputProps<any, 'placeholder'>('placeholder'),
        ...getResponsiveProps(),
        beforeChange: {
            type: Function as PropType<(from: any, to: any) => Promise<boolean> | null>,
            default: null,
        },
        checked: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        trueLabel: { type: String, default: 'ON' },
        falseLabel: { type: String, default: 'OFF' },
        trueValue: { type: null, default: true },
        falseValue: { type: null, default: false },
        // v-model
        modelValue: { type: null, default: false },
    },
    emits: ['update:modelValue', 'update:changed', 'update:valid', 'change', 'focus', 'blur'],
    setup(props, { emit }) {
        const {
            beforeChange,
            checked,
            colorScheme,
            disabled,
            falseValue,
            id,
            messages,
            modelValue,
            multiple,
            noDefaultRules,
            readonly,
            required,
            rules,
            small,
            state,
            styleSet,
            trueValue,
        } = toRefs(props);

        const switchRef: TemplateRef<HTMLInputElement> = useTemplateRef('switchRef');

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSwitchStyleSet>(name, styleSet);

        const inputValue = ref(modelValue.value);

        const classObj = computed(() => ({
            'vs-checked': isChecked.value,
            'vs-disabled': computedDisabled.value,
            'vs-readonly': computedReadonly.value,
            'vs-small': small.value,
        }));

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

        async function onChange() {
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
        }

        function onFocus(e: FocusEvent) {
            emit('focus', e);
        }

        function onBlur(e: FocusEvent) {
            emit('blur', e);
        }

        function focus() {
            switchRef.value?.focus();
        }

        function blur() {
            switchRef.value?.blur();
        }

        return {
            switchRef,
            colorSchemeClass,
            styleSetVariables,
            classObj,
            stateClasses,
            computedId,
            computedDisabled,
            computedReadonly,
            computedMessages,
            computedState,
            componentStyleSet,
            inputValue,
            isChecked,
            shake,
            onChange,
            onFocus,
            onBlur,
            validate,
            clear,
            focus,
            blur,
        };
    },
});
</script>

<style src="./VsSwitch.css" />
