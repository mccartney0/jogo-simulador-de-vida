import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import { i18n } from './ui/i18n';
import './ui/styles/ui.css';
import './ui/styles/variables.css';
import { registerSW } from './game/pwa/swClient';

const app = createApp(App);
app.use(createPinia());
app.use(i18n);
app.mount('#app');

registerSW();
