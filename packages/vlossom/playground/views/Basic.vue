<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Basic Components</h2>

        <h3 class="mb-4 font-semibold">VsAccordion</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-accordion v-model="accordion1">
                    <template #title>Default Accordion Title</template>
                    Default styled accordion content
                </vs-accordion>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Primary</h4>
                <vs-accordion v-model="accordion3" primary>
                    <template #title>Primary Accordion</template>
                    Primary styled accordion content
                </vs-accordion>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Disabled</h4>
                <vs-accordion disabled>
                    <template #title>Disabled Accordion</template>
                    This content is disabled
                </vs-accordion>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsAvatar</h3>
        <div class="flex flex-col gap-4">
            <h4 class="text-sm text-gray-500 dark:text-gray-400">Default</h4>
            <vs-avatar>Default</vs-avatar>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsBar</h3>
        <div class="flex flex-col gap-4">
            <h4 class="text-sm text-gray-500 dark:text-gray-400">Default</h4>
            <vs-bar :style-set="{ padding: '1rem' }">Default Bar</vs-bar>
            <h4 class="text-sm text-gray-500 dark:text-gray-400">Primary</h4>
            <vs-bar primary :style-set="{ padding: '1rem' }">Primary Bar</vs-bar>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsBlock</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-block>
                    <template #title>Block Title</template>
                    This is a VsBlock component with title slot
                </vs-block>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="text-sm text-gray-500 dark:text-gray-400">Without Title</h4>
                <vs-block>Content without title</vs-block>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsButton</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Variants</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-button>Default</vs-button>
                    <vs-button primary>Primary</vs-button>
                    <vs-button outline>Outline</vs-button>
                    <vs-button ghost>Ghost</vs-button>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">States</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-button disabled>Disabled</vs-button>
                    <vs-button loading>Loading</vs-button>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-button size="xs">Extra Small</vs-button>
                    <vs-button size="sm">Small</vs-button>
                    <vs-button>Default</vs-button>
                    <vs-button size="lg">Large</vs-button>
                    <vs-button size="xl">Extra Large</vs-button>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Shape</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-button circle>A</vs-button>
                    <vs-button circle primary>B</vs-button>
                    <vs-button circle outline>C</vs-button>
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsChip</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Variants</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-chip>Default</vs-chip>
                    <vs-chip primary>Primary</vs-chip>
                    <vs-chip outline>Outline</vs-chip>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-chip size="xs">Extra Small</vs-chip>
                    <vs-chip>Small(Default)</vs-chip>
                    <vs-chip size="md">Medium</vs-chip>
                    <vs-chip size="lg">Large</vs-chip>
                    <vs-chip size="xl">Extra Large</vs-chip>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Closable</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-chip closable @close="onChipClose">Closable</vs-chip>
                    <vs-chip closable primary @close="onChipClose">Closable Primary</vs-chip>
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsDivider</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Horizontal (Default)</h4>
                <div class="w-60">
                    <p>Content Above</p>
                    <vs-divider />
                    <p>Content Below</p>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Vertical</h4>
                <div class="flex h-10 items-center gap-2">
                    <span>Menu 1</span>
                    <vs-divider vertical />
                    <span>Menu 2</span>
                    <vs-divider vertical />
                    <span>Menu 3</span>
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsLoading</h3>
        <div class="flex flex-col gap-4">
            <h4 class="text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
            <div class="flex flex-wrap items-end gap-4">
                <vs-loading width="24px" height="24px" />
                <vs-loading width="36px" height="36px" />
                <vs-loading width="50px" height="50px" />
                <vs-loading width="70px" height="70px" />
            </div>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsSkeleton</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-skeleton :style-set="{ width: '50px', height: '50px', borderRadius: '50%' }" />
            <div class="flex flex-col gap-2">
                <vs-skeleton :style-set="{ width: '150px', height: '20px' }" />
                <vs-skeleton :style-set="{ width: '100px', height: '20px' }" />
            </div>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsTabs</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-tabs v-model="selectedTabDefault" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" width="100%" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Primary</h4>
                <vs-tabs v-model="selectedTabPrimary" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" primary width="100%" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Dense</h4>
                <vs-tabs v-model="selectedTabDense" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" dense width="100%" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Vertical</h4>
                <vs-tabs v-model="selectedTabVertical" :tabs="['Tab 1', 'Tab 2', 'Tab 3']" vertical width="120px" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Scroll Buttons (auto)</h4>
                <vs-tabs v-model="selectedTabScrollAuto" :tabs="scrollTabs" width="100%" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Scroll Buttons (show)</h4>
                <vs-tabs
                    v-model="selectedTabScrollShow"
                    :tabs="['Tab 1', 'Tab 2', 'Tab 3']"
                    scroll-buttons="show"
                    width="100%"
                />
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsThemeButton</h3>
        <div class="flex flex-col gap-4">
            <h4 class="text-sm text-gray-500 dark:text-gray-400">Default</h4>
            <vs-theme-button />
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsToggle</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="12">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">State</h4>
                <div
                    class="flex w-40 flex-col items-center justify-center gap-2 rounded border border-dashed
                        border-gray-300 p-3 dark:border-gray-600"
                >
                    <vs-chip :primary="toggleValue" :style-set="{ width: '120px' }">{{ toggleValue }}</vs-chip>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Variants</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-toggle v-model="toggleValue">Default</vs-toggle>
                    <vs-toggle v-model="toggleValue" primary>Primary</vs-toggle>
                    <vs-toggle v-model="toggleValue" outline>Outline</vs-toggle>
                    <vs-toggle v-model="toggleValue" ghost>Ghost</vs-toggle>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-toggle v-model="toggleValue" size="xs">Extra Small</vs-toggle>
                    <vs-toggle v-model="toggleValue" size="sm">Small</vs-toggle>
                    <vs-toggle v-model="toggleValue">Default</vs-toggle>
                    <vs-toggle v-model="toggleValue" size="lg">Large</vs-toggle>
                    <vs-toggle v-model="toggleValue" size="xl">Extra Large</vs-toggle>
                </div>
            </vs-responsive>
        </vs-grid>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useVlossom } from '@/framework';

export default defineComponent({
    name: 'Basic',
    setup() {
        const $vs = useVlossom();

        const accordion1 = ref(false);
        const accordion2 = ref(false);
        const accordion3 = ref(false);

        const selectedTabDefault = ref(0);
        const selectedTabPrimary = ref(0);
        const selectedTabDense = ref(0);
        const selectedTabVertical = ref(0);
        const selectedTabScrollAuto = ref(0);
        const selectedTabScrollShow = ref(0);
        const scrollTabs = ['Overview', 'Features', 'Pricing', 'Documentation', 'Support', 'Blog', 'Contact'];

        const toggleValue = ref(false);

        function onChipClose() {
            $vs.toast.info('Chip closed!');
        }

        return {
            accordion1,
            accordion2,
            accordion3,
            selectedTabDefault,
            selectedTabPrimary,
            selectedTabDense,
            selectedTabVertical,
            selectedTabScrollAuto,
            selectedTabScrollShow,
            scrollTabs,
            toggleValue,
            onChipClose,
        };
    },
});
</script>
