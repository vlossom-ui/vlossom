<script lang="ts">
import { defineComponent, h, KeepAlive, toRefs, Comment, type VNode } from 'vue';
import { VsComponent } from '@/declaration';
import { getResponsiveProps } from '@/props';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';

const name = VsComponent.VsIndexView;

export default defineComponent({
    name,
    props: {
        ...getResponsiveProps(),
        keepAlive: { type: Boolean, default: true },
        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue'],
    setup(props, { slots, emit, expose }) {
        const { width, grid, modelValue, keepAlive } = toRefs(props);

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

        expose({ updateIndex });

        return () => {
            if (!slots.default) {
                return null;
            }

            const slotNodes = slots.default();
            if (!slotNodes || slotNodes.length === 0) {
                return null;
            }

            const filteredNodes = filterUselessNodes(slotNodes);
            if (filteredNodes.length === 0) {
                return null;
            }

            const currentIndex = modelValue.value || 0;

            function renderContent() {
                if (keepAlive.value) {
                    return h(KeepAlive, {}, [
                        h(
                            'div',
                            { class: 'vs-index-view-container' },
                            filteredNodes.map((node, index) =>
                                h(
                                    'div',
                                    {
                                        key: index,
                                        style: {
                                            display: index === currentIndex ? 'block' : 'none',
                                        },
                                    },
                                    [node],
                                ),
                            ),
                        ),
                    ]);
                } else {
                    const currentNode = filteredNodes[currentIndex];
                    return currentNode || null;
                }
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
