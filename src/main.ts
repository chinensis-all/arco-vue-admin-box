import { createApp } from 'vue';
import App from './App.vue';
import router, { initRemoteRoutes } from '@/router';
import { i18n } from '@/plugins/i18n';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import '@/styles/index.scss';
import { permission } from '@/directives/permission';

async function bootstrap() {
  await initRemoteRoutes();
  const app = createApp(App);
  app.use(router);
  app.use(i18n);
  app.use(ArcoVue);
  app.use(ArcoVueIcon);
  app.directive('permission', permission);
  app.mount('#app');
}
bootstrap();
