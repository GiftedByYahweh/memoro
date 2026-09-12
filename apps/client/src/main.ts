import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';
import './css/main.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import i18n from './i18n';
import router from './router';

const app = createApp(App);

app.use(VueQueryPlugin);
app.use(i18n);
app.use(router);
app.mount('#app');
