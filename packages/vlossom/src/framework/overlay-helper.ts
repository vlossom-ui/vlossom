import type { App } from 'vue';
import { createApp, h } from 'vue';
import OverlayWrapper from './OverlayWrapper.vue';

let overlayApp: App | null = null;

export function mountOverlayApp(parentApp: App) {
    if (overlayApp) {
        return;
    }

    const overlayContainer = document.createElement('div');
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

    // 3) 글로벌 프로퍼티 live 위임 ($vs, $t, $http 등)
    //    Vue의 PublicInstanceProxy가 globalProperties를 hasOwn으로 조회하므로
    //    own property로 보이게 하면서, parent에 나중에 추가되는 프로퍼티도 따라가도록 Proxy로 위임
    const overlayOwn = octx.config.globalProperties;
    octx.config.globalProperties = new Proxy(overlayOwn, {
        get(target, key, receiver) {
            if (Reflect.has(target, key)) {
                return Reflect.get(target, key, receiver);
            }
            return Reflect.get(pctx.config.globalProperties, key);
        },
        has(target, key) {
            return Reflect.has(target, key) || Reflect.has(pctx.config.globalProperties, key);
        },
        set(target, key, value, receiver) {
            return Reflect.set(target, key, value, receiver);
        },
        getOwnPropertyDescriptor(target, key) {
            return (
                Object.getOwnPropertyDescriptor(target, key) ??
                Object.getOwnPropertyDescriptor(pctx.config.globalProperties, key)
            );
        },
        ownKeys(target) {
            return Array.from(
                new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(pctx.config.globalProperties)]),
            );
        },
    });

    // 4) 에러/경고 핸들러 live 위임 (parent가 나중에 교체해도 따라감)
    Object.defineProperty(overlay.config, 'errorHandler', {
        configurable: true,
        enumerable: true,
        get: () => parent.config.errorHandler,
        set: () => {
            /* parent 위임이므로 overlay 자체 설정은 무시 */
        },
    });
    Object.defineProperty(overlay.config, 'warnHandler', {
        configurable: true,
        enumerable: true,
        get: () => parent.config.warnHandler,
        set: () => {
            /* parent 위임이므로 overlay 자체 설정은 무시 */
        },
    });
}
