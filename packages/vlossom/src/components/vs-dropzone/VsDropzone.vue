<template>
    <div
        :class="['vs-dropzone', colorSchemeClass, { 'vs-dragging': dragging, 'vs-disabled': disabled }]"
        :style="componentInlineStyle"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <slot :dragging />

        <Transition name="vs-dropzone-overlay">
            <div
                v-if="dragging && !noOverlay"
                class="vs-dropzone-overlay"
                :style="componentStyleSet.$overlay"
                aria-hidden="true"
            >
                <slot name="overlay" />
            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';

import type { VsDropzoneStyleSet } from './types';

const componentName = VsComponent.VsDropzone;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDropzoneStyleSet>(),
        disabled: { type: Boolean, default: false },
        noOverlay: { type: Boolean, default: false },
    },
    emits: ['drop', 'change-dragging'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, disabled } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const { componentStyleSet, componentInlineStyle } = useStyleSet<VsDropzoneStyleSet>(componentName, styleSet);

        // dragenter/dragleave 는 자식 요소를 지날 때마다 발생하므로, 진입 깊이로 영역 안에 있는지 판단한다.
        const dragDepth: Ref<number> = ref(0);
        const dragging: ComputedRef<boolean> = computed(() => !disabled.value && dragDepth.value > 0);

        watch(dragging, (value) => {
            emit('change-dragging', value);
        });

        function isFileDrag(event: DragEvent): boolean {
            return Array.from(event.dataTransfer?.types ?? []).includes('Files');
        }

        function onDragEnter(event: DragEvent) {
            if (!isFileDrag(event)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            dragDepth.value++;
        }

        function onDragOver(event: DragEvent) {
            if (!isFileDrag(event)) {
                return;
            }

            // dropEffect 를 'none' 으로 두면 drop 이벤트 없이 브라우저가 파일을 직접 열어버리므로, disabled 여도 'copy' 로 받은 뒤 onDrop 에서 무시한다.
            event.preventDefault();
            event.stopPropagation();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
        }

        function onDragLeave(event: DragEvent) {
            if (!isFileDrag(event)) {
                return;
            }

            event.stopPropagation();
            dragDepth.value = Math.max(0, dragDepth.value - 1);
        }

        function onDrop(event: DragEvent) {
            if (!isFileDrag(event)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            dragDepth.value = 0;

            if (disabled.value) {
                return;
            }

            emit('drop', Array.from(event.dataTransfer?.files ?? []), event);
        }

        return {
            colorSchemeClass,
            componentStyleSet,
            componentInlineStyle,
            dragging,
            onDragEnter,
            onDragOver,
            onDragLeave,
            onDrop,
        };
    },
});
</script>

<style src="./VsDropzone.css" />
