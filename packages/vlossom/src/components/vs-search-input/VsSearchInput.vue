<template>
    <vs-input
        ref="inputRef"
        class="vs-search-input"
        v-model="searchText"
        :color-scheme="computedColorScheme"
        :style-set="computedStyleSet"
        :style="styleSetVariables"
        :width
        :grid
        :disabled
        :readonly
        :placeholder
        no-clear
        no-messages
        no-label
        @change="onInputChange"
    >
        <template #append>
            <div v-if="useCaseSensitive || useRegex" class="vs-search-input-toggles">
                <vs-toggle
                    v-if="useCaseSensitive"
                    v-model="isCaseSensitiveOn"
                    class="vs-search-input-toggle"
                    :color-scheme="computedColorScheme"
                    :style-set="getToggleButtonStyleSet(isCaseSensitiveOn)"
                    :disabled="disabled || readonly"
                    :aria-label="isCaseSensitiveOn ? 'case sensitive' : 'case insensitive'"
                    @toggle="$emit('update:caseSensitive', $event)"
                >
                    <span class="vs-search-input-toggle-text">Aa</span>
                </vs-toggle>
                <vs-toggle
                    v-if="useRegex"
                    v-model="isRegexOn"
                    class="vs-search-input-toggle"
                    :color-scheme="computedColorScheme"
                    :style-set="getToggleButtonStyleSet(isRegexOn)"
                    :disabled="disabled || readonly"
                    :aria-label="isRegexOn ? 'regex' : 'no regex'"
                    @toggle="$emit('update:regex', $event)"
                >
                    <span class="vs-search-input-toggle-text">.*</span>
                </vs-toggle>
            </div>
        </template>
    </vs-input>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    ref,
    useTemplateRef,
    watch,
    type Ref,
    type TemplateRef,
    type ComputedRef,
} from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps, getResponsiveProps } from '@/props';
import { functionUtil } from '@/utils';
import type { VsSearchInputStyleSet } from './types';

import type { VsInputRef, VsInputStyleSet } from '@/components/vs-input/types';
import VsInput from '@/components/vs-input/VsInput.vue';
import VsToggle from '@/components/vs-toggle/VsToggle.vue';

const componentName = VsComponent.VsSearchInput;
export default defineComponent({
    name: componentName,
    components: { VsInput, VsToggle },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSearchInputStyleSet>(),
        ...getResponsiveProps(),
        disabled: { type: Boolean, default: false },
        placeholder: { type: String, default: '' },
        readonly: { type: Boolean, default: false },
        useCaseSensitive: { type: Boolean, default: false },
        useRegex: { type: Boolean, default: false },

        // v-model
        modelValue: { type: String, default: '' },
        caseSensitive: { type: Boolean, default: false },
        regex: { type: Boolean, default: false },
    },
    emits: ['search', 'update:modelValue', 'update:caseSensitive', 'update:regex'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, modelValue, caseSensitive, regex } = toRefs(props);

        const searchText: Ref<string> = ref(modelValue.value);
        const inputRef: TemplateRef<VsInputRef> = useTemplateRef('inputRef');
        const isCaseSensitiveOn = ref(caseSensitive.value);
        const isRegexOn = ref(regex.value);

        const { computedColorScheme } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<Partial<VsSearchInputStyleSet>> = computed(() => ({
            input: {
                variables: {
                    append: {
                        backgroundColor: 'transparent',
                        padding: '0 0.3rem',
                    },
                },
            },
        }));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsSearchInputStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const computedStyleSet: ComputedRef<VsInputStyleSet> = computed(() => {
            return componentStyleSet.value.input || {};
        });

        function getToggleButtonStyleSet(toggle: boolean) {
            return {
                backgroundColor: toggle ? 'var(--vs-area-bg)' : 'transparent',
                border: toggle ? '1px solid var(--vs-primary-comp-bg)' : '1px solid var(--vs-comp-bg)',
                padding: '0',
            };
        }

        const debouncedEmitSearch = functionUtil.debounce({ delay: 400 }, (value: string) => {
            emit('search', value);
            emit('update:modelValue', value);
        });

        function onInputChange(value: string | number | null) {
            const stringValue = value === null || value === undefined ? '' : String(value);
            searchText.value = stringValue;
            debouncedEmitSearch(stringValue);
        }

        function matchByText(text: string): boolean {
            const searchTextValue = isCaseSensitiveOn.value ? searchText.value : searchText.value.toLowerCase();
            const targetText = isCaseSensitiveOn.value ? text : text.toLowerCase();
            return targetText.includes(searchTextValue);
        }

        function matchByRegex(text: string): boolean {
            try {
                const pattern = searchText.value;
                const flags = isCaseSensitiveOn.value ? 'g' : 'gi';

                const regexPattern = new RegExp(pattern, flags);
                return regexPattern.test(text);
            } catch {
                // 정규식 오류 시 일반 텍스트 검색으로 fallback
                return matchByText(text);
            }
        }

        function match(text: string): boolean {
            if (!searchText.value) {
                return true;
            }

            if (isRegexOn.value) {
                return matchByRegex(text);
            }
            return matchByText(text);
        }

        function focus() {
            inputRef.value?.focus();
        }

        function blur() {
            inputRef.value?.blur();
        }

        function select() {
            inputRef.value?.select();
        }

        function clear() {
            inputRef.value?.clear();
            searchText.value = '';
        }

        watch([isCaseSensitiveOn, isRegexOn], () => {
            select();
            debouncedEmitSearch(searchText.value);
        });

        watch(modelValue, (value) => {
            searchText.value = value;
        });

        watch(caseSensitive, (value) => {
            isCaseSensitiveOn.value = value;
        });

        watch(regex, (value) => {
            isRegexOn.value = value;
        });

        return {
            inputRef,
            searchText,
            isCaseSensitiveOn,
            isRegexOn,
            computedColorScheme,
            computedStyleSet,
            styleSetVariables,
            onInputChange,
            getToggleButtonStyleSet,
            // Methods
            match,
            focus,
            blur,
            select,
            clear,
        };
    },
});
</script>

<style src="./VsSearchInput.css" />
