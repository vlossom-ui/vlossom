<template>
    <section class="section">
        <h2 class="section-title">Basic Components</h2>

        <!-- Accordion -->
        <h3 class="component-title">VsAccordion</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
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
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Avatar -->
        <h3 class="component-title">VsAvatar</h3>
        <div class="component-row">
            <vs-avatar>A</vs-avatar>
            <vs-avatar color-scheme="blue">B</vs-avatar>
            <vs-avatar color-scheme="green">C</vs-avatar>
            <vs-avatar color-scheme="red">D</vs-avatar>
            <vs-avatar :style-set="{ width: '60px', height: '60px' }">XL</vs-avatar>
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Bar -->
        <h3 class="component-title">VsBar</h3>
        <vs-bar primary :style-set="{ padding: '1rem' }">This is a Bar component</vs-bar>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Block -->
        <h3 class="component-title">VsBlock</h3>
        <vs-block>
            <template #title>Block Title</template>
            This is a VsBlock component with title slot
        </vs-block>
        <vs-block color-scheme="blue" style="margin-top: 1rem">
            <template #title>Blue Block</template>
            Block with color scheme
        </vs-block>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Button -->
        <h3 class="component-title">VsButton</h3>
        <div class="component-row">
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
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Chip -->
        <h3 class="component-title">VsChip</h3>
        <div class="component-row">
            <vs-chip>Default Chip</vs-chip>
            <vs-chip primary>Primary</vs-chip>
            <vs-chip outline>Outline</vs-chip>
            <vs-chip small>Small</vs-chip>
            <vs-chip closable @close="onChipClose">Closable</vs-chip>
            <vs-chip color-scheme="red">Red</vs-chip>
            <vs-chip color-scheme="blue">Blue</vs-chip>
            <vs-chip color-scheme="green">Green</vs-chip>
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Index View -->
        <h3 class="component-title">VsIndexView</h3>
        <vs-tabs v-model="indexViewTab" :tabs="['View 1', 'View 2', 'View 3']" style="margin-bottom: 1rem" />
        <vs-index-view :index="indexViewTab">
            <template #0>
                <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">Content for View 1</div>
            </template>
            <template #1>
                <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">Content for View 2</div>
            </template>
            <template #2>
                <div style="padding: 1rem; background: var(--vs-area-bg); border-radius: 8px">Content for View 3</div>
            </template>
        </vs-index-view>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Loading -->
        <h3 class="component-title">VsLoading</h3>
        <div class="component-row">
            <vs-loading width="30px" height="30px" />
            <vs-loading width="50px" height="50px" color-scheme="blue" />
            <vs-loading width="70px" height="70px" color-scheme="green" />
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Skeleton -->
        <h3 class="component-title">VsSkeleton</h3>
        <div class="component-row">
            <vs-skeleton :style-set="{ width: '100px', height: '20px' }" />
            <vs-skeleton :style-set="{ width: '150px', height: '20px' }" />
            <vs-skeleton :style-set="{ width: '50px', height: '50px', borderRadius: '50%' }" />
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Toggle -->
        <h3 class="component-title">VsToggle</h3>
        <div class="component-row">
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

export default defineComponent({
    name: 'Basic',
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

<style scoped>
.section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vs-line-color);
}

.component-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--vs-font-color);
}

.component-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}
</style>
