<template>
    <vs-responsive :class="['vs-tabs', colorSchemeClass, classObj]" :style="{ ...styleSetVariables }" :width :grid>
        <vs-button
            v-if="showControls"
            class="vs-tab-control"
            :aria-label="vertical ? 'previous tab (up)' : 'previous tab (left)'"
            :disabled="isFirstEdge"
            :style-set="componentStyleSet.$control"
            tabindex="-1"
            size="sm"
            @click.prevent.stop="goPrev"
        >
            <vs-render :content="vsTabsIcons.goPrev" class="vs-tab-control-icon" />
        </vs-button>

        <div ref="tabsRef" class="vs-tabs-wrap">
            <ul role="tablist" class="vs-tab-list">
                <li
                    v-if="indicatorStyle"
                    class="vs-tab-indicator"
                    :style="{ ...indicatorStyle, ...componentStyleSet.$activeTab }"
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
            v-if="showControls"
            class="vs-tab-control"
            :aria-label="vertical ? 'next tab (down)' : 'next tab (right)'"
            :disabled="isLastEdge"
            :style-set="componentStyleSet.$control"
            tabindex="-1"
            size="sm"
            @click.prevent.stop="goNext"
        >
            <vs-render :content="vsTabsIcons.goNext" class="vs-tab-control-icon" />
        </vs-button>
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
        dense: { type: Boolean, default: false },
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((tab: string, index: number) => boolean)>,
            default: false,
        },
        primary: { type: Boolean, default: false },
        controls: {
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
        const { colorScheme, styleSet, dense, disabled, primary, controls, tabs, modelValue, vertical } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const tabsRef: Ref<HTMLElement | null> = ref(null);
        const tabRefs: Ref<HTMLElement[]> = ref([]);
        const visibleTabCount = ref(0);
        const indicatorStyle = ref<Record<string, string> | null>(null);

        const baseStyleSet: ComputedRef<VsTabsStyleSet> = computed(() => ({
            $control: {
                $content: {
                    padding: '0.4rem',
                },
            },
        }));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsTabsStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
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

        const showControls = computed(() => {
            if (controls.value === 'auto') {
                return visibleTabCount.value < tabs.value.length;
            }
            return controls.value === 'show';
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
            const tabListSize = vertical.value ? tabsRef.value?.clientHeight : tabsRef.value?.clientWidth;

            if (!tabListSize) {
                visibleTabCount.value = 0;
                return;
            }

            let visibleTabsCount = 0;
            let accumulatedSize = 0;

            tabRefs.value.some((tabRef) => {
                const tabSize = vertical.value ? tabRef.offsetHeight : tabRef.offsetWidth;
                const canFit = accumulatedSize + tabSize <= tabListSize;

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
                ...componentStyleSet.value.$tab,
                ...(isSelected(index) ? componentStyleSet.value.$activeTab : {}),
            };
        }

        onMounted(() => {
            selectedIndex.value = findActiveIndexForwardFrom(modelValue.value);

            if (tabsRef.value) {
                resizeObserver = new ResizeObserver(handleResize);
                resizeObserver.observe(tabsRef.value);
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
            tabsRef,
            tabRefs,

            // Event Handlers
            handleKeydown,

            // Controls
            showControls,
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
