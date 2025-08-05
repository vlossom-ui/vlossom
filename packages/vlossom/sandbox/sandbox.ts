import { createApp } from 'vue';
import App from './App.vue';
import { createVlossom } from '@/framework';

// this will be replaced with "import 'vlossom/styles'"
import '@/styles/index.css';
import '@/styles/index.scss';

console.log('Hello Vlossom');

const app = createApp(App);

app.use(createVlossom());

app.mount('#app');
