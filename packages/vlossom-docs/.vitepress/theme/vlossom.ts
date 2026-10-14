import type { ColorScheme } from 'vlossom';
import { shallowRef, watch, type App, type Component, type Ref, type WatchStopHandle } from 'vue';
import 'vlossom/styles';
import type { StyleSetValue } from './style-set-input.ts';

type VlossomInstance = ReturnType<(typeof import('vlossom'))['useVlossom']>;

let app: App | undefined;
let ready: Promise<void> | undefined;
const vlossom = shallowRef<VlossomInstance>();

export const vlossomColors = shallowRef<readonly ColorScheme[]>([]);
export const defaultColorScheme = shallowRef<ColorScheme>();

export const DOCS_STYLE_SET = 'vlossom-docs';
export const styleSetComponents = shallowRef<readonly string[]>([]);
// VsModal은 VsModalNode로 그려지고, 전역 style-set도 VsModalNode 이름으로 찾는다.
export const STYLE_SET_NAMES: Readonly<Record<string, string>> = { VsModal: 'VsModalNode' };

type ComponentWithProps = Component & { props?: Record<string, object> };

function styleSetProp(component: Component): object | undefined {
    return (component as ComponentWithProps).props?.styleSet;
}

// vlossom의 전역 style-set은 컴포넌트가 style-set="이름"으로 고를 때만 걸린다.
export function withDocsStyleSet(components: Record<string, Component>): Record<string, Component> {
    return Object.fromEntries(
        Object.entries(components).map(([name, component]) => {
            const styleSet = styleSetProp(component);
            if (!styleSet) {
                return [name, component];
            }
            const definition =
                typeof styleSet === 'function' || Array.isArray(styleSet) ? { type: styleSet } : styleSet;
            const props = {
                ...(component as ComponentWithProps).props,
                styleSet: { ...definition, default: DOCS_STYLE_SET },
            };
            return [name, { ...component, props }];
        }),
    );
}

export function attachVlossom(target: App): void {
    app = target;
}

// vlossom은 import될 때 document에 이벤트를 걸고, createVlossom에서 localStorage와 matchMedia를 읽어 SSR에서 부를 수 없다.
async function loadVlossom(): Promise<void> {
    if (!app) {
        throw new Error('Vlossom is not attached to the app.');
    }
    const { COLORS, createVlossom, useVlossom, VlossomComponents } = await import('vlossom');
    app.use(createVlossom({ components: withDocsStyleSet(VlossomComponents) }));
    styleSetComponents.value = [
        ...new Set(
            Object.keys(VlossomComponents)
                .filter((name) => styleSetProp((VlossomComponents as Record<string, Component>)[name]))
                .map((name) => STYLE_SET_NAMES[name] ?? name),
        ),
    ];
    const instance = useVlossom();
    instance.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    vlossom.value = instance;
    vlossomColors.value = COLORS;
}

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

export function setDemoStyleSet(styleSet: StyleSetValue | undefined): void {
    if (vlossom.value) {
        const { [DOCS_STYLE_SET]: _previous, ...others } = vlossom.value.styleSet;
        vlossom.value.styleSet = styleSet ? { ...others, [DOCS_STYLE_SET]: styleSet } : others;
    }
}
