import vueDevTools from 'vite-plugin-vue-devtools';
import { commonConfig } from './vite.config.common';

export const devConfig = {
    ...commonConfig,
    plugins: [...commonConfig.plugins, vueDevTools()],
};
