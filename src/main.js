import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Router from './router'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import './remixicon/remixicon.css'
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

createApp(App)
  .use(createPinia())
  .use(Router)
  .mount('#app')
