<template>
    <nav
        v-if="paths.length > 0"
        :class="['vs-breadcrumb', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :aria-label="optionMessages.VS_ARIA_BREADCRUMB"
    >
        <ol ref="listRef" class="vs-breadcrumb-list" :style="componentStyleSet.$list">
            <!-- 같은 문자열이 반복될 수 있어 index를 key로 쓴다 -->
            <template v-for="(path, index) in paths" :key="index">
                <!-- 접힌 구간(1 ~ lastHiddenIndex)은 첫 번째 숨김 위치에 펼치기 버튼 하나로 대신한다 -->
                <li
                    v-if="isCollapsed && index === 1"
                    class="vs-breadcrumb-item vs-breadcrumb-collapsed"
                    :style="componentStyleSet.$item"
                >
                    <button
                        type="button"
                        class="vs-breadcrumb-ellipsis vs-focus-visible"
                        :style="componentStyleSet.$ellipsis"
                        :aria-label="optionMessages.VS_ARIA_BREADCRUMB_EXPAND"
                        @click="expand"
                    >
                        <EllipsisIcon class="vs-breadcrumb-ellipsis-icon" />
                    </button>
                    <span class="vs-breadcrumb-separator" aria-hidden="true" :style="componentStyleSet.$separator">
                        <slot name="separator" :index="lastHiddenIndex">
                            <ChevronRightIcon class="vs-breadcrumb-separator-icon" />
                        </slot>
                    </span>
                </li>
                <li
                    v-else-if="!isHidden(index)"
                    class="vs-breadcrumb-item"
                    :style="componentStyleSet.$item"
                    :aria-current="isCurrent(index) ? 'page' : undefined"
                >
                    <span v-if="isCurrent(index)" class="vs-breadcrumb-current" :style="componentStyleSet.$current">
                        <slot name="item" :path :index :is-current="true" :is-disabled="isDisabled(index)">
                            {{ path }}
                        </slot>
                    </span>
                    <template v-else>
                        <button
                            type="button"
                            :class="['vs-breadcrumb-link', 'vs-focus-visible', { 'vs-disabled': isDisabled(index) }]"
                            :style="componentStyleSet.$link"
                            :disabled="isDisabled(index)"
                            @click="clickPath(index)"
                        >
                            <slot name="item" :path :index :is-current="false" :is-disabled="isDisabled(index)">
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
            </template>
        </ol>
    </nav>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, toRefs, watch, type PropType, type Ref } from 'vue';
import { useColorScheme, useIndexSelector, useMessages, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import { logUtil } from '@/utils';
import type { VsBreadcrumbStyleSet } from './types';

import { ChevronRightIcon, EllipsisIcon } from '@lucide/vue';

const componentName = VsComponent.VsBreadcrumb;

export default defineComponent({
    name: componentName,
    components: { ChevronRightIcon, EllipsisIcon },
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
        showingLength: {
            type: Number,
            validator: (value: number) => {
                // 첫 항목과 현재 항목은 항상 보여야 하므로 2개 이상이어야 한다.
                const isValid = Number.isInteger(value) && value >= 2;
                if (!isValid) {
                    logUtil.propError(
                        componentName,
                        'showingLength',
                        'showingLength must be an integer greater than 1',
                    );
                }
                return isValid;
            },
        },
    },
    emits: ['click'],
    setup(props, { emit }) {
        const { optionMessages } = useMessages();
        const { colorScheme, styleSet, disabled, paths, showingLength } = toRefs(props);
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
            emit('click', paths.value.slice(0, index + 1), [...paths.value]);
        }

        const listRef: Ref<HTMLOListElement | null> = ref(null);
        const expanded = ref(false);

        const isCollapsed = computed(() => {
            if (showingLength.value === undefined || expanded.value) {
                return false;
            }
            return paths.value.length > showingLength.value;
        });

        const lastHiddenIndex = computed(() => paths.value.length - (showingLength.value ?? paths.value.length));

        function isHidden(index: number): boolean {
            return isCollapsed.value && index >= 1 && index <= lastHiddenIndex.value;
        }

        async function expand() {
            expanded.value = true;
            await nextTick();
            // 펼치기 버튼이 사라져 focus를 잃으므로, 숨겨졌던 첫 항목(index 1)으로 옮긴다.
            listRef.value?.children[1]?.querySelector('button')?.focus();
        }

        // 다른 경로로 바뀌면 새 경로를 다시 접는다.
        watch(
            paths,
            () => {
                expanded.value = false;
            },
            { deep: true },
        );

        return {
            // Style
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,

            // State
            isCurrent,
            isDisabled,
            isCollapsed,
            isHidden,
            lastHiddenIndex,
            optionMessages,

            // DOM Refs
            listRef,

            // Actions
            clickPath,
            expand,
        };
    },
});
</script>

<style src="./VsBreadcrumb.css" />
