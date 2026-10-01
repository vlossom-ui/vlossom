import type { App } from 'vue';
import 'vlossom/styles';

type VlossomInstance = ReturnType<(typeof import('vlossom'))['useVlossom']>;

let app: App | undefined;
let vlossom: VlossomInstance | undefined;
let ready: Promise<void> | undefined;

export function attachVlossom(target: App): void {
    app = target;
}

// vlossom은 import될 때 document에 이벤트를 걸고, createVlossom에서 localStorage와 matchMedia를 읽는다.
// 그래서 SSR에서는 부르지 않고, 브라우저에서 첫 데모가 필요할 때 한 번만 불러온다.
// 스타일은 정적으로 둔다. VitePress가 CSS를 한 파일로 묶어서(cssCodeSplit: false) 지연 로드해도 모든 페이지가 받는다.
async function loadVlossom(): Promise<void> {
    if (!app) {
        throw new Error('Vlossom is not attached to the app.');
    }
    const { createVlossom, useVlossom, VlossomComponents } = await import('vlossom');
    app.use(createVlossom({ components: VlossomComponents }));
    vlossom = useVlossom();
    // VitePress는 다크 모드를 html.dark로 표시한다. createVlossom이 OS 설정으로 정한 테마를 바로 맞춘다.
    syncVlossomTheme(document.documentElement.classList.contains('dark'));
}

// 브라우저는 같은 문서에서 가져오기에 실패한 모듈을 다시 받지 않으므로, 실패해도 다시 시도하지 않는다.
export function whenVlossomReady(): Promise<void> {
    ready ??= loadVlossom();
    return ready;
}

export function syncVlossomTheme(isDark: boolean): void {
    if (vlossom) {
        vlossom.theme = isDark ? 'dark' : 'light';
    }
}
