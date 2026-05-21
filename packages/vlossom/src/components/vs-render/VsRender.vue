<script lang="ts">
import { defineComponent, h, toRefs, type Component, type PropType } from 'vue';
import { VsComponent } from '@/declaration';

const componentName = VsComponent.VsRender;
export default defineComponent({
    name: componentName,
    props: {
        content: {
            type: [String, Object, Function] as PropType<string | Component>,
            required: true,
        },
        componentProps: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({}),
        },
    },
    setup(props) {
        const { content, componentProps } = toRefs(props);

        // 요소를 재귀적으로 렌더링하는 함수 (최상위부터)
        function renderElement(element: Element) {
            // 요소의 속성들을 객체로 변환
            const attributes: Record<string, any> = {};
            Array.from(element.attributes).forEach((attr) => {
                attributes[attr.name] = attr.value;
            });

            // 하위 노드들을 처리
            const children: any[] = [];
            Array.from(element.childNodes).forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.textContent?.trim();
                    if (text) {
                        children.push(text);
                    }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    children.push(renderElement(child as Element));
                }
            });

            return h(element.tagName.toLowerCase(), attributes, children);
        }

        function renderStringAsComponent(htmlString: string) {
            // HTML 태그가 없는 경우 텍스트만 렌더링
            if (!htmlString || !/<[^>]*>/.test(htmlString)) {
                return () => h('span', null, htmlString);
            }
            // HTML이 있는 경우 파싱하여 적절한 태그로 렌더링
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString.trim(), 'text/html');
                const needRootElement = doc.body.childNodes.length > 1;
                if (needRootElement) {
                    return renderStringAsComponent(`<div>${htmlString}</div>`);
                }
                const element = doc.body.firstElementChild;

                if (!element) {
                    return () => h('span', null, htmlString);
                }

                return () => renderElement(element);
            } catch {
                // 파싱 실패 시 텍스트 렌더링
                return () => h('span', null, htmlString);
            }
        }

        return () => {
            if (typeof content.value === 'string') {
                const componentFn = renderStringAsComponent(content.value);
                return componentFn();
            }
            return h(content.value, componentProps.value);
        };
    },
});
</script>
