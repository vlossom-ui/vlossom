<template>
    <div :class="['vs-tabs', colorSchemeClass, classObj]" :style="styleSetVariables">
        <vs-button
            v-if="showScrollButtons"
            class="vs-tab-scroll-button"
            :aria-label="vertical ? 'scroll up' : 'scroll left'"
            :disabled="isFirstEdge"
            tabindex="-1"
            small
            @click.prevent.stop="goPrev"
        >
            <vs-render :content="vsTabsIcons.goPrev" class="vs-tab-scroll-icon" />
        </vs-button>

        <div ref="tabsWrapRef" class="vs-tabs-wrap">
            <ul role="tablist" class="vs-tab-list">
                <li v-if="indicatorStyle" class="vs-tab-indicator" :style="indicatorStyle" aria-hidden="true" />
                <li
                    v-for="(tab, index) in tabs"
                    :key="tab"
                    ref="tabRefs"
                    :class="['vs-tab-item', { 'vs-selected': isSelected(index), 'vs-disabled': isDisabled(index) }]"
                    role="tab"
                    :aria-selected="isSelected(index)"
                    :aria-disabled="isDisabled(index)"
                    :tabindex="isSelected(index) ? 0 : -1"
                    @click.prevent.stop="selectTab(index)"
                    @keydown.stop="(e) => handleKeydown(e, vertical)"
                >
                    <slot name="tab" :tab :index>
                        {{ tab }}
                    </slot>
                </li>
            </ul>
        </div>

        <vs-button
            v-if="showScrollButtons"
            class="vs-tab-scroll-button"
            :aria-label="vertical ? 'scroll down' : 'scroll right'"
            :disabled="isLastEdge"
            tabindex="-1"
            small
            @click.prevent.stop="goNext"
        >
            <vs-render :content="vsTabsIcons.goNext" class="vs-tab-scroll-icon" />
        </vs-button>
    </div>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    ref,
    watch,
    onMounted,
    onUnmounted,
    nextTick,
    type Ref,
    type CSSProperties,
    type PropType,
} from 'vue';
import { useColorScheme, useStyleSet, useIndexSelector } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';
import VsButton from '@/components/vs-button/VsButton.vue';
import type { VsTabsStyleSet } from './types';
import { vsTabsIcons } from './icons';

const name = VsComponent.VsTabs;
export default defineComponent({
    name,
    components: { VsButton },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTabsStyleSet>(),
        dense: { type: Boolean, default: false },
        disabled: {
            type: Function as PropType<(index: number, tab: string) => boolean>,
            default: undefined,
        },
        primary: { type: Boolean, default: false },
        scrollButtons: {
            type: String as PropType<'hide' | 'show' | 'auto'>,
            default: 'hide',
        },
        tabs: {
            type: Array as PropType<string[]>,
            required: true,
        },
        vertical: { type: Boolean, default: false },
        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, dense, disabled, primary, scrollButtons, tabs, modelValue, vertical } =
            toRefs(props);
        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { styleSetVariables } = useStyleSet<VsTabsStyleSet>(name, styleSet);

        const tabsWrapRef: Ref<HTMLElement | null> = ref(null);
        const tabRefs: Ref<HTMLElement[]> = ref([]);
        const scrollCount = ref(0);
        const indicatorStyle = ref<CSSProperties | null>(null);

        const {
            selectedIndex,
            isSelected,
            isDisabled,
            findNextActivedIndex,
            findPreviousActivedIndex,
            getInitialIndex,
            selectIndex: selectTab,
            handleKeydown,
            isFirstEdge,
            isLastEdge,
        } = useIndexSelector(tabs, disabled);

        const classObj = computed(() => ({
            'vs-dense': dense.value,
            'vs-primary': primary.value,
            'vs-vertical': vertical.value,
        }));

        const showScrollButtons = computed(() => {
            if (scrollButtons.value === 'auto') {
                return scrollCount.value < tabs.value.length;
            }
            return scrollButtons.value === 'show';
        });

        function scrollTo(index: number) {
            if (!tabRefs.value[index]) {
                return;
            }
            tabRefs.value[index].focus();
            tabRefs.value[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }

        function goPrev() {
            const targetIndex = findPreviousActivedIndex(selectedIndex.value - 1);
            selectTab(targetIndex);
        }

        function goNext() {
            const targetIndex = findNextActivedIndex(selectedIndex.value + 1);
            selectTab(targetIndex);
        }

        function calculateScrollCount(): void {
            const tabsWrapSize = vertical.value ? tabsWrapRef.value?.clientHeight : tabsWrapRef.value?.clientWidth;
            if (!tabsWrapSize) {
                scrollCount.value = 0;
                return;
            }

            let visibleTabsCount = 0;
            let accumulatedSize = 0;

            tabRefs.value.some((tabRef) => {
                const tabSize = vertical.value ? tabRef.offsetHeight : tabRef.offsetWidth;
                if (accumulatedSize < tabsWrapSize - tabSize) {
                    accumulatedSize += tabSize;
                    visibleTabsCount++;
                    return false;
                }
                return true;
            });

            scrollCount.value = visibleTabsCount;
        }

        function updateIndicatorPosition(): void {
            const selectedTab = tabRefs.value[selectedIndex.value];
            if (!selectedTab) {
                indicatorStyle.value = null;
                return;
            }

            if (vertical.value) {
                indicatorStyle.value = {
                    top: `${selectedTab.offsetTop}px`,
                    height: `${selectedTab.offsetHeight}px`,
                };
            } else {
                indicatorStyle.value = {
                    left: `${selectedTab.offsetLeft}px`,
                    width: `${selectedTab.offsetWidth}px`,
                };
            }
        }

        function handleResize(): void {
            calculateScrollCount();
            updateIndicatorPosition();
        }

        onMounted(() => {
            selectedIndex.value = getInitialIndex(modelValue.value);
            calculateScrollCount();
            nextTick(() => {
                updateIndicatorPosition();
            });
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        watch(
            () => tabs.value.length,
            () => {
                selectedIndex.value = findNextActivedIndex(selectedIndex.value);
            },
        );

        watch(selectedIndex, (index: number) => {
            scrollTo(index);
            emit('update:modelValue', index);
            emit('change', index);
            nextTick(() => {
                updateIndicatorPosition();
            });
        });

        watch(modelValue, selectTab);

        return {
            colorSchemeClass,
            styleSetVariables,
            classObj,
            isSelected,
            isDisabled,
            selectedIndex,
            selectTab,
            tabsWrapRef,
            tabRefs,
            handleKeydown,
            showScrollButtons,
            goPrev,
            goNext,
            scrollCount,
            isFirstEdge,
            isLastEdge,
            indicatorStyle,
            vsTabsIcons,
        };
    },
});
</script>

<style src="./VsTabs.css" />
