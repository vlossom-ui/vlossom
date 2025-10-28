import type { App } from 'vue';
import { createApp, h } from 'vue';
import OverlayWrapper from './OverlayWrapper.vue';

let overlayApp: App | null = null;
let overlayContainer: HTMLElement | null = null;

export function mountOverlayApp(parentApp: App) {
    if (overlayApp) {
        return;
    }

    overlayContainer = document.createElement('div');
    overlayContainer.id = 'vs-overlay-container';
    overlayContainer.style.position = 'absolute';
    overlayContainer.style.top = '0';
    overlayContainer.style.left = '0';
    overlayContainer.style.width = '0';
    overlayContainer.style.height = '0';
    document.body.appendChild(overlayContainer);

    overlayApp = createApp({
        name: 'OverlayApp',
        setup() {
            return () => h(OverlayWrapper);
        },
    });

    inheritAppContext(parentApp, overlayApp);

    // 마운트
    overlayApp.mount(overlayContainer);
}

export function unmountOverlayApp() {
    if (overlayApp && overlayContainer) {
        overlayApp.unmount();
        overlayContainer.remove();
        overlayContainer = null;
        overlayApp = null;
    }
}

export function inheritAppContext(parent: App, overlay: App) {
    const pctx = (parent as any)?._context;
    const octx = (overlay as any)?._context;
    if (!octx || !pctx) {
        return;
    }

    // 1) 전역 컴포넌트/디렉티브 레지스트리 체이닝
    //    overlay에서 못 찾으면 parent 레지스트리에서 조회됨
    octx.components = Object.create(pctx.components);
    octx.directives = Object.create(pctx.directives);

    // 2) provide/inject 체이닝
    octx.provides = Object.create(pctx.provides);

    // 3) 글로벌 프로퍼티 체이닝 ($t, $http 등)
    //    setPrototypeOf로 parent의 글로벌을 상속받게 함
    Object.setPrototypeOf(overlay.config.globalProperties, parent.config.globalProperties);

    // 4) 컴파일러 옵션/핸들러 등 필요한 것만 복사 (선택)
    overlay.config.errorHandler = parent.config.errorHandler;
    overlay.config.warnHandler = parent.config.warnHandler;
}
