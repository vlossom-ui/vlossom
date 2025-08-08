<script lang="ts">
import { type Component, defineComponent, type PropType, h, toRefs } from 'vue';

export default defineComponent({
    name: 'VsRender',
    props: {
        content: {
            type: [String, Object] as PropType<string | Component>,
            required: true,
        },
        props: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({}),
            validator: (value: Record<string, any>, props: any) => {
                // content가 string이 아닌 경우에만 props가 유효
                if (typeof props.content === 'string') {
                    return true; // string인 경우 props는 무시되므로 항상 유효
                }
                // content가 컴포넌트인 경우 props는 객체여야 함
                return typeof value === 'object' && value !== null;
            },
        },
    },
    setup(props) {
        const { content, props: contentProps } = toRefs(props);

        const renderStringAsComponent = (htmlString: string) => {
            // HTML 태그가 없는 경우 텍스트만 렌더링
            if (!htmlString || !/<[^>]*>/.test(htmlString)) {
                return () => h('span', htmlString);
            }

            // HTML이 있는 경우 파싱하여 적절한 태그로 렌더링
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                const element = doc.body.firstElementChild;

                if (!element) {
                    return () => h('span', htmlString);
                }

                // 요소의 속성들을 객체로 변환
                const attributes: Record<string, any> = {};
                Array.from(element.attributes).forEach((attr) => {
                    attributes[attr.name] = attr.value;
                });

                return () => h(element.tagName.toLowerCase(), attributes, element.innerHTML);
            } catch {
                // 파싱 실패 시 텍스트 렌더링
                return () => h('span', htmlString);
            }
        };

        return () => {
            if (typeof content.value === 'string') {
                const componentFn = renderStringAsComponent(content.value);
                return componentFn();
            } else {
                return h(content.value, contentProps.value);
            }
        };
    },
});
</script>
