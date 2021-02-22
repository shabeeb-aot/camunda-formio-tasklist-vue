import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import router from './router';
import store from './store';
import Keycloak from 'keycloak-js';
import {authenticateFormio} from "@/services/formio-token";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


const initOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_KEYCLOAK_REALM ,
  clientId: process.env.VUE_APP_KEYCLOAK_CLIENT_ID ,
}
const STAFF_REVIEWER_ID = process.env.VUE_APP_REVIEWER_ROLE_ID
const STAFF_REVIEWER = process.env.VUE_APP_REVIEWER_ROLE

console.log(initOptions)
const ROLES = [
  {
    id: STAFF_REVIEWER_ID,
    title: STAFF_REVIEWER,
  },
];

const keycloak = Keycloak(initOptions);
keycloak.init({onLoad: 'login-required'}).then((auth) =>{
    console.log("got in")
    if(!auth) {
      window.location.reload();
    } else {
      console.log("authenticated");
    }

    const email = keycloak?.profile?.email
    const preferredUsername = keycloak?.profile?.username
    sessionStorage.setItem("username", preferredUsername)
    const KeycloakClient = process.env.VUE_APP_KEYCLOAK_CLIENT_ID


    if(keycloak.resourceAccess[KeycloakClient]) {
      const UserRoles = keycloak.resourceAccess[KeycloakClient].roles;
      let roles: any[] = [];
      for (let i = 0; i < UserRoles.length; i++) {
        const roleData = ROLES.find((x) => x.title === UserRoles[i]);
        if (roleData) {
          roles = roles.concat(roleData.id);
        }
      }

      authenticateFormio(email,roles);
    }
    
    else {
      console.log("Didnt generate formio token");
    }
  sessionStorage.setItem("vue-token", keycloak.token)
  sessionStorage.setItem("vue-refresh-token", keycloak.refreshToken)

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')


  setInterval(() =>{
    keycloak.updateToken(70).then((refreshed)=>{
      if (refreshed) {
        console.log('Token refreshed');
      } else {
        console.log('Token not refreshed, valid for '
        + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(()=>{
        console.error('Failed to refresh token');
    });
  }, 6000)

}).catch(() =>{
console.error("Authenticated Failed");
});
