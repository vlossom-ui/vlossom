<template>
    <nav
        v-if="paths.length > 0"
        :class="['vs-breadcrumb', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :aria-label="optionMessages.VS_ARIA_BREADCRUMB"
    >
        <ol class="vs-breadcrumb-list" :style="componentStyleSet.$list">
            <!-- 같은 문자열이 반복될 수 있어 index를 key로 쓴다 -->
            <li
                v-for="(path, index) in paths"
                :key="index"
                class="vs-breadcrumb-item"
                :style="componentStyleSet.$item"
                :aria-current="isCurrent(index) ? 'page' : undefined"
            >
                <span v-if="isCurrent(index)" class="vs-breadcrumb-current" :style="componentStyleSet.$current">
                    {{ path }}
                </span>
                <template v-else>
                    <button
                        type="button"
                        class="vs-breadcrumb-link vs-focus-visible"
                        :style="componentStyleSet.$link"
                    >
                        {{ path }}
                    </button>
                    <span class="vs-breadcrumb-separator" aria-hidden="true" :style="componentStyleSet.$separator">
                        <ChevronRightIcon class="vs-breadcrumb-separator-icon" />
                    </span>
                </template>
            </li>
        </ol>
    </nav>
</template>

<script lang="ts">
import { defineComponent, toRefs, type PropType } from 'vue';
import { useColorScheme, useMessages, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import type { VsBreadcrumbStyleSet } from './types';

import { ChevronRightIcon } from '@lucide/vue';

const componentName = VsComponent.VsBreadcrumb;

export default defineComponent({
    name: componentName,
    components: { ChevronRightIcon },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsBreadcrumbStyleSet>(),
        paths: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
    },
    setup(props) {
        const { optionMessages } = useMessages();
        const { colorScheme, styleSet, paths } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsBreadcrumbStyleSet>(
            componentName,
            styleSet,
        );

        function isCurrent(index: number): boolean {
            return index === paths.value.length - 1;
        }

        return {
            // Style
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,

            // State
            isCurrent,
            optionMessages,
        };
    },
});
</script>

<style src="./VsBreadcrumb.css" />
