<template>
    <b-container fluid class="camunda-tasklist-main">
        <b-row class="text-left" align-v="start">
            <!-- <b-col class="pl-0" lg="2" xs="12" sm="6" md="2" xl="2">
                <TaskFilter :filters="filterList"></TaskFilter>
            </b-col> -->
            <b-col lg="4" xs="12" sm="6" md="4" xl="4" class="pl-0" v-if="tasks && tasks.length">
                <b-list-group  class="service-task-list">   
                <div class="filter-container">
                    <input type="text" class="filter" placeholder="Filter Tasks"/>
                        {{tasks.length}}
                </div>
                <b-list-group-item button v-for="(task, idx) in tasks" v-bind:key="task.id" 
                    v-on:click="toggle(idx)"
                    :class="{'selected': idx == activeIndex}">
                    <div @click="setselectedTask(task.id)" class="select-task">
                        <b-row>
                        <div class="col-12">
                        <h5>{{ task.name }}</h5>
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

            <b-col lg="4" xs="12" sm="6" md="4" xl="4" v-else>
              <b-row class="not-selected mt-2 ml-1 row">
                <b-icon icon="exclamation-circle-fill" variant="secondary" scale="1"></b-icon>
                <p>No tasks found in the list.</p>
              </b-row>
            </b-col>


      <b-col cols="8"  lg="8" xs="12" sm="12" md="8" xl="8" v-if="selectedTask" class="pl-0">
        <div class="service-task-details">
        <b-row class="ml-0 task-header"> {{task.name}}</b-row>
        <b-row class="ml-0 task-name">{{taskProcess}}</b-row>
        <b-row class="ml-0 task-name" title="process-instance-id">Application # {{ task.processInstanceId }}</b-row>
        
        <div>
        <b-row class="actionable">
            <b-col>
              <DatePicker 
              type="datetime"
              placeholder="Set Follow-up date"
              v-model="setFollowup"
              >
              </DatePicker>
            </b-col>
              <b-col>
                <DatePicker 
              type="datetime"
              placeholder="Set Due Date"
              v-model="setDue"
                >
                </DatePicker>
              </b-col>
            <b-col>
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
            </b-col>
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
        </b-row>

        <div>
            <b-tabs content-class="mt-3" v-if="showfrom">
              <b-tab title="Form">
                <div v-if="task.assignee" class="ml-4 mr-4">
                  <formio :src="formioUrl"
                  :submission="submissionId"
                  :form="formId"
                  :options="options"
                  >
                </formio>
                </div>
                <div v-else class="ml-4 mr-4 formio-form-overlay">
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import TaskFilter from './tasklist-filter.vue';
import {authenticateFormio} from "../services/formio-token";
import {getFormDetails} from "../services/get-formio";
import moment from "moment";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'formiojs/dist/formio.full.min.css'
import '../camundaFormIOTasklist.scss'
import 'vue2-datepicker/index.css';

@Component({
    components: {
        formio: Form,
        DatePicker,
        TaskFilter
    }
})
export default class Tasklist extends Vue {
@Prop() private CamundaUrl !: string;
@Prop() private token !: string;
@Prop() private userName !: string;
@Prop({default:'external'}) private userEmail !: string;
@Prop() private formIOUserRoles !: Array<string>;
@Prop() private formIOResourceId !: string;
@Prop() private formIOReviewerId !: string;
@Prop() private formIOReviewer !: string;
@Prop() private formIOProjectUrl!: string;
// put a console warning if any params not passed

private tasks: Array<object> = []
private getProcessDefinitions: Array<object> = []
private taskProcess = null
private formId = ''
private submissionId = '' 
private formioUrl = ''
private activeIndex = 0
private task: any
private setFollowup = null
private setDue = null
private setGroup = null
private selectedTask = '' 
private showfrom = false
private readoption = {readOnly: true,}
private options =  {
    noAlerts: false,
    i18n: {
        en: {
            error: "Please fix the errors before submitting again.",
        },
    }
}
private filterList = []



timedifference(date: Date) {
    return moment(date).fromNow();
}

getProcessDataFromList(processList: any[] ,processId: any,dataKey: string){
    const process = processList.find(process=>process.id===processId);
    return process && process[dataKey] ;
}

getTaskFromList(tasks: any[], taskId: string){
    const task = tasks.find(task=>task.id===taskId);
    return task;
}

setselectedTask(task: string){
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

    this.showfrom = false
    CamundaRest.getVariablesByTaskId(this.token, this.selectedTask, this.CamundaUrl).then((result)=> {
        this.formioUrl = result.data["formUrl"].value;
        const {formioUrl, formId, submissionId} = getFormDetails(this.formioUrl, this.formIOProjectUrl);
        this.formioUrl = formioUrl; this.submissionId = submissionId; this.formId = formId

        this.showfrom = true
    });
}

getBPMTasks(){
    CamundaRest.getTasks(this.token, this.CamundaUrl).then((result)=> {
        this.tasks = result.data;
    })
}

onClaim() {
    CamundaRest.claim(this.token,this.task.id, {userId: this.userName}, this.CamundaUrl).then(()=> 
    {
        this.getBPMTaskDetail(this.task.id)
        this.getBPMTasks()
    }).catch((error) => {
        console.log("Error", error);
    })
}

onUnClaim(){ 
    CamundaRest.unclaim(this.token ,this.task.id, this.CamundaUrl).then(()=> 
    {
        this.getBPMTaskDetail(this.task.id)
        this.getBPMTasks()
    }).catch((error) =>{
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
        CamundaRest.getVariablesByTaskId(this.token, this.selectedTask, this.CamundaUrl).then((result)=> {
            this.formioUrl = result.data["formUrl"].value;           
            const {formioUrl, formId, submissionId} = getFormDetails(this.formioUrl, this.formIOProjectUrl);
            this.formioUrl = formioUrl; this.submissionId = submissionId; this.formId = formId
            this.showfrom = true
        });
    }
}

created() {
    CamundaRest.filterList(this.token, this.CamundaUrl).then((response) => {
        this.filterList = response.data;
    });
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
