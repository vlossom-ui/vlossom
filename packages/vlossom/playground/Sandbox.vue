<template>
    <vs-page class="mb-8" :style-set="{ component: { padding: '0' } }">
        <div class="sandbox flex flex-col gap-6 p-6">
            <h1>Sandbox</h1>

            <section class="flex flex-col gap-4">
                <h2 class="font-semibold">VsTooltip - slot interface</h2>

                <div class="flex flex-col gap-2">
                    <label>basic (default slot + #tooltip slot)</label>
                    <div>
                        <vs-tooltip>
                            <vs-button>Hover me</vs-button>
                            <template #tooltip>Tooltip content here!</template>
                        </vs-tooltip>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label>disabled trigger - tooltip should still appear on hover</label>
                    <div>
                        <vs-tooltip>
                            <vs-button disabled>Disabled button</vs-button>
                            <template #tooltip>Works on disabled trigger</template>
                        </vs-tooltip>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label>placements (top / right / bottom / left)</label>
                    <div class="flex gap-4">
                        <vs-tooltip placement="top">
                            <vs-button>Top</vs-button>
                            <template #tooltip>Top tooltip</template>
                        </vs-tooltip>
                        <vs-tooltip placement="right">
                            <vs-button>Right</vs-button>
                            <template #tooltip>Right tooltip</template>
                        </vs-tooltip>
                        <vs-tooltip placement="bottom">
                            <vs-button>Bottom</vs-button>
                            <template #tooltip>Bottom tooltip</template>
                        </vs-tooltip>
                        <vs-tooltip placement="left">
                            <vs-button>Left</vs-button>
                            <template #tooltip>Left tooltip</template>
                        </vs-tooltip>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label>clickable</label>
                    <div>
                        <vs-tooltip clickable>
                            <vs-button>Click me</vs-button>
                            <template #tooltip>Click to toggle</template>
                        </vs-tooltip>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label>contents-hover (hover into tooltip content stays open)</label>
                    <div>
                        <vs-tooltip contents-hover>
                            <vs-button>Hover me</vs-button>
                            <template #tooltip>
                                <a href="#">Hoverable link inside tooltip</a>
                            </template>
                        </vs-tooltip>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label>layout pass-through — display:contents wrapper does not break flex layout</label>
                    <div class="flex gap-2">
                        <vs-tooltip>
                            <vs-button responsive>Responsive 1</vs-button>
                            <template #tooltip>Wrapper has no layout box</template>
                        </vs-tooltip>
                        <vs-tooltip>
                            <vs-button responsive>Responsive 2</vs-button>
                            <template #tooltip>Buttons grow as if no wrapper exists</template>
                        </vs-tooltip>
                    </div>
                </div>
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        return {};
    },
});
</script>
