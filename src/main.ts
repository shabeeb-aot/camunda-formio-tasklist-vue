import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router';
import store from './store';
import {authenticateFormio} from "@/services/formio-token";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const STAFF_REVIEWER_ID = process.env.VUE_APP_REVIEWER_ROLE_ID
const STAFF_REVIEWER = process.env.VUE_APP_REVIEWER_ROLE

const ROLES = [
  {
    id: STAFF_REVIEWER_ID,
    title: STAFF_REVIEWER,
  },
];

//pass UserRoles and email as props
let roles: any[] = [];
for (let i = 0; i < UserRoles.length; i++) {
  const roleData = ROLES.find((x) => x.title === UserRoles[i]);
  if (roleData) {
    roles = roles.concat(roleData.id);
  }
}

authenticateFormio(email,roles);

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
