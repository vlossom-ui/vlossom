<template>
    <div class="vs-text-wrap" :style="styleSetVariables">
        <div ref="contentsRef" class="vs-text-wrap-contents">
            <slot />
        </div>

        <div v-if="copy || link || $slots['actions']" class="vs-text-wrap-buttons">
            <slot name="actions" />
            <button
                v-if="copy"
                type="button"
                class="vs-text-wrap-button vs-copy-button"
                aria-label="copy"
                @click.prevent.stop="copyInnerText"
            >
                <vs-render class="vs-icon-container" :class="{ copied }" :content="computedCopyIcon" />
            </button>

            <button
                v-if="link"
                type="button"
                class="vs-text-wrap-button vs-link-button"
                aria-label="link"
                @click.prevent.stop="openLink"
            >
                <vs-render class="vs-icon-container" :content="linkIcon" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, type PropType, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import { clipboardUtil } from '@/utils';
import type { VsTextWrapStyleSet } from './types';
import { checkIcon, copyIcon, linkIcon } from './icons';
import VsRender from '@/components/vs-render/VsRender.vue';

const name = VsComponent.VsTextWrap;
export default defineComponent({
    name,
    components: { VsRender },
    props: {
        ...getStyleSetProps<VsTextWrapStyleSet>(),
        copy: { type: Boolean, default: false },
        link: { type: String, default: '' },
        width: { type: [String, Number] as PropType<string | number>, default: '' },
    },
    emits: ['copied'],
    setup(props, { emit }) {
        const { styleSet, link, width } = toRefs(props);
        const { styleSetVariables } = useStyleSet<VsTextWrapStyleSet>(
            name,
            styleSet,
            computed(() => ({ width: width.value })),
        );

        const contentsRef: Ref<HTMLElement | null> = ref(null);
        const copied = ref(false);

        const contentText = computed(() => {
            return contentsRef.value?.innerText || '';
        });

        async function copyInnerText() {
            if (!contentText.value) {
                return;
            }

            const success = await clipboardUtil.copy(contentText.value);
            if (!success) {
                return;
            }

            emit('copied', contentText.value);

            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2000);
        }

        const computedCopyIcon = computed(() => {
            return copied.value ? checkIcon : copyIcon;
        });

        function openLink() {
            if (!link.value) {
                return;
            }
            window.open(link.value, '_blank');
        }

        return {
            styleSetVariables,
            contentText,
            contentsRef,
            copyInnerText,
            openLink,
            copied,
            computedCopyIcon,
            linkIcon,
        };
    },
});
</script>

<style src="./VsTextWrap.css" />
