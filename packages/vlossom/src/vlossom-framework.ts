import { getCurrentInstance } from 'vue';
import { utils } from './utils';
import { OptionStore, OverlayCallbackStore } from './stores';

import type { App } from 'vue';
import type { StyleSet, VlossomOptions } from '@/declaration';

interface VsStores {
    option: OptionStore;
    overlay: OverlayCallbackStore;
    // TODO: modal, toast 스토어 추가 예정
    // modal: OverlayStackStore<VsModalOptions>;
    // toast: OverlayStackStore<VsToastInfo>;
}

// TODO: plugin type이 정의되면 추가할 예정
interface VsPlugins {}

export class Vlossom {
    private _stores: Partial<VsStores>;
    private _plugins: Partial<VsPlugins>;
    private readonly _darkThemeClass: string;

    constructor(options?: VlossomOptions) {
        this._plugins = {};
        this._stores = {
            option: new OptionStore(),
            overlay: new OverlayCallbackStore(),
        };
        this._darkThemeClass = options?.darkThemeClass || '';

        this.initialize(options);
    }

    private get storesProxy(): VsStores {
        return new Proxy(this._stores, {
            get: (target, prop) => {
                const store = target[prop as keyof VsStores];
                if (store === undefined) {
                    throw new Error(`Store '${String(prop)}' is not registered`);
                }
                return store;
            },
        }) as VsStores;
    }

    private initialize(options?: VlossomOptions) {
        const {
            colorScheme = {},
            styleSet = {},
            theme = 'light',
            detectOSTheme = false,
            radiusRatio = 1,
        } = options || {};

        this.storesProxy.option.setGlobalColorScheme(colorScheme);
        this.storesProxy.option.registerStyleSet(styleSet);

        if (utils.dom.isBrowser()) {
            this.theme = (this.getDefaultTheme(options) as 'light' | 'dark') || theme;
            this.storesProxy.option.setGlobalRadiusRatio(radiusRatio);

            if (detectOSTheme) {
                this.setupThemeDetection();
            }
        }
    }

    private setupThemeDetection() {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryList.addEventListener('change', (event) => {
            this.theme = event.matches ? 'dark' : 'light';
        });
    }

    private getDefaultTheme(options?: VlossomOptions): string {
        const savedTheme = localStorage.getItem('vlossom:theme');
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

        if (savedTheme) {
            return savedTheme;
        } else if (options?.detectOSTheme && mediaQueryList.matches) {
            return 'dark';
        }

        return '';
    }

    // Public API
    get stores(): VsStores {
        return this.storesProxy;
    }

    get plugins(): Readonly<Partial<VsPlugins>> {
        return { ...this._plugins };
    }

    get theme(): string {
        return this.storesProxy.option.options.theme;
    }

    set theme(value: 'light' | 'dark') {
        this.storesProxy.option.setTheme(value);
        localStorage.setItem('vlossom:theme', value);
        document.body.classList.toggle('vs-dark', value === 'dark');

        if (this._darkThemeClass) {
            document.body.classList.toggle(this._darkThemeClass, value === 'dark');
        }
    }

    get colorScheme() {
        return this.storesProxy.option.options.globalColorScheme;
    }

    set colorScheme(colorScheme) {
        this.storesProxy.option.setGlobalColorScheme(colorScheme);
    }

    get styleSets() {
        return this.storesProxy.option.options.styleSets;
    }

    get radiusRatio() {
        return this.storesProxy.option.options.globalRadiusRatio;
    }

    set radiusRatio(radiusRatio: number) {
        this.storesProxy.option.setGlobalRadiusRatio(radiusRatio);
    }

    toggleTheme(): void {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
    }

    registerStyleSet(styleSet: StyleSet): void {
        this.storesProxy.option.registerStyleSet(styleSet);
    }

    addStore<K extends keyof VsStores>(name: K, store: VsStores[K]): void {
        this._stores[name] = store;
    }

    hasStore<K extends keyof VsStores>(name: K): this is Vlossom & { stores: { [P in K]: VsStores[P] } } {
        return name in this._stores && this._stores[name] !== undefined;
    }

    addPlugin<K extends keyof VsPlugins>(name: K, plugin: VsPlugins[K]): void {
        this._plugins[name] = plugin;
    }

    hasPlugin<K extends keyof VsPlugins>(name: K): this is Vlossom & { [P in K]: VsPlugins[P] } {
        return name in this._plugins && this._plugins[name] !== undefined;
    }
}

type VlossomApp = Vlossom & {
    [K in keyof VsPlugins]: VsPlugins[K] extends undefined ? never : VsPlugins[K];
};

function createVlossom(options?: VlossomOptions) {
    const vlossom = new Vlossom(options);
    const proxiedVlossom = new Proxy(vlossom, {
        get(target, prop) {
            if (prop in target.plugins) {
                const plugin = target.plugins[prop as keyof VsPlugins];
                if (plugin === undefined) {
                    throw new Error(`Plugin '${String(prop)}' is not registered`);
                }
                return plugin;
            }
            return target[prop as keyof Vlossom];
        },
    }) as VlossomApp;

    return {
        install(app: App) {
            app.config.globalProperties.$vs = proxiedVlossom;
            utils.componentRegistry.registerComponents(app, options?.components);
        },
    };
}

function useVlossom(): VlossomApp {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useVlossom() must be called inside a component setup function');
    }

    const vlossom = instance.appContext.app.config.globalProperties.$vs;
    if (!vlossom) {
        throw new Error('Vlossom plugin is not installed');
    }

    return vlossom;
}

export { createVlossom, useVlossom };

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $vs: VlossomApp;
    }
}
