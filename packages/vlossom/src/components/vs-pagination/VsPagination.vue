<template>
    <div
        :class="['vs-pagination', colorSchemeClass, { 'vs-disabled': disabled }]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
    >
        <vs-button
            v-if="edgeButtons"
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.$controlButton"
            :disabled="disabled || isFirstEdge"
            :ghost
            :outline
            aria-label="go to first page"
            size="sm"
            @click.prevent.stop="goFirst()"
        >
            <slot name="first">
                <ChevronFirstIcon :size="16" color="currentColor" />
            </slot>
        </vs-button>
        <vs-button
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.$controlButton"
            :disabled="disabled || isFirstEdge"
            :ghost
            :outline
            aria-label="go to previous page"
            size="sm"
            @click.prevent.stop="goPrev()"
        >
            <slot name="prev">
                <ChevronLeftIcon :size="16" color="currentColor" />
            </slot>
        </vs-button>
        <div class="vs-page-buttons">
            <vs-button
                v-for="page in pages"
                :key="page"
                class="vs-page-button"
                :color-scheme="computedColorScheme"
                :style-set="getPageButtonStyleSet(page)"
                :primary="page === selectedIndex + 1"
                :disabled
                :ghost
                :outline
                :aria-label="`go to page ${page}`"
                size="sm"
                @click.prevent.stop="selectIndex(page - 1)"
            >
                <slot name="page" :page="page">
                    {{ page }}
                </slot>
            </vs-button>
        </div>
        <vs-button
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.$controlButton"
            :disabled="disabled || isLastEdge"
            :ghost
            :outline
            aria-label="go to next page"
            size="sm"
            @click.prevent.stop="goNext()"
        >
            <slot name="next">
                <ChevronRightIcon :size="16" color="currentColor" />
            </slot>
        </vs-button>
        <vs-button
            v-if="edgeButtons"
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.$controlButton"
            :disabled="disabled || isLastEdge"
            :ghost
            :outline
            aria-label="go to last page"
            size="sm"
            @click.prevent.stop="goLast()"
        >
            <slot name="last">
                <ChevronLastIcon :size="16" color="currentColor" />
            </slot>
        </vs-button>
    </div>
</template>

<script lang="ts">
import { type ComputedRef, computed, defineComponent, toRefs, watch } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet, useIndexSelector } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { logUtil, objectUtil } from '@/utils';
import type { VsPaginationStyleSet } from './types';

import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from '@lucide/vue';
import VsButton from '@/components/vs-button/VsButton.vue';

const componentName = VsComponent.VsPagination;
export default defineComponent({
    name: componentName,
    components: { VsButton, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsPaginationStyleSet>(),
        disabled: { type: Boolean, default: false },
        edgeButtons: { type: Boolean, default: false },
        ghost: { type: Boolean, default: false },
        length: {
            type: Number,
            required: true,
            default: 1,
            validator: (value: number) => {
                const isValid = value > 0;
                if (!isValid) {
                    logUtil.propError(componentName, 'length', 'length must be greater than 0');
                }
                return isValid;
            },
        },
        outline: { type: Boolean, default: false },
        showingLength: {
            type: Number,
            default: 10,
            validator: (value: number) => {
                const isValid = value > 0;
                if (!isValid) {
                    logUtil.propError(componentName, 'showingLength', 'showingLength must be greater than 0');
                }
                return isValid;
            },
        },

        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue', 'change'],
    // expose: ['goFirst', 'goLast', 'goPrev', 'goNext', 'setPage'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, disabled, modelValue, length, showingLength } = toRefs(props);
        const { computedColorScheme, colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const baseStyleSet: ComputedRef<VsPaginationStyleSet> = computed(() => ({
            $controlButton: { $content: { padding: '0' } },
        }));

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsPaginationStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const pageIndexList = computed(() => Array.from({ length: length.value }, (_, i) => i));

        const { selectedIndex, selectIndex, isFirstEdge, isLastEdge } = useIndexSelector(pageIndexList, disabled);

        const pages: ComputedRef<number[]> = computed(() => {
            const pageArr: number[] = [];
            let start = 0;
            let end = 0;
            const isOdd = showingLength.value % 2;
            const halfLess = selectedIndex.value - Math.floor(showingLength.value / 2);
            const halfMore = selectedIndex.value + Math.floor(showingLength.value / 2);

            if (length.value <= showingLength.value) {
                start = 0;
                end = length.value - 1;
            } else if (halfLess < 0) {
                start = 0;
                end = showingLength.value - 1;
            } else if ((!isOdd && halfMore - 1 >= length.value - 1) || (isOdd && halfMore >= length.value - 1)) {
                start = length.value - showingLength.value;
                end = length.value - 1;
            } else {
                start = halfLess;
                end = !isOdd ? halfMore - 1 : halfMore;
            }

            // UI 표시를 위해 1-based로 변환 (내부적으로는 0-based 사용)
            for (let i = start; i <= end; i++) {
                pageArr.push(i + 1);
            }

            if (pageArr.length === 0) {
                return [1];
            }
            return pageArr;
        });

        function getPageButtonStyleSet(page: number) {
            const { $selected = {}, ...base } = componentStyleSet.value.$pageButton ?? {};
            if (page === selectedIndex.value + 1) {
                return objectUtil.assign(base, $selected);
            }
            return base;
        }

        function setPage(page: number) {
            selectIndex(page);
        }

        function goFirst() {
            selectIndex(0);
        }

        function goLast() {
            selectIndex(length.value - 1);
        }

        function goPrev() {
            selectIndex(selectedIndex.value - 1);
        }

        function goNext() {
            selectIndex(selectedIndex.value + 1);
        }

        watch(
            modelValue,
            (value) => {
                selectIndex(value);
            },
            { immediate: true },
        );

        watch(selectedIndex, (index: number) => {
            emit('update:modelValue', index);
            emit('change', index);
        });

        watch(length, () => {
            const currentIndex = selectedIndex.value;
            selectIndex(currentIndex);
        });

        return {
            computedColorScheme,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            selectedIndex,
            pages,
            getPageButtonStyleSet,
            goFirst,
            goLast,
            goPrev,
            goNext,
            setPage,
            selectIndex,
            isFirstEdge,
            isLastEdge,
        };
    },
});
</script>

<style src="./VsPagination.css" />
