import { createApp } from 'vue';
import App from './App.vue';
import { createVlossom } from '@/framework';
import { VlossomComponents } from '@/components/component-map';

// component type 추론을 위해서 import
import '@/components';

// 실제 vlossom 사용할 때는 import 'vlossom/styles';
import '@/styles/index.css';
import '@/styles/index.scss';

console.log('Hello Vlossom');

const app = createApp(App);

app.use(
    createVlossom({
        components: VlossomComponents,
        styleSet: {
            playground: {
                VsDivider: {
                    variables: {
                        horizontal: {
                            margin: '1.5rem 0',
                        },
                    },
                },
            },
        },
    }),
);

app.mount('#app');
