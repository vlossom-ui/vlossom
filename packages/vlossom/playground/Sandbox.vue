<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox flex flex-col gap-6">
            <div>
                <h1 class="text-2xl font-bold">VsSelect long option contents</h1>
                <p class="mt-2 opacity-70">Open each select to compare the default option and the option slot.</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <section class="flex flex-col gap-3">
                    <h2 class="text-lg font-semibold">Default option</h2>
                    <vs-select
                        v-model="defaultValue"
                        :options="longOptions"
                        option-label="label"
                        option-value="value"
                        label="Long default option"
                        width="18rem"
                    />
                </section>

                <section class="flex flex-col gap-3">
                    <h2 class="text-lg font-semibold">Option slot</h2>
                    <vs-select
                        v-model="slotValue"
                        :options="longOptions"
                        option-label="label"
                        option-value="value"
                        label="Long custom option"
                        width="18rem"
                    >
                        <template #option="{ option, selected }">
                            <div class="flex gap-3 px-4 py-2">
                                <span aria-hidden="true">{{ selected ? '✓' : '○' }}</span>
                                <div>
                                    <strong>{{ option.title }}</strong>
                                    <p class="opacity-70">{{ option.description }}</p>
                                </div>
                            </div>
                        </template>
                    </vs-select>
                </section>
            </div>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const longOptions = [
            {
                value: 'sentence',
                label:
                    'This option contains a long sentence that should wrap naturally ' +
                    'without creating a horizontal scrollbar.',
                title: 'Long sentence',
                description:
                    'This custom option contains a long description that should wrap naturally ' +
                    'without creating a horizontal scrollbar.',
            },
            {
                value: 'unbroken',
                label: 'https://example.com/products/vlossom/select/options/this-is-an-intentionally-long-unbroken-value',
                title: 'Long unbroken content',
                description:
                    'https://example.com/products/vlossom/select/options/this-is-an-intentionally-long-unbroken-custom-slot-value',
            },
            {
                value: 'short',
                label: 'Short option',
                title: 'Short option',
                description: 'A short custom option for comparison.',
            },
        ];

        const defaultValue = ref(null);
        const slotValue = ref(null);

        return {
            longOptions,
            defaultValue,
            slotValue,
        };
    },
});
</script>
