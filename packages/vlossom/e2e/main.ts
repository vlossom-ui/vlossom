import { createApp } from 'vue';
import App from '@/components/vs-modal/__e2e__/App.vue';
import { createVlossom } from '@/framework';
import { VlossomComponents } from '@/components/component-map';
import '@/styles/index.css';
import '@/styles/index.scss';

createApp(App)
    .use(
        createVlossom({
            components: VlossomComponents,
        }),
    )
    .mount('#app');
