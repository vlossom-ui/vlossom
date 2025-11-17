<template>
    <vs-input
        ref="inputRef"
        class="vs-search-input"
        v-model="searchText"
        :color-scheme="computedColorScheme"
        :style-set="computedStyleSet"
        :width
        :grid
        :disabled
        :readonly
        :placeholder
        :small
        no-clear
        no-messages
        no-label
        @update:modelValue="onInputChange"
    >
        <template #append>
            <div v-if="caseSensitive || regex" class="vs-search-input-toggles">
                <vs-toggle
                    v-if="caseSensitive"
                    v-model="isCaseSensitiveOn"
                    class="vs-search-input-toggle"
                    :color-scheme="computedColorScheme"
                    :style="getToggleButtonStyle(isCaseSensitiveOn)"
                    :small
                    :disabled="disabled || readonly"
                    :aria-label="isCaseSensitiveOn ? 'case sensitive' : 'case insensitive'"
                >
                    <span class="vs-search-input-toggle-text">Aa</span>
                </vs-toggle>
                <vs-toggle
                    v-if="regex"
                    v-model="isRegexOn"
                    class="vs-search-input-toggle"
                    :color-scheme="computedColorScheme"
                    :style="getToggleButtonStyle(isRegexOn)"
                    :small
                    :disabled="disabled || readonly"
                    :aria-label="isRegexOn ? 'regex' : 'no regex'"
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

const name = VsComponent.VsSearchInput;

export default defineComponent({
    name,
    components: { VsInput, VsToggle },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsSearchInputStyleSet>(),
        ...getResponsiveProps(),
        caseSensitive: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        placeholder: { type: String, default: '' },
        readonly: { type: Boolean, default: false },
        regex: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
    },
    emits: ['search'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, small } = toRefs(props);

        const searchText: Ref<string> = ref('');
        const inputRef: TemplateRef<VsInputRef> = useTemplateRef('inputRef');
        const isCaseSensitiveOn = ref(false);
        const isRegexOn = ref(false);

        const { computedColorScheme } = useColorScheme(name, colorScheme);
        const { componentStyleSet } = useStyleSet<VsSearchInputStyleSet>(name, styleSet);

        const computedStyleSet: ComputedRef<VsInputStyleSet> = computed(() => {
            return {
                ...componentStyleSet.value,
                append: {
                    backgroundColor: 'transparent',
                    padding: '0 0.3rem',
                },
            };
        });

        function getToggleButtonStyle(toggle: boolean) {
            return {
                backgroundColor: toggle ? 'var(--vs-area-bg)' : 'transparent',
                border: toggle ? '1px solid var(--vs-primary-comp-bg)' : '1px solid var(--vs-comp-bg)',
                padding: '0 0.3rem',
                width: small.value ? '1rem' : '1.4rem',
                height: small.value ? '1rem' : '1.4rem',
                fontSize: 'var(--vs-font-size-xs)',
            };
        }

        const debouncedEmitSearch = functionUtil.debounce({ delay: 500 }, (value: string) => {
            emit('search', value);
        });

        function onInputChange(value: string | number | null) {
            const stringValue = value === null || value === undefined ? '' : String(value);
            searchText.value = stringValue;
            debouncedEmitSearch(stringValue);
        }

        function matchByRegex(text: string): boolean {
            const flags = isCaseSensitiveOn.value ? 'g' : 'gi';
            const regexPattern = new RegExp(searchText.value, flags);
            return regexPattern.test(text);
        }

        function matchByText(text: string): boolean {
            const searchTextValue = isCaseSensitiveOn.value ? searchText.value : searchText.value.toLowerCase();
            const targetText = isCaseSensitiveOn.value ? text : text.toLowerCase();
            return targetText.includes(searchTextValue);
        }

        function match(text: string): boolean {
            if (!searchText.value) {
                return true;
            }

            try {
                if (isRegexOn.value) {
                    return matchByRegex(text);
                } else {
                    return matchByText(text);
                }
            } catch {
                return matchByText(text);
            }
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

        return {
            inputRef,
            searchText,
            isCaseSensitiveOn,
            isRegexOn,
            computedColorScheme,
            computedStyleSet,
            onInputChange,
            getToggleButtonStyle,
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
