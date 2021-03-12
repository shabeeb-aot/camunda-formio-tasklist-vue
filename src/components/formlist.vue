<template>
  <b-container fluid>
    <h5> Form</h5>
    <b-table :items="formList" :fields="fields" no-provider-paging="true">
    </b-table>
    </b-container>
</template>

<script lang="ts">
import CamundaRest from '../services/camunda-rest'
import { Component, Vue } from 'vue-property-decorator'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

@Component
export default class FormList extends Vue{
  private formList: Array<object> = []
  private actualFormNames = []
  private fields = [
      "formName",
      "Operations"
  ]

  created() {
      CamundaRest.listForms(localStorage.getItem('authToken'), localStorage.getItem('bpmApiUrl')).then((response) =>
      {
          this.formList = response.data;
      });
  }
}
</script>