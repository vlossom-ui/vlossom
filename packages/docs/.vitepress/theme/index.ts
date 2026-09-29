import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'vlossom/styles';
import './demo.css';

// vlossom은 import 시점에 document를 건드린다(오버레이 키 이벤트 리스너).
// 그래서 정적 import를 쓰면 VitePress의 SSR 렌더 단계에서 터진다.
// 데모는 전부 <ClientOnly> 안에 있으므로 컴포넌트 등록도 클라이언트로 미룬다.
export default {
    extends: DefaultTheme,
    async enhanceApp({ app }) {
        if (import.meta.env.SSR) {
            return;
        }

        const { createVlossom, VlossomComponents } = await import('vlossom');
        app.use(createVlossom({ components: VlossomComponents }));
    },
} satisfies Theme;
