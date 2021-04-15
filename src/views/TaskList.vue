<template>
  <div v-if="token">
    <CamundaTasklist
      :bpmApiUrl="configs.BPM_URL"
      :token="token"
      :userName="configs.username"
      :formIOApiUrl= "configs.FORM_IO_API_URL"
      :formIOResourceId = "configs.FORM_IO_RESOURCE_ID"
      :formIOReviewerId = "configs.FORM_IO_REVIEWER_ID"
      :formIOReviewer = "configs.FORM_IO_REVIEWER"
      :formsflowaiUrl="configs.FORM_FLOW_URL"
      :formsflowaiApiUrl="configs.FORM_FLOW_API_URL"
      v-if="isServiceFLowEnabled"
    />
    <div class="no-content" v-else>You shouldnot be here !!!</div>
  </div>
</template>


<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator'
import CamundaTasklist from '@/components/TaskList.vue'
import { State } from 'vuex-class'
// import configMap from '../utils/config-helper'
@Component({
  components: {
    CamundaTasklist
  }
})
export default class TaskList extends Vue {
  public  configs = {
    "BPM_URL": "https://bpm2.aot-technologies.com/camunda",
    "FORM_IO_API_URL": "https://forms2.aot-technologies.com",
    "FORM_IO_RESOURCE_ID": "5ff402c9f565ca0976bf6322",
    "FORM_IO_REVIEWER_ID": "5ff402c9f565ca0976bf6322",
    "FORM_IO_REVIEWER": "formsflow-reviewer",
    "userName" : "nancy-smith",
    "FORM_FLOW_API_URL":"http://207.216.46.114:5000",
    "FORM_FLOW_URL":"http://localhost:4000",
    "SERVICEFLOW_ENABLED": true
  }

  public isServiceFLowEnabled = true
  public jwttoken: any = false


  get token () {
    return this.jwttoken
  }
  
  async getToken () {    
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('username', 'nancy-smith')
    params.append('password', 'aot123')
    params.append('client_id', 'forms-flow-web')

    const url = "https://iam.aot-technologies.com/auth/realms/forms-flow-ai-test/protocol/openid-connect/token"
    await axios.post(url, params, config)
      .then((result: any) => {
        // Do somthing
        console.log(result,'<<<<<<================res=====', result.data.access_token)
        this.jwttoken =  result.data.access_token;
      })
  }

  created() {
    this.getToken();
  }


  mounted () {
    // this.token = sessionStorage.getItem('token')
    this.isServiceFLowEnabled = true
    this.getToken()
    //this.token()
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