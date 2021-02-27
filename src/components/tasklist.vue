<template>

  <b-container fluid>
    <b-row class="text-left" align-v="start">
      <b-col cols="4">
          <b-list-group  v-if="tasks && tasks.length" class="service-task-list">   
          <div class="filter-container">
                <input type="text" class="filter" placeholder="Filter Tasks"/>
                {{tasks.length}}
          </div>
            <b-list-group-item button v-for="(task, idx) in tasks" v-bind:key="task.id" 
                v-on:click="toggle(idx)"
                :class="{'selected': idx == activeIndex}">
                <div @click="setselectedTask(task.id)" class="routercss">
                  <b-row>
                    <div class="col-12">
                      <h5>
                        {{ task.name }}
                      </h5>
                      <br>
                    </div>
                  </b-row>

                  <b-row class="task-row-2">
                    <div class="col-6 pr-0">
                    {{ getProcessDataFromList(getProcessDefinitions, task.processDefinitionId, 'name') }}         
                    </div>
                    <div title="Task assignee" class="col-6 pr-0 text-right">
                      {{task.assignee}}
                    </div>
                  </b-row>

                  <b-row class="task-row-3">
                    <b-col lg=8 xs=8 class="pr-0" title="task.created">
                      <div v-if="task.due">
                      Due in: {{ timedifference(task.due) }}
                      </div>
                      <div v-if="task.followUp">
                      Follow-up in: {{ timedifference(task.followUp) }} 
                      </div>
                      Created on: {{ timedifference(task.created) }}
                    </b-col>
                    <b-col lg=4 xs=4 sm=4 class="pr-0 text-right" title="priority">
                      {{ task.priority }}
                    </b-col>
                  </b-row>
                </div>
            </b-list-group-item>
        </b-list-group>

      </b-col>

      <b-col cols="8" v-if="selectedTask">
        <b-row class="ml-0 task-header"> {{task.name}}</b-row>
        <b-row class="ml-0 task-name">{{taskProcess}}</b-row>
        <b-row class="ml-0 task-name">PID #{{task.processInstanceId}}</b-row>
        
        <div>
        <b-row class="actionable">
            <div class="col-md-auto">
              <DatePicker 
              type="datetime"
              placeholder="Set Follow-up date"
              v-model="setFollowup"
              >
              </DatePicker>
              </div>
              <div class="col-md-auto">
                <DatePicker 
              type="datetime"
              placeholder="Set Due Date"
              v-model="setDue"
                >
                </DatePicker>
              </div>
            <div class="col-md">
            <b-button variant="outline-primary" v-b-modal.AddGroupModal><b-icon :icon="'grid3x3-gap-fill'"></b-icon> Add groups </b-button>
            
            <b-modal
            id="AddGroupModal"
            ref="modal"
            title="Manage Groups">
                <div class="modal-text">
                    <b-icon icon="exclamation-circle"></b-icon>
                    You can add a group by typing a group ID into the input field and afterwards clicking the button with the plus sign.
                    <b-row class="mt-3 mb-3">
                        <b-col>
                            <label class="add">Add a group</label>
                        </b-col>
                        <b-col>
                        <input type="text" placeholder="Group ID" v-model="setGroup">
                        </b-col>
                    </b-row>
                </div>
            </b-modal>
            </div>
            <div class="col-md">
            <b-col>
                 <b-button variant="outline-primary" v-if="task.assignee" @click="onUnClaim">
                   {{task.assignee}}
                   <b-icon :icon="'person-x-fill'"></b-icon>
                 </b-button>
                 <b-button variant="outline-primary" v-else @click="onClaim">
                   <b-icon :icon="'person-fill'"></b-icon>
                   Claim
                 </b-button>
              </b-col>
            </div>
        </b-row>

        <div>
            <b-tabs content-class="mt-3" id="service-task-details" v-if="showfrom">
              <b-tab title="Form">
                <div v-if="task.assignee" class="ml-4 mr-4">
                  <formio :src="formioUrl"
                  :submission="submissionId"
                  :form="formId"
                  :options="options"
                  >
                </formio>
                </div>
                <div v-else class="ml-4 mr-4">
                  <formio :src="formioUrl"
                  :submission="submissionId"
                  :form="formId"
                  :options="readoption"
                  >
                  </formio>
                </div>
              </b-tab>
              <b-tab title="History"></b-tab>
              <b-tab title="Diagram"></b-tab>
            </b-tabs>
          </div>
        </div>     
      </b-col>

      <b-col cols="8" v-else>
        <b-row class="not-selected mt-2 ml-1 row">
          <b-icon icon="exclamation-circle-fill" variant="secondary" scale="1"></b-icon>
       <p>Select a task in the list.</p>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Form } from 'vue-formio';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'
import moment from "moment";
import CamundaRest from '../services/camunda-rest';
import {authenticateFormio} from "../services/formio-token";

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import 'vue2-datepicker/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'formiojs/dist/formio.full.min.css'
// import './styles.scss';

@Component({
  components: {
    formio: Form,
    DatePicker
  }
})
export default class Tasklist extends Vue {
@Prop() private CamundaUrl !: string|any;
@Prop() private token !: string|any;
@Prop() private username !: string|any;
@Prop({default:'external'}) private userEmail !: string|any;
@Prop() private formIOUserRoles !: Array<string>;
@Prop() private formIOResourceId !: string|any;
@Prop() private formIOReviewerId !: string|any;
@Prop() private formIOReviewer !: string|any;
@Prop() private formIOProjectUrl!: string|any;

  private tasks: Array<object> = []
  private getProcessDefinitions: Record<string, any> = []
  private taskProcess = null
  private formId = ''
  private submissionId = '' 
  private formioUrl = ''
  private activeIndex = 0
  private task: any
  private setFollowup = null
  private setDue = null
  private setGroup = null
  private selectedTask: any = '' 
  private showfrom = false
  private readoption: any = {readOnly: true,}
  private options: any =  {
      noAlerts: false,
      i18n: {
        en: {
          error: "Please fix the errors before submitting again.",
        },
      }
    }

  timedifference(date: any) {
    return moment(date).fromNow();
  }

  getProcessDataFromList = (processList: any[],processId: any,dataKey: string) => {
    const process = processList.find(process=>process.id===processId);
    return process && process[dataKey] ;
  }

  getTaskFromList(tasks: any[], taskId: string){
      const task = tasks.find(task=>task.id==taskId);
      return task;
    }

    setselectedTask(task: any){
      this.selectedTask = task
       this.fetchData()
    }

  toggle(index: number) {
      this.activeIndex = index
    }

  getBPMTaskDetail(taskId: string) {
        CamundaRest.getTaskById(this.token, taskId, this.CamundaUrl).then((result) => {
          this.task = result.data;
        })
    }

  getBPMTasks(){
    CamundaRest.getTasks(this.token, this.CamundaUrl).then((result)=> {
      this.tasks = result.data;
    })
  }

  onClaim() {
    CamundaRest.claim(this.token,this.task.id, {userId: this.username}, this.CamundaUrl).then(()=> 
      {this.getBPMTaskDetail(this.task.id)
      this.getBPMTasks()
      }
    )
    .catch((error) => {
        console.log("Error", error);
    })
  }

  onUnClaim(){ 
    CamundaRest.unclaim(this.token ,this.task.id, this.CamundaUrl).then(()=> 
    {this.getBPMTaskDetail(this.task.id)
      this.getBPMTasks()
    }
    )
    .catch((error) =>{
      console.log("Error", error)
    })
  }


  fetchData() {
    
      if (this.selectedTask) {       
        this.task = this.getTaskFromList(this.tasks, this.selectedTask);
        CamundaRest.getTaskById(this.token, this.selectedTask, this.CamundaUrl).then((result) => {
          CamundaRest.getProcessDefinitionById(this.token, result.data.processDefinitionId, this.CamundaUrl).then((res) => {
          this.taskProcess = res.data.name;
        });
        })
        this.showfrom = false
        CamundaRest.getVariablesByTaskId(this.token, this.selectedTask, this.CamundaUrl)
        .then((result)=> {
            this.formioUrl = result.data["formUrl"].value;
            const domain = (this.formioUrl.split("://")[1]).split('/')[0]
            const replacedomain = this.formIOProjectUrl.split("//")[1]
            this.formioUrl = this.formioUrl.replace(domain, replacedomain)
            const formArr = this.formioUrl.split("/");
            this.formId = formArr[4];
            this.submissionId = formArr[6];
            this.showfrom = true
        });
      }
    }

  mounted() {
    authenticateFormio(this.formIOResourceId, this.formIOReviewerId, this.formIOReviewer,this.userEmail, this.formIOUserRoles)
    CamundaRest.getTasks(this.token, this.CamundaUrl).then((result) => {
      this.tasks = result.data;      
    }); 

    this.fetchData();
    
    CamundaRest.getProcessDefinitions(this.token, this.CamundaUrl).then((response) => {
        this.getProcessDefinitions = response.data;
    }); 
  }

}

</script>

<style>
  body {
  font-size: 16px;
  font-family: Nunito Sans, SemiBold;
  background-color: white !important;
}

.bg-default {
  background-color: #38598a;
  border: #38598a;
  color: white !important;
}

  #ul_top_hypers li {
    display: inline;
}
.not-selected{
  border: 3px solid #b3b3b3;
  padding: 10px;
  color: #b3b3b3;
  width: 100%;
}

.filter-container{
  border: 1px solid #555;
  border-radius: 5px;
  width: 100%;
  padding: 0;
  margin: 0 5px 10px 5px;
  font-size: 13px;
}

.filter{
  width: 85%;
  margin: 5px;
  border: none;
  font-style: italic;
}
.filter:focus{
  outline: none;
}

.task-row-2 {
  font-size: 15px;
}
.task-row-3 {
  font-size: 11px;
}

.service-task-list {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 25px;
  border-right: 2px solid #D0D0D0;
} 

#service-task-details {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.task-header {
  font-size: 30px;
  font-weight: 600;
}
.task-name {
  font-size: 20px;
  font-weight: 400;
}

.selected {
  border-left: 2px solid #003366 !important;
}

.actionable {
  color: #1a5a96;
  background-color: transparent;
  cursor: pointer;
  margin: 10px 0;
  font-size: 14px;
  font-weight: bold;
}

.routercss {
  color: #212529;
  text-align: left;
}
</style>