// 创建vue实例
import Vue from "vue";
import App from "./App.vue";
import createRouter from "./router";
import createStore from "./store";
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';

export default function createApp() {
  Vue.use(ElementUI);
  Vue.prototype.axios = axios;
  const router = createRouter();
  const store = createStore();
  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });
  return { app, router, store };
}
