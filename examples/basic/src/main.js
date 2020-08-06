import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '/@voie/pages';
import App from './App.vue';
import './main.css';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App).use(router);

app.mount('#app');
