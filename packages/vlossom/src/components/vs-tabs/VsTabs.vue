<template>
    <vs-responsive :width :grid>
        <div :class="['vs-tabs', colorSchemeClass, classObj]" :style="styleSetVariables">
            <vs-button
                v-if="showScrollButtons"
                class="vs-tab-scroll-button"
                :aria-label="vertical ? 'scroll up' : 'scroll left'"
                :disabled="isFirstEdge"
                :style-set="componentStyleSet.scrollButton"
                tabindex="-1"
                small
                @click.prevent.stop="goPrev"
            >
                <vs-render :content="vsTabsIcons.goPrev" class="vs-tab-scroll-icon" />
            </vs-button>

            <div ref="tabsWrapRef" class="vs-tabs-wrap">
                <ul role="tablist" class="vs-tab-list">
                    <li
                        v-if="indicatorStyle"
                        class="vs-tab-indicator"
                        :style="{ ...indicatorStyle, ...componentStyleSet.activeTab }"
                        aria-hidden="true"
                    />
                    <li
                        v-for="(tab, index) in tabs"
                        :key="tab"
                        ref="tabRefs"
                        :style="getTabStyleSet(index)"
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
                :style-set="componentStyleSet.scrollButton"
                tabindex="-1"
                small
                @click.prevent.stop="goNext"
            >
                <vs-render :content="vsTabsIcons.goNext" class="vs-tab-scroll-icon" />
            </vs-button>
        </div>
    </vs-responsive>
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
    type PropType,
    type ComputedRef,
    type CSSProperties,
} from 'vue';
import { useColorScheme, useStyleSet, useIndexSelector } from '@/composables';
import { getColorSchemeProps, getStyleSetProps, getResponsiveProps } from '@/props';
import { NOT_SELECTED, VsComponent } from '@/declaration';
import { objectUtil, stringUtil } from '@/utils';
import { vsTabsIcons } from './icons';
import type { VsTabsStyleSet } from './types';

import VsButton from '@/components/vs-button/VsButton.vue';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsTabs;
export default defineComponent({
    name: componentName,
    components: { VsButton, VsResponsive, VsRender },
    props: {
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTabsStyleSet>(),
        height: { type: [String, Number] as PropType<string | number>, default: 'auto' },
        dense: { type: Boolean, default: false },
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((tab: string, index: number) => boolean)>,
            default: false,
        },
        primary: { type: Boolean, default: false },
        scrollButtons: {
            type: String as PropType<'hide' | 'show' | 'auto'>,
            default: 'auto',
        },
        tabs: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
        vertical: { type: Boolean, default: false },
        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue', 'change'],
    // expose: ['goPrev', 'goNext'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, height, dense, disabled, primary, scrollButtons, tabs, modelValue, vertical } =
            toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const tabsWrapRef: Ref<HTMLElement | null> = ref(null);
        const tabRefs: Ref<HTMLElement[]> = ref([]);
        const visibleTabCount = ref(0);
        const indicatorStyle = ref<Record<string, string> | null>(null);

        const baseStyleSet: ComputedRef<VsTabsStyleSet> = computed(() => ({
            scrollButton: {
                variables: {
                    padding: '0.4rem',
                },
            },
        }));

        const additionalStyleSet: ComputedRef<Partial<VsTabsStyleSet>> = computed(() => {
            return objectUtil.shake({
                variables: objectUtil.shake({
                    height: height.value === 'auto' ? undefined : stringUtil.toStringSize(height.value),
                }),
            });
        });

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsTabsStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const {
            selectedIndex,
            isSelected,
            isDisabled,
            findActiveIndexForwardFrom,
            findActiveIndexBackwardFrom,
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
                return visibleTabCount.value < tabs.value.length;
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
            const targetIndex = findActiveIndexBackwardFrom(selectedIndex.value - 1);
            selectTab(targetIndex);
        }

        function goNext() {
            const targetIndex = findActiveIndexForwardFrom(selectedIndex.value + 1);
            selectTab(targetIndex);
        }

        function calculateVisibleTabCount() {
            const tabsWrapSize = vertical.value ? tabsWrapRef.value?.clientHeight : tabsWrapRef.value?.clientWidth;

            if (!tabsWrapSize) {
                visibleTabCount.value = 0;
                return;
            }

            let visibleTabsCount = 0;
            let accumulatedSize = 0;

            tabRefs.value.some((tabRef) => {
                const tabSize = vertical.value ? tabRef.offsetHeight : tabRef.offsetWidth;
                const canFit = accumulatedSize + tabSize <= tabsWrapSize;

                if (canFit) {
                    accumulatedSize += tabSize;
                    visibleTabsCount++;
                    return false;
                }
                return true;
            });

            visibleTabCount.value = visibleTabsCount;
        }

        function updateIndicatorPosition() {
            if (selectedIndex.value === NOT_SELECTED) {
                indicatorStyle.value = null;
                return;
            }

            const selectedTab = tabRefs.value[selectedIndex.value];

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

        function handleResize() {
            calculateVisibleTabCount();
            updateIndicatorPosition();
        }

        let resizeObserver: ResizeObserver | null = null;

        function getTabStyleSet(index: number): CSSProperties {
            return {
                ...componentStyleSet.value.tab,
                ...(isSelected(index) ? componentStyleSet.value.activeTab : {}),
            };
        }

        onMounted(() => {
            selectedIndex.value = findActiveIndexForwardFrom(modelValue.value);

            if (tabsWrapRef.value) {
                resizeObserver = new ResizeObserver(handleResize);
                resizeObserver.observe(tabsWrapRef.value);
            }
        });

        onUnmounted(() => {
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        });

        watch(
            () => tabs.value.length,
            () => {
                const currentIndex = selectedIndex.value;
                selectTab(findActiveIndexForwardFrom(currentIndex));
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
            // Style
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            classObj,
            getTabStyleSet,

            // Selection
            isSelected,
            isDisabled,
            selectedIndex,
            selectTab,
            isFirstEdge,
            isLastEdge,

            // DOM Refs
            tabsWrapRef,
            tabRefs,

            // Event Handlers
            handleKeydown,

            // Scroll
            showScrollButtons,
            goPrev,
            goNext,

            // Indicator
            indicatorStyle,

            // Icons
            vsTabsIcons,
        };
    },
});
</script>

<style src="./VsTabs.css" />
