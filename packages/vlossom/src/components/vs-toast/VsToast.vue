<template>
    <div :class="['vs-toast', computedColorSchemeClass]" :style="styleSetVariables">
        <vs-render v-if="typeof toast.content === 'string'" :content="toast.content" />
        <component v-else :is="toast.content" />
        <vs-button
            v-if="toast.primary !== false"
            variant="ghost"
            size="xs"
            icon-only
            :icon="closeIcon"
            @click="close"
        />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { useStyleSet } from '@/composables';
import { getStyleSetProps } from '@/props';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsButton from '@/components/vs-button/VsButton.vue';
import { closeIcon } from '@/components/vs-chip/icons';
import { useToastStore } from './composables/toast-store-composable';
import type { ToastInfo } from './types';
import type { VsToastStyleSet } from './types';

const name = VsComponent.VsToast;
export default defineComponent({
    name,
    components: { VsRender, VsButton },
    props: {
        toast: { type: Object as () => ToastInfo, required: true },
        ...getStyleSetProps<VsToastStyleSet>(),
    },
    setup(props) {
        const { toast, styleSet } = toRefs(props);
        const toastStore = useToastStore();

        // Use toast's colorScheme if available
        const computedColorSchemeClass = computed(() => {
            if (toast.value.colorScheme) {
                return `vs-toast-${toast.value.colorScheme}`;
            }
            return 'vs-toast-default';
        });

        const { styleSetVariables } = useStyleSet<VsToastStyleSet>(name, styleSet);

        function close() {
            toastStore.remove(toast.value.container, toast.value.id);
        }

        return {
            computedColorSchemeClass,
            styleSetVariables,
            closeIcon,
            close,
        };
    },
});
</script>

<style src="./VsToast.css" />
