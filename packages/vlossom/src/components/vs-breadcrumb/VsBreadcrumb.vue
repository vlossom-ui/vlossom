<template>
    <nav
        v-if="paths.length > 0"
        :class="['vs-breadcrumb', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :aria-label="optionMessages.VS_ARIA_BREADCRUMB_LABEL"
    >
        <ol class="vs-breadcrumb-list" role="list" :style="componentStyleSet.$list">
            <li
                v-for="(path, index) in paths"
                :key="index"
                class="vs-breadcrumb-item"
                :style="componentStyleSet.$item"
                :aria-current="isCurrent(index) ? 'page' : undefined"
            >
                <span v-if="isCurrent(index)" class="vs-breadcrumb-current" :style="componentStyleSet.$current">
                    <slot name="item-label" :path :index :is-current="true" :is-disabled="false">
                        {{ path }}
                    </slot>
                </span>
                <template v-else>
                    <button
                        type="button"
                        class="vs-breadcrumb-link"
                        :class="isDisabled(index) ? 'vs-disabled' : 'vs-focus-visible'"
                        :style="componentStyleSet.$link"
                        :disabled="isDisabled(index)"
                        @click.stop="clickPath(index)"
                    >
                        <slot name="item-label" :path :index :is-current="false" :is-disabled="isDisabled(index)">
                            {{ path }}
                        </slot>
                    </button>
                    <span class="vs-breadcrumb-separator" aria-hidden="true" :style="componentStyleSet.$separator">
                        <slot name="separator" :index>
                            <ChevronRightIcon class="vs-breadcrumb-separator-icon" />
                        </slot>
                    </span>
                </template>
            </li>
        </ol>
    </nav>
</template>

<script lang="ts">
import { defineComponent, toRefs, type PropType } from 'vue';
import { useColorScheme, useIndexSelector, useMessages, useStyleSet } from '@/composables';
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
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((path: string, index: number) => boolean)>,
            default: false,
        },
        paths: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
    },
    emits: ['click-path'],
    setup(props, { emit }) {
        const { optionMessages } = useMessages();
        const { colorScheme, styleSet, disabled, paths } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsBreadcrumbStyleSet>(
            componentName,
            styleSet,
        );

        // disabled(boolean | 함수) 판정 규칙을 VsTabs/VsSteps와 공유하려고 재사용한다. 선택 상태는 쓰지 않는다.
        const { isDisabled } = useIndexSelector(paths, disabled);

        function isCurrent(index: number): boolean {
            return index === paths.value.length - 1;
        }

        function clickPath(index: number) {
            if (isCurrent(index) || isDisabled(index)) {
                return;
            }

            // 핸들러가 받은 배열을 바꿔도 paths prop에 영향이 없도록 새 배열로 넘긴다.
            emit('click-path', paths.value.slice(0, index + 1), [...paths.value]);
        }

        return {
            // Style
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,

            // Item State
            isCurrent,
            isDisabled,

            // Actions
            clickPath,

            // Messages
            optionMessages,
        };
    },
});
</script>

<style src="./VsBreadcrumb.css" />
