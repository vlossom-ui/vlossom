import { getCurrentInstance } from 'vue';
import { store } from './stores';
import { utils } from './utils';

import type { App } from 'vue';
import type { VlossomOptions, VsPlugins } from '@/declaration';

export class Vlossom {
    private _plugins: Partial<VsPlugins>;
    private _darkThemeClass: string;

    constructor(options?: VlossomOptions) {
        this._plugins = {};
        const {
            colorScheme = {},
            styleSet = {},
            theme = 'light',
            darkThemeClass = '',
            detectOSTheme = false,
            radiusRatio = 1,
        } = options || {};

        this._darkThemeClass = darkThemeClass;
        this.theme = (this.getDefaultTheme(options) as 'light' | 'dark') || theme;

        store.option.setGlobalColorScheme(colorScheme);
        store.option.registerStyleSet(styleSet);
        if (utils.dom.isBrowser()) {
            this.theme = (this.getDefaultTheme(options) as 'light' | 'dark') || theme;
            store.option.setGlobalRadiusRatio(radiusRatio);
        }

        if (utils.dom.isBrowser() && detectOSTheme) {
            const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQueryList.addEventListener('change', (event) => {
                this.theme = event.matches ? 'dark' : 'light';
            });
        }
    }

    private getDefaultTheme(options?: VlossomOptions) {
        const savedTheme = localStorage.getItem('vlossom:theme');
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        if (savedTheme) {
            return savedTheme;
        } else if (options?.detectOSTheme && mediaQueryList.matches) {
            return 'dark';
        }

        return '';
    }

    get store() {
        return store;
    }

    get theme() {
        return store.option.getOptions().theme;
    }

    set theme(value) {
        store.option.setTheme(value);

        localStorage.setItem('vlossom:theme', value);
        document.body.classList.toggle('vs-dark', value === 'dark');
        if (this._darkThemeClass) {
            document.body.classList.toggle(this._darkThemeClass, value === 'dark');
        }
    }

    get colorScheme() {
        return store.option.getOptions().globalColorScheme;
    }

    set colorScheme(colorScheme) {
        store.option.setGlobalColorScheme(colorScheme);
    }

    get styleSets() {
        return store.option.getOptions().styleSets;
    }

    get radiusRatio() {
        return store.option.getOptions().globalRadiusRatio;
    }

    set radiusRatio(radiusRatio: number) {
        store.option.setGlobalRadiusRatio(radiusRatio);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
    }

    get plugins(): Readonly<Partial<VsPlugins>> {
        return this._plugins;
    }

    addPlugin<K extends keyof VsPlugins>(name: K, plugin: VsPlugins[K]) {
        this._plugins[name] = plugin;
    }
}

type VlossomProxy = Vlossom & {
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
    }) as VlossomProxy;

    return {
        install(app: App) {
            app.config.globalProperties.$vs = proxiedVlossom;
            utils.componentRegistry.registerComponents(app, options?.components);
        },
    };
}

function hasPlugin<K extends keyof VsPlugins>(
    vlossom: VlossomProxy,
    name: K,
): vlossom is VlossomProxy & { [P in K]: VsPlugins[P] } {
    return name in vlossom.plugins && vlossom.plugins[name] !== undefined;
}

function useVlossom(): VlossomProxy {
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

export { createVlossom, useVlossom, hasPlugin };

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $vs: VlossomProxy;
    }
}
