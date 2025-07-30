import { createApp } from 'vue';
import App from './App.vue';
import { createVlossom } from '@/framework';

const app = createApp(App);

app.use(createVlossom());

app.mount('#app');
