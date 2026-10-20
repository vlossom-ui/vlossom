<template>
    <nav
        v-if="paths.length > 0"
        :class="['vs-breadcrumb', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :aria-label="optionMessages.VS_ARIA_BREADCRUMB_LABEL"
    >
        <ol
            ref="listRef"
            class="vs-breadcrumb-list vs-focus-visible"
            role="list"
            tabindex="-1"
            :style="componentStyleSet.$list"
        >
            <template v-for="(path, index) in paths" :key="index">
                <li
                    v-if="isCollapsed && index === 1"
                    class="vs-breadcrumb-item vs-breadcrumb-collapsed"
                    :style="componentStyleSet.$item"
                >
                    <button
                        type="button"
                        class="vs-breadcrumb-ellipsis vs-focus-visible"
                        :style="componentStyleSet.$ellipsisButton"
                        :aria-label="optionMessages.VS_ARIA_BREADCRUMB_EXPAND"
                        @click.stop="expand"
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
                        <slot name="path" :path :index :is-current="true" :is-disabled="isDisabled(index)">
                            {{ path }}
                        </slot>
                    </span>
                    <template v-else>
                        <button
                            type="button"
                            :class="[
                                'vs-breadcrumb-link',
                                { 'vs-focus-visible': !isDisabled(index), 'vs-disabled': isDisabled(index) },
                            ]"
                            :style="componentStyleSet.$link"
                            :disabled="isDisabled(index)"
                            @click.stop="clickPath(index)"
                        >
                            <slot name="path" :path :index :is-current="false" :is-disabled="isDisabled(index)">
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
import { NOT_SELECTED, VsComponent } from '@/declaration';
import { logUtil, objectUtil } from '@/utils';
import type { VsBreadcrumbStyleSet } from './types';

import { ChevronRightIcon, EllipsisIcon } from '@lucide/vue';

const componentName = VsComponent.VsBreadcrumb;
const LINK_SELECTOR = '.vs-breadcrumb-link';

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
    emits: ['click-path'],
    setup(props, { emit }) {
        const { optionMessages } = useMessages();
        const { colorScheme, styleSet, disabled, paths, showingLength } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsBreadcrumbStyleSet>(
            componentName,
            styleSet,
        );

        // disabled(boolean | 함수) 판정 규칙을 VsTabs/VsSteps와 공유하려고 재사용한다. 선택 상태는 쓰지 않는다.
        const { isDisabled, findActiveIndexForwardFrom } = useIndexSelector(paths, disabled);

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

        // ol은 펼친 뒤 focus할 활성 항목이 없을 때의 대상(tabindex="-1")이고, WebKit이 list-style 없는 목록의 시맨틱을 버려 role="list"를 둔다.
        const listRef: Ref<HTMLOListElement | null> = ref(null);
        const expanded = ref(false);

        // validator는 dev 빌드에서만 돌고 null은 검사하지 않으므로, 끄기(null)와 범위 밖 값을 여기서 보정한다.
        const visibleLength = computed(() => {
            if (showingLength.value === undefined || showingLength.value === null) {
                return undefined;
            }
            return Math.max(2, Math.floor(showingLength.value));
        });

        const isCollapsed = computed(() => {
            if (visibleLength.value === undefined || expanded.value) {
                return false;
            }
            return paths.value.length > visibleLength.value;
        });

        const lastHiddenIndex = computed(() => paths.value.length - (visibleLength.value ?? paths.value.length));

        // 접힌 구간(1 ~ lastHiddenIndex)은 템플릿에서 index 1 자리의 펼치기 버튼 하나로 대신한다.
        function isHidden(index: number): boolean {
            return isCollapsed.value && index >= 1 && index <= lastHiddenIndex.value;
        }

        async function expand() {
            expanded.value = true;
            await nextTick();
            // 펼치기 버튼이 사라져 focus를 잃으므로, index 1부터 첫 활성 조상으로 옮기고 없으면 목록으로 옮긴다.
            const targetIndex = findActiveIndexForwardFrom(1);
            const target =
                targetIndex !== NOT_SELECTED && !isCurrent(targetIndex)
                    ? listRef.value?.children[targetIndex]?.querySelector<HTMLElement>(LINK_SELECTOR)
                    : null;
            (target ?? listRef.value)?.focus();
        }

        // 내용이 다른 경로로 바뀔 때만 다시 접는다. 부모가 같은 내용의 새 배열(inline 리터럴)로 다시 렌더링해도 유지한다.
        watch(
            () => [...paths.value],
            (next, prev) => {
                if (!objectUtil.isEqual(next, prev)) {
                    expanded.value = false;
                }
            },
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
