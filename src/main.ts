import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router';
import store from './store';
import VueMoment from 'vue-moment'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueMoment)


  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
