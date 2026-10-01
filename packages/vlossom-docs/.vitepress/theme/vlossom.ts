import type { App } from 'vue';
import 'vlossom/styles';

type VlossomInstance = ReturnType<(typeof import('vlossom'))['useVlossom']>;

let vlossom: VlossomInstance | undefined;

// vlossom은 import될 때 document에 이벤트를 걸고, createVlossom에서 localStorage와 matchMedia를 읽는다.
// SSR에서는 둘 다 없으므로 브라우저에서만 동적으로 불러온다.
export async function installVlossom(app: App): Promise<void> {
    const { createVlossom, useVlossom, VlossomComponents } = await import('vlossom');
    app.use(createVlossom({ components: VlossomComponents }));
    vlossom = useVlossom();
}

export function syncVlossomTheme(isDark: boolean): void {
    if (vlossom) {
        vlossom.theme = isDark ? 'dark' : 'light';
    }
}
