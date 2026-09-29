import { shallowRef, type App } from 'vue';

// vlossom은 import 시점에 document를 건드린다(오버레이 키 이벤트 리스너).
// 그래서 정적 import를 쓰면 VitePress의 SSR 렌더 단계에서 터진다.
// 여기서 동적으로 한 번만 불러오고, 만들어진 인스턴스를 모듈에 들고 있는다.
//
// inject 기반의 useVlossom()을 쓰지 않는 이유: 그 함수는 setup 안에서만 부를 수 있는데,
// 설치가 비동기라 컴포넌트 setup 시점에 아직 준비되지 않았을 수 있다.

interface VlossomInstance {
    theme: 'light' | 'dark';
    colorScheme: Record<string, string>;
}

let instance: VlossomInstance | null = null;

export const colors = shallowRef<readonly string[]>([]);

export async function installVlossom(app: App): Promise<void> {
    const vlossom = await import('vlossom');

    colors.value = vlossom.COLORS;

    // createVlossom은 { install } 플러그인 객체를 돌려준다. 실제 인스턴스는 useVlossom이 준다.
    // useVlossom은 inject가 아니라 모듈 싱글턴을 읽으므로 setup 밖에서도 부를 수 있다.
    app.use(vlossom.createVlossom({ components: vlossom.VlossomComponents }));
    instance = vlossom.useVlossom() as unknown as VlossomInstance;

    startThemeSync();
}

// VitePress의 다크 모드는 html.dark를, vlossom은 html.vs-dark를 본다. 둘을 잇는다.
//
// VitePress 2의 useData()는 더 이상 isDark를 주지 않아서 watch로는 잡을 수 없다.
// html 클래스를 직접 관찰하면 VitePress 버전이 바뀌어도 깨지지 않는다.
export function startThemeSync(): void {
    if (typeof document === 'undefined') {
        return;
    }

    const root = document.documentElement;
    const sync = () => {
        const dark = root.classList.contains('dark');
        if (instance) {
            instance.theme = dark ? 'dark' : 'light';
        } else {
            root.classList.toggle('vs-dark', dark);
        }
    };

    sync();
    new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
}

export function applyColorScheme(color: string | null): void {
    if (instance) {
        instance.colorScheme = color ? { default: color } : {};
    }
}
