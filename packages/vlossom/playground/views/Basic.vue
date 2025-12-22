<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Basic Components</h2>

        <h3 class="mb-4 font-semibold">VsAccordion</h3>
        <div class="flex flex-col gap-2">
            <vs-accordion v-model="accordion1">
                <template #title>Accordion Item 1</template>
                Content for accordion item 1
            </vs-accordion>
            <vs-accordion v-model="accordion2">
                <template #title>Accordion Item 2</template>
                Content for accordion item 2
            </vs-accordion>
            <vs-accordion v-model="accordion3" disabled>
                <template #title>Disabled Accordion</template>
                This content is disabled
            </vs-accordion>
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsAvatar</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-avatar>A</vs-avatar>
            <vs-avatar color-scheme="blue">B</vs-avatar>
            <vs-avatar color-scheme="green">C</vs-avatar>
            <vs-avatar color-scheme="red">D</vs-avatar>
            <vs-avatar :style-set="{ width: '60px', height: '60px' }">XL</vs-avatar>
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsBar</h3>
        <vs-bar primary :style-set="{ padding: '1rem' }">This is a Bar component</vs-bar>
        <Divider />

        <h3 class="mb-4 font-semibold">VsBlock</h3>
        <vs-block>
            <template #title>Block Title</template>
            This is a VsBlock component with title slot
        </vs-block>
        <Divider />

        <h3 class="mb-4 font-semibold">VsButton</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-button>Default</vs-button>
            <vs-button primary>Primary</vs-button>
            <vs-button outline>Outline</vs-button>
            <vs-button ghost>Ghost</vs-button>
            <vs-button disabled>Disabled</vs-button>
            <vs-button :loading="buttonLoading" @click="triggerLoading">Loading</vs-button>
            <vs-button small>Small</vs-button>
            <vs-button large>Large</vs-button>
            <vs-button circle>C</vs-button>
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsChip</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-chip>Default Chip</vs-chip>
            <vs-chip primary>Primary</vs-chip>
            <vs-chip outline>Outline</vs-chip>
            <vs-chip small>Small</vs-chip>
            <vs-chip closable @close="onChipClose">Closable</vs-chip>
            <vs-chip color-scheme="red">Red</vs-chip>
            <vs-chip color-scheme="blue">Blue</vs-chip>
            <vs-chip color-scheme="green">Green</vs-chip>
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsIndexView</h3>
        <vs-tabs v-model="indexViewTab" :tabs="['View 1', 'View 2', 'View 3']" class="mb-4" />
        <vs-index-view :index="indexViewTab">
            <template #0>
                <div class="rounded-lg bg-[var(--vs-area-bg)] p-4">Content for View 1</div>
            </template>
            <template #1>
                <div class="rounded-lg bg-[var(--vs-area-bg)] p-4">Content for View 2</div>
            </template>
            <template #2>
                <div class="rounded-lg bg-[var(--vs-area-bg)] p-4">Content for View 3</div>
            </template>
        </vs-index-view>
        <Divider />

        <h3 class="mb-4 font-semibold">VsLoading</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-loading width="30px" height="30px" />
            <vs-loading width="50px" height="50px" color-scheme="blue" />
            <vs-loading width="70px" height="70px" color-scheme="green" />
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsSkeleton</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-skeleton :style-set="{ width: '100px', height: '20px' }" />
            <vs-skeleton :style-set="{ width: '150px', height: '20px' }" />
            <vs-skeleton :style-set="{ width: '50px', height: '50px', borderRadius: '50%' }" />
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsToggle</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-toggle v-model="toggleValue">
                {{ toggleValue ? 'ON' : 'OFF' }}
            </vs-toggle>
            <vs-toggle v-model="toggleValue" primary>Primary</vs-toggle>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useVlossom } from '@/framework';
import Divider from '../components/Divider.vue';

export default defineComponent({
    name: 'Basic',
    components: {
        Divider,
    },
    setup() {
        const $vs = useVlossom();

        const buttonLoading = ref(false);
        const toggleValue = ref(false);
        const indexViewTab = ref(0);
        const accordion1 = ref(false);
        const accordion2 = ref(false);
        const accordion3 = ref(false);

        function triggerLoading() {
            buttonLoading.value = true;
            setTimeout(() => {
                buttonLoading.value = false;
            }, 2000);
        }

        function onChipClose() {
            $vs.toast.info('Chip closed!');
        }

        return {
            buttonLoading,
            toggleValue,
            indexViewTab,
            accordion1,
            accordion2,
            accordion3,
            triggerLoading,
            onChipClose,
        };
    },
});
</script>
