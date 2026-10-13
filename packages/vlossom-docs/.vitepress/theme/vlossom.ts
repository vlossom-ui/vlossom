import type { ColorScheme } from 'vlossom';
import { shallowRef, watch, type App, type Ref, type WatchStopHandle } from 'vue';
import 'vlossom/styles';

type VlossomInstance = ReturnType<(typeof import('vlossom'))['useVlossom']>;

let app: App | undefined;
let ready: Promise<void> | undefined;
// 테마 감시(followVlossomTheme)는 vlossom을 불러오기 전에 시작하므로, 인스턴스가 생기는 것도 알 수 있게 ref로 둔다.
const vlossom = shallowRef<VlossomInstance>();

// DemoOptions는 이 목록이 채워진 뒤에만 나타난다. 서버 렌더와 vlossom을 불러오기 전에는 비어 있다.
export const vlossomColors = shallowRef<readonly ColorScheme[]>([]);
export const defaultColorScheme = shallowRef<ColorScheme>();

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
    const { COLORS, createVlossom, useVlossom, VlossomComponents } = await import('vlossom');
    app.use(createVlossom({ components: VlossomComponents }));
    const instance = useVlossom();
    // vlossom은 저장해 둔 자기 테마로 시작한다. 사이트 테마로 먼저 맞춘 뒤에 내보내야 테마 감시가 사이트 테마를 바꾸지 않는다.
    instance.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    vlossom.value = instance;
    vlossomColors.value = COLORS;
}

// 브라우저는 같은 문서에서 가져오기에 실패한 모듈을 다시 받지 않으므로, 실패해도 다시 시도하지 않는다.
export function whenVlossomReady(): Promise<void> {
    ready ??= loadVlossom();
    return ready;
}

// VsModal은 데모 컴포넌트가 사라져도 열어 둔 모달을 닫지 않아서, 다른 페이지로 가면 모달과 스크롤 잠금이 남는다(#670).
export function closeVlossomModals(): void {
    vlossom.value?.modal.clear();
}

export function syncVlossomTheme(isDark: boolean): void {
    if (vlossom.value) {
        vlossom.value.theme = isDark ? 'dark' : 'light';
    }
}

// VsThemeButton 데모는 vlossom 테마만 바꾼다. 사이트 테마가 따라가지 않으면 본문 배경만 어두워진다.
export function followVlossomTheme(isDark: Ref<boolean>): WatchStopHandle {
    return watch(
        () => vlossom.value?.theme,
        (theme) => {
            const dark = theme === 'dark';
            // VitePress의 isDark(useDark)는 시스템 테마와 같은 값을 쓰면 저장값을 auto로 바꾸므로, 다를 때만 쓴다.
            if (theme && isDark.value !== dark) {
                isDark.value = dark;
            }
        },
    );
}

export function setDefaultColorScheme(colorScheme: ColorScheme | undefined): void {
    if (vlossom.value) {
        const { default: _default, ...components } = vlossom.value.colorScheme;
        vlossom.value.colorScheme = colorScheme ? { ...components, default: colorScheme } : components;
        defaultColorScheme.value = colorScheme;
    }
}
