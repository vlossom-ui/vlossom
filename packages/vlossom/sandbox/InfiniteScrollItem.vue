<template>
    <div class="infinite-scroll-item">
        <div class="item-content">
            <div class="item-number">{{ number }}</div>
            <div class="item-title">Item {{ number }}</div>
            <div class="item-description">This is item number {{ number }} in the infinite scroll list.</div>
            <vs-button @click="onClick">Click me</vs-button>
            <span v-if="show"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam, quos.</span
            >
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    name: 'InfiniteScrollItem',
    props: {
        number: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const show = ref(false);
        const onClick = () => {
            show.value = !show.value;
        };
        return {
            show,
            onClick,
        };
    },
});
</script>

<style scoped>
@reference 'tailwindcss';

.infinite-scroll-item {
    @apply w-full;
    padding: 1.6rem;
    border-bottom: 1px solid var(--vs-line-color, #e5e7eb);
    background-color: var(--vs-area-bg, #ffffff);
}

.infinite-scroll-item:last-child {
    border-bottom: none;
}

.item-content {
    @apply flex flex-col gap-2;
}

.item-number {
    @apply font-mono text-sm;
    color: var(--vs-comp-font, #6b7280);
}

.item-title {
    @apply text-lg font-semibold;
    color: var(--vs-font-color, #111827);
}

.item-description {
    @apply text-sm;
    color: var(--vs-comp-font, #6b7280);
}
</style>
