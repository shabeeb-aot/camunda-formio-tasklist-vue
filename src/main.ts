import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router';
import store from './store';


Vue.config.productionTip = false;

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
