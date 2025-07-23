import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createVlossom } from '@/main';

const app = createApp(App);

app.use(createPinia());
app.use(createVlossom());

app.mount('#app');
