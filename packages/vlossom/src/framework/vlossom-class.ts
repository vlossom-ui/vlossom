import {
    THEME_KEY,
    type GlobalColorSchemes,
    type GlobalStyleSets,
    type Theme,
    type VlossomOptions,
} from '@/declaration';
import { useOptionsStore } from '@/stores';
import {
    createToastPlugin,
    createModalPlugin,
    createConfirmPlugin,
    createPromptPlugin,
    type ToastPlugin,
    type ModalPlugin,
    type ConfirmPlugin,
    type PromptPlugin,
} from '@/plugins';

export class Vlossom {
    private _optionsStore = useOptionsStore();
    private _toast: ToastPlugin = createToastPlugin();
    private _modal: ModalPlugin = createModalPlugin();
    private _confirm: ConfirmPlugin = createConfirmPlugin(this._modal);
    private _prompt: PromptPlugin = createPromptPlugin(this._modal);

    constructor(options: VlossomOptions) {
        const { colorScheme = {}, styleSet = {}, theme = 'light', radiusRatio = 1 } = options;

        this._optionsStore.setColorScheme(colorScheme);
        this._optionsStore.setStyleSet(styleSet);
        this._optionsStore.setRadiusRatio(radiusRatio);

        this.setDefaultTheme(theme);
    }

    get toast(): ToastPlugin {
        return this._toast;
    }

    get modal(): ModalPlugin {
        return this._modal;
    }

    get confirm(): ConfirmPlugin {
        return this._confirm;
    }

    get prompt(): PromptPlugin {
        return this._prompt;
    }

    set colorScheme(colorScheme: GlobalColorSchemes) {
        this._optionsStore.setColorScheme(colorScheme);
    }

    get colorScheme(): GlobalColorSchemes {
        return this._optionsStore.colorScheme.value;
    }

    set styleSet(styleSet: GlobalStyleSets) {
        this._optionsStore.setStyleSet(styleSet);
    }

    get styleSet(): GlobalStyleSets {
        return this._optionsStore.styleSet.value;
    }

    set theme(theme: Theme) {
        this._optionsStore.setTheme(theme);
        document.documentElement.classList.toggle('vs-dark', theme === 'dark');
    }

    get theme(): Theme {
        return this._optionsStore.theme.value;
    }

    set radiusRatio(radiusRatio: number) {
        this._optionsStore.setRadiusRatio(radiusRatio);
    }

    get radiusRatio(): number {
        return this._optionsStore.radiusRatio.value;
    }

    public toggleTheme() {
        this.theme = this._optionsStore.theme.value === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, this.theme);
    }

    private setDefaultTheme(optionTheme: Theme = 'light') {
        const savedTheme = localStorage.getItem(THEME_KEY);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (savedTheme === 'dark' || (!savedTheme && mediaQuery.matches) || (!savedTheme && optionTheme === 'dark')) {
            this.theme = 'dark';
        }
    }
}
