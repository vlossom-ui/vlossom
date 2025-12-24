<script lang="ts">
import { defineComponent, h, KeepAlive, toRefs, Comment, Fragment, type VNode, ref, watch } from 'vue';
import { VsComponent } from '@/declaration';
import { getResponsiveProps } from '@/props';

import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';

const componentName = VsComponent.VsIndexView;

export default defineComponent({
    name: componentName,
    props: {
        ...getResponsiveProps(),
        keepAlive: { type: Boolean, default: false },

        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue'],
    setup(props, { slots, emit, expose }) {
        const { width, grid, modelValue, keepAlive } = toRefs(props);

        const index = ref(modelValue.value);

        function flattenNodes(nodes: VNode[]): VNode[] {
            const result: VNode[] = [];

            function flatten(nodeList: VNode[]) {
                for (const node of nodeList) {
                    // Fragment 노드인 경우 children을 재귀적으로 flatten
                    if (node.type === Fragment && Array.isArray(node.children)) {
                        flatten(node.children as VNode[]);
                    } else {
                        result.push(node);
                    }
                }
            }

            flatten(nodes);
            return result;
        }

        function filterUselessNodes(nodes: VNode[]): VNode[] {
            return nodes.filter((node) => {
                // 주석 노드 제외
                if (node.type === Comment) {
                    return false;
                }
                // 빈 텍스트 노드도 제외 (공백만 있는 경우)
                if (typeof node.type === 'symbol' && node.children && typeof node.children === 'string') {
                    return node.children.trim() !== '';
                }
                return true;
            });
        }

        function updateIndex(newIndex: number) {
            emit('update:modelValue', newIndex);
        }

        watch(modelValue, (newValue) => {
            index.value = newValue;
        });

        watch(index, (newValue) => {
            emit('update:modelValue', newValue);
        });

        expose({ updateIndex });

        return () => {
            if (!slots.default) {
                return null;
            }

            const slotNodes = slots.default();
            if (!slotNodes || slotNodes.length === 0) {
                return null;
            }

            // Fragment 노드들을 평면화하고 불필요한 노드들을 제거
            const flattenedNodes = flattenNodes(slotNodes);
            const filteredNodes = filterUselessNodes(flattenedNodes);
            if (filteredNodes.length === 0) {
                return null;
            }

            const currentIndex = index.value || 0;

            function renderContent() {
                if (keepAlive.value) {
                    return h(KeepAlive, {}, [
                        h(
                            'div',
                            { class: 'vs-index-view-container' },
                            filteredNodes.map((node, nodeIndex) =>
                                h(
                                    'div',
                                    {
                                        key: nodeIndex,
                                        style: {
                                            display: nodeIndex === currentIndex ? 'block' : 'none',
                                        },
                                    },
                                    [node],
                                ),
                            ),
                        ),
                    ]);
                }
                const currentNode = filteredNodes[currentIndex];
                return currentNode || null;
            }

            const content = renderContent();

            return h(
                VsResponsive,
                {
                    class: 'vs-index-view',
                    width: width.value,
                    grid: grid.value,
                },
                () => [content],
            );
        };
    },
});
</script>

<style src="./VsIndexView.css" />
