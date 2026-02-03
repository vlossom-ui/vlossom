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
                <vs-render
                    class="vs-icon-container"
                    :class="{ copied }"
                    :style="componentStyleSet.copyIcon"
                    :content="computedCopyIcon"
                />
            </button>

            <button
                v-if="link"
                type="button"
                class="vs-text-wrap-button vs-link-button"
                aria-label="link"
                @click.prevent.stop="openLink"
            >
                <vs-render class="vs-icon-container" :style="componentStyleSet.linkIcon" :content="linkIcon" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, type ComputedRef, type PropType, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import { clipboardUtil, logUtil, objectUtil, stringUtil } from '@/utils';
import type { VsTextWrapStyleSet } from './types';
import { checkIcon, copyIcon, linkIcon } from './icons';
import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsTextWrap;
export default defineComponent({
    name: componentName,
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

        const baseStyleSet: ComputedRef<VsTextWrapStyleSet> = computed(() => ({}));

        const additionalStyleSet: ComputedRef<Partial<VsTextWrapStyleSet>> = computed(() => {
            return objectUtil.shake({
                variables: objectUtil.shake({
                    width:
                        !width.value || objectUtil.isObject(width.value)
                            ? undefined
                            : stringUtil.toStringSize(width.value as string | number),
                }),
            });
        });

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsTextWrapStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
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

        function isValidUrl(url: string): boolean {
            try {
                const parsedUrl = new URL(url);
                return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
            } catch {
                return false;
            }
        }

        function openLink() {
            if (!link.value) {
                return;
            }

            if (!isValidUrl(link.value)) {
                logUtil.warning(componentName, `Invalid or unsafe URL: ${link.value}`);
                return;
            }

            window.open(link.value, '_blank');
        }

        return {
            componentStyleSet,
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
