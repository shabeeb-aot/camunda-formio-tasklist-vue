<template>
  <div>
    <CamundaTasklist
      :bpmApiUrl="configs.BPM_URL"
      :token="token"
      :userName="user && user.username"
      :formIOUserRoles="configs.FORM_IO_USER_ROLES"
      :formIOApiUrl= "configs.FORM_IO_API_URL"
      :formIOResourceId = "configs.FORM_IO_RESOURCE_ID"
      :formIOReviewerId = "configs.FORM_IO_REVIEWER_ID"
      :formIOReviewer = "configs.FORM_IO_REVIEWER"
      :formsflowaiUrl="configs.FORM_FLOW_URL"
      :formsflowaiApiUrl="configs.FORM_FLOW_API_URL"
      :getTaskId="getTaskId"
      v-if="isServiceFLowEnabled"
    />
    <div class="no-content" v-else>You shouldnot be here !!!</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import CamundaTasklist from '@/components/TaskList.vue'
import { State } from 'vuex-class'
// import configMap from '../utils/config-helper'
@Component({
  components: {
    CamundaTasklist
  }
})
export default class TaskList extends Vue {
  @Prop() private getTaskId!: string;
  @State('user') private user!: any
  public token: any = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJZUktnVzA0QmJ4QUxpODQ1cy1DdjRURElkMkdZWDc2aHgzM2RIekFCUEZjIn0.eyJleHAiOjE2MTY1Mzc0NTgsImlhdCI6MTYxNjUzNzE1OCwiYXV0aF90aW1lIjoxNjE2NTM0NzI0LCJqdGkiOiI0OWIxYTk1Yy0wZjYyLTQxOTctOTA4Zi0wNzUzODhiYWU2NWUiLCJpc3MiOiJodHRwczovL2Rldi5vaWRjLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy92dGtheXE0YyIsImF1ZCI6WyJjZm1zLWRldiIsImNhbXVuZGEtcmVzdC1hcGkiLCJub3RpZmljYXRpb25zLWFwaSIsImZvcm1zLWZsb3ctd2ViIiwiYWNjb3VudCJdLCJzdWIiOiI1OTEzOTE1My00NmZmLTQ3N2QtYWY2Ni1iM2UzY2Q5MmQzZDUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJjZm1zLWRldi1zdGFmZiIsIm5vbmNlIjoiZWUxZmYyZjYtZTQyOS00YTBjLThmMGQtNjc5OGNmOGI2MTU5Iiwic2Vzc2lvbl9zdGF0ZSI6ImYzMzY3YzM1LWEzMjUtNGNlYi1hZTgwLTI0NWIzY2VhYzBhMSIsImFjciI6IjAiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImludGVybmFsX3VzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJmb3Jtcy1mbG93LXdlYiI6eyJyb2xlcyI6WyJmb3Jtc2Zsb3ctcmV2aWV3ZXIiLCJmb3Jtc2Zsb3ctZGVzaWduZXIiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGNhbXVuZGEtcmVzdC1hcGkgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiR0EgRGVtbyIsInByZWZlcnJlZF91c2VybmFtZSI6ImRlbW9nYSIsImdpdmVuX25hbWUiOiJHQSIsImZhbWlseV9uYW1lIjoiRGVtbyIsInVzZXJuYW1lIjoiZGVtb2dhIn0.R_OveI-67dp17Vd1luk51xRW_SEo53J3WdHhWBDijqidi2M88V7MWka73KMlAZej9nPWnlTn3pdoOW_Jz07xKQYznlppl-UfVgYFeAXVxr_gzNs05eFMHIkl7pePwgcyTDuCsKaU6R2rc0DkLYdVvl11xKs90Wqil6mplm8Q0PykWatr3oHP2LLuD8OJ6dgV73TfNbIWY_VNAHKXtzOarIguudp7jHKZ9BBj5gZC6XGa42Gd1Fvhgy8xHJkY1fq9_83pzcHwCLrBzpiKwezaBWJtG4_z6sSdWmTUAU7IOMBLIUvW_mNAr4cR206dKBQUiYfkEYGCEcI4JMHzdp-ntw'//sessionStorage.getItem('token')
  public  configs = {
    "BPM_URL": "https://dev-sbc-ffa-bpm.apps.silver.devops.gov.bc.ca/camunda",
    "FORM_IO_USER_ROLES": "formsflow-reviewer",
    "FORM_IO_API_URL": "https://dev-sbc-ffa-forms.apps.silver.devops.gov.bc.ca",
    "FORM_IO_RESOURCE_ID": "601f0527c716d313bc266919",
    "FORM_IO_REVIEWER_ID": "604be2f34c71022e29c03603",
    "FORM_IO_REVIEWER": "formsflow-reviewer",
    "FORM_FLOW_API_URL":"https://dev-sbc-serviceflow.apps.silver.devops.gov.bc.ca/api",
    "FORM_FLOW_URL":"https://dev-sbc-serviceflow.apps.silver.devops.gov.bc.ca",
    "SERVICEFLOW_ENABLED": true
  }
  public isServiceFLowEnabled = true
  mounted () {
    // this.token = sessionStorage.getItem('token')
    this.isServiceFLowEnabled = true
  }
}
</script>

<style scoped>
.no-content {
    display: flex;
    justify-content: center;
    font-size: 18px;
}
</style>
