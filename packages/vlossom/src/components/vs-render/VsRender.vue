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
    },
    setup(props, { attrs }) {
        const { content } = toRefs(props);

        // 요소를 재귀적으로 렌더링하는 함수 (최상위부터)
        function renderElement(element: Element, isRoot: boolean = false) {
            // 요소의 속성들을 객체로 변환
            const attributes: Record<string, any> = {};
            Array.from(element.attributes).forEach((attr) => {
                attributes[attr.name] = attr.value;
            });

            // 최상위 엘리먼트인 경우 attrs를 병합
            if (isRoot) {
                Object.assign(attributes, attrs);
            }

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
                return () => h('span', attrs, htmlString);
            }

            // HTML이 있는 경우 파싱하여 적절한 태그로 렌더링
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                const element = doc.body.firstElementChild;

                if (!element) {
                    return () => h('span', attrs, htmlString);
                }

                return () => renderElement(element, true);
            } catch {
                // 파싱 실패 시 텍스트 렌더링
                return () => h('span', attrs, htmlString);
            }
        }

        return () => {
            if (typeof content.value === 'string') {
                const componentFn = renderStringAsComponent(content.value);
                return componentFn();
            }
            return h(content.value, attrs);
        };
    },
});
</script>
