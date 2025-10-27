<template>
    <div :class="['vs-pagination', colorSchemeClass, { 'vs-disabled': disabled }]" :style="styleSetVariables">
        <vs-button
            v-if="edgeButtons"
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.controlButton"
            :disabled="disabled || selected <= 0"
            :ghost
            :outline
            aria-label="go to first page"
            small
            @click.prevent.stop="goFirst()"
        >
            <slot name="first">
                <vs-render :content="paginationIcons.goFirst" />
            </slot>
        </vs-button>
        <vs-button
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.controlButton"
            :disabled="disabled || selected <= 0"
            :ghost
            :outline
            aria-label="go to previous page"
            small
            @click.prevent.stop="goPrev()"
        >
            <slot name="prev">
                <vs-render :content="paginationIcons.goPrev" />
            </slot>
        </vs-button>
        <div class="vs-page-buttons">
            <vs-button
                v-for="page in pages"
                :key="page"
                class="vs-page-button"
                :color-scheme="computedColorScheme"
                :style-set="componentStyleSet.pageButton"
                :primary="page === selected + 1"
                :disabled
                :ghost
                :outline
                :aria-label="`go to page ${page}`"
                small
                @click.prevent.stop="setPage(page - 1)"
            >
                <slot name="page" :page="page">
                    {{ page }}
                </slot>
            </vs-button>
        </div>
        <vs-button
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.controlButton"
            :disabled="disabled || selected >= length - 1"
            :ghost
            :outline
            aria-label="go to next page"
            small
            @click.prevent.stop="goNext()"
        >
            <slot name="next">
                <vs-render :content="paginationIcons.goNext" />
            </slot>
        </vs-button>
        <vs-button
            v-if="edgeButtons"
            class="vs-pagination-control-button"
            :color-scheme="computedColorScheme"
            :style-set="componentStyleSet.controlButton"
            :disabled="disabled || selected >= length - 1"
            :ghost
            :outline
            aria-label="go to last page"
            small
            @click.prevent.stop="goLast()"
        >
            <slot name="last">
                <vs-render :content="paginationIcons.goLast" />
            </slot>
        </vs-button>
    </div>
</template>

<script lang="ts">
import { type ComputedRef, computed, defineComponent, ref, toRefs, watch } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { logUtil } from '@/utils';
import type { VsPaginationStyleSet } from './types';
import { paginationIcons } from './icons';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsButton from '@/components/vs-button/VsButton.vue';

const name = VsComponent.VsPagination;
export default defineComponent({
    name,
    components: { VsRender, VsButton },
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
                    logUtil.propError(name, 'length', 'length must be greater than 0');
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
                    logUtil.propError(name, 'showingLength', 'showingLength must be greater than 0');
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
        const { colorScheme, styleSet, modelValue, length, showingLength } = toRefs(props);

        const { computedColorScheme, colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsPaginationStyleSet>(
            name,
            styleSet,
            ref({
                controlButton: { padding: '0.4rem' },
            }),
        );

        const selected = ref(modelValue.value);

        const pages: ComputedRef<number[]> = computed(() => {
            const pageArr: number[] = [];
            let start = 0;
            let end = 0;
            const isOdd = showingLength.value % 2;
            const halfLess = selected.value - Math.floor(showingLength.value / 2);
            const halfMore = selected.value + Math.floor(showingLength.value / 2);

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

        function setPage(page: number) {
            if (page < 0) {
                selected.value = 0;
            } else if (page >= length.value) {
                selected.value = length.value - 1;
            } else {
                selected.value = page;
            }
        }

        function goFirst() {
            setPage(0);
        }

        function goLast() {
            setPage(length.value - 1);
        }

        function goPrev() {
            setPage(selected.value - 1);
        }

        function goNext() {
            setPage(selected.value + 1);
        }

        watch(modelValue, setPage);

        watch(selected, () => {
            emit('update:modelValue', selected.value);
            emit('change', selected.value);
        });

        watch(length, () => {
            setPage(selected.value);
        });

        return {
            computedColorScheme,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            paginationIcons,
            selected,
            pages,
            goFirst,
            goLast,
            goPrev,
            goNext,
            setPage,
        };
    },
});
</script>

<style src="./VsPagination.css" />
