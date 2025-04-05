import { createApp } from 'vue';
import App from './App.vue';
import { createVlossom } from '@/vlossom-framework';

const app = createApp(App);
const vlossom = createVlossom();
app.use(vlossom);
app.mount('#app');
