<template>
<b-container class="task-outer-container">
  <b-row>
    <b-col cols="*" xl="4" lg="4" md="4" sm="12" v-if="tasks && tasks.length">
    <div class="dropdown">
                     <button class="dropbtn">Filters</button>
                        <b-list-group  v-if="filterList && filterList.length" class="dropdown-content">
                        <b-list-group-item button v-for="(filter) in filterList" :key="filter.id"
                        @click="fetchTaskList(filter.id)">
                            <div class="col-12">
                            {{filter.name}} ({{filter.itemCount}})
                            </div>   
                        </b-list-group-item>
                        </b-list-group>
                    </div>
                <b-list-group class="list-container">
                    
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
                                    Due {{ timedifference(task.due) }}
                                </div>
                                <div v-if="task.followUp">
                                    Follow-up {{ timedifference(task.followUp) }} 
                                </div>
                                    Created {{ timedifference(task.created) }}
                            </b-col>
                            <b-col lg=4 xs=4 sm=4 class="pr-0 text-right" title="priority">
                                {{ task.priority }}
                            </b-col>
                        </b-row>
                    </div>
                  </b-list-group-item>
                  </b-list-group>
            </b-col>
    <b-col cols="4" v-else> <b-row class="not-selected mt-2 ml-1 row">
                <b-icon icon="exclamation-circle-fill" variant="secondary" scale="1"></b-icon>
                <p>No tasks found in the list.</p>
              </b-row></b-col>
    <b-col  v-if="selectedTask"> <div class="service-task-details">
        <b-row class="ml-0 task-header"> {{task.name}}</b-row>
        <b-row class="ml-0 task-name">{{taskProcess}}</b-row>
        <b-row class="ml-0" title="application-id">Application # {{ applicationId}}</b-row>
        
        <div>
        <b-row class="actionable">
            <b-col>
              <DatePicker 
              type="datetime"
              placeholder="Set Follow-up date"
              v-model="setFollowup"
              @change="updateFollowUpDate"
              >
              </DatePicker>
            </b-col>
              <b-col>
                <DatePicker 
              type="datetime"
              placeholder="Set Due Date"
              v-model="setDue"
              @change="updateDueDate"
                >
                </DatePicker>
              </b-col>
            <b-col>
            <b-button variant="outline-primary" v-b-modal.AddGroupModal v-if="groupListNames"><b-icon :icon="'grid3x3-gap-fill'"></b-icon> {{String(groupListNames)}} </b-button>
            <b-button variant="outline-primary" v-b-modal.AddGroupModal v-else><b-icon :icon="'grid3x3-gap-fill'"></b-icon> Add Groups</b-button>
            <b-modal
            id="AddGroupModal"
            ref="modal"
            title="Manage Groups"
            >
                <div class="modal-text">
                    <b-icon icon="exclamation-circle"></b-icon>
                    You can add a group by typing a group ID into the input field and afterwards clicking the button with the plus sign.
                    <b-row class="mt-3 mb-3">
                        <b-col>
                            <b-button variant="primary" @click="addGroup">
                            <label class="add">Add a group</label>
                            </b-button>
                        </b-col>
                        <b-col>
                        <input type="text" placeholder="Group ID" v-model="setGroup" v-on:keyup.enter="addGroup">
                        </b-col>
                            <ul v-for="g in groupList" :key="g.groupId">
                                <p v-if="g.type==='candidate'">
                                    <b-button variant="danger" @click="deleteGroup(g.groupId)">X</b-button>
                                    {{g.groupId}}
                                </p>
                            </ul>
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
                <div v-else class="ml-4 mr-4">
                    <b-overlay :show="true" spinner-type="none">
                        <formio :src="formioUrl"
                        :submission="submissionId"
                        :form="formId"
                        :options="readoption"
                        >
                        </formio>
                    </b-overlay>
                </div>
              </b-tab>
              <b-tab title="History"></b-tab>
              <b-tab title="Diagram"></b-tab>
            </b-tabs>
          </div>
        </div>
        </div>     
   </b-col>
     <b-col v-else><b-row class="not-selected mt-2 ml-1 row">
          <b-icon icon="exclamation-circle-fill" variant="secondary" scale="1"></b-icon>
       <p>Select a task in the list.</p>
        </b-row></b-col>
  </b-row>
</b-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import {authenticateFormio} from "../services/formio-token";
import {getFormDetails} from "../services/get-formio";
import moment from "moment";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'formiojs/dist/formio.full.min.css'
import '../camundaFormIOTasklist.scss'
import 'vue2-datepicker/index.css';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

@Component({
    components: {
        formio: Form,
        DatePicker,
    }
})
export default class Tasklist extends Vue {
@Prop() private bpmApiUrl !: string;
@Prop() private token !: string;
@Prop() private userName !: string;
@Prop({default:'external'}) private userEmail !: string;
@Prop() private formIOUserRoles !: string;
@Prop() private formIOResourceId !: string;
@Prop() private formIOReviewerId !: string;
@Prop() private formIOReviewer !: string;
@Prop() private formIOApiUrl!: string;
@Prop() private formsflowaiApiUrl!: string;
@Prop() private formsflowaiUrl!: string;

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
private activefilter = 0
private applicationId = ''
private groupList = []
private groupListNames: any
private groupListItems = []

checkPropsIsPassed() {
    if(! this.bpmApiUrl|| this.bpmApiUrl===""){
        console.error("bpmApiUrl prop not Passed")
    }

    else if(! this.token || this.token==="") {
        console.error("token prop not Passed")
    }

    else if(! this.userName|| this.userName==="") {
        console.error("userName prop not passed")
    }

    else if(! this.formIOUserRoles|| this.formIOUserRoles==="") {
        console.error("formioUserRoles prop not passed")
    }

    else if(! this.formIOResourceId|| this.formIOResourceId==="") {
        console.error("formIOResourceId prop not passed")
    }
    else if(! this.formIOReviewerId|| this.formIOReviewerId==="") {
        console.error("formIOReviewerId prop not passed")
    }
    else if(! this.formIOReviewer|| this.formIOReviewer==="") {
        console.error("formIOReviewer prop not passed")
    }
    else if(! this.formIOApiUrl|| this.formIOApiUrl==="") {
        console.error("formIOApiUrl prop not passed")
    }
}

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
    CamundaRest.getTaskById(this.token, taskId, this.bpmApiUrl).then((result) => {
        this.task = result.data;
    })

    this.showfrom = false
    CamundaRest.getVariablesByTaskId(this.token, this.selectedTask, this.bpmApiUrl).then((result)=> {
        this.formioUrl = result.data["formUrl"].value;
        const {formioUrl, formId, submissionId} = getFormDetails(this.formioUrl, this.formIOApiUrl);
        this.formioUrl = formioUrl; this.submissionId = submissionId; this.formId = formId

        this.showfrom = true
    });
}

getBPMTasks(){
    CamundaRest.getTasks(this.token, this.bpmApiUrl).then((result)=> {
        this.tasks = result.data;
    })
}

onClaim() {
    CamundaRest.claim(this.token,this.task.id, {userId: this.userName}, this.bpmApiUrl).then(()=> 
    {
        this.getBPMTaskDetail(this.task.id)
        this.getBPMTasks()
    }).catch((error) => {
        console.log("Error", error);
    })
}

onUnClaim(){ 
    CamundaRest.unclaim(this.token ,this.task.id, this.bpmApiUrl).then(()=> 
    {
        this.getBPMTaskDetail(this.task.id)
        this.getBPMTasks()
    }).catch((error) =>{
        console.log("Error", error)
    })
}

fetchTaskList(filterId: string) {

    CamundaRest.filterTaskList(this.token, filterId, {"sorting":[{"sortBy": "created","sortOrder": "desc" }]}, this.bpmApiUrl,).then((result) => {
        this.tasks = result.data;      
    }); 
}

updateFollowUpDate() {
    const referenceobject = this.task
    const timearr = moment(this.setFollowup).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ").split('+')
    const replaceTimezone = timearr[1].replace(':', '')
    referenceobject["followUp"] = moment(this.setFollowup).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ").replace(timearr[1], replaceTimezone) 
    CamundaRest.updateTasksByID(this.token, this.task.id, this.bpmApiUrl, referenceobject).then(()=> {
        console.log("Updated follow up date")
    }).catch((error) =>{
        console.log("Error", error)
    })
}

updateDueDate() {
    const referenceobject = this.task
    const timearr = moment(this.setDue).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ").split('+')
    const replaceTimezone = timearr[1].replace(':', '')
    referenceobject["due"] = moment(this.setDue).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ").replace(timearr[1], replaceTimezone)
    CamundaRest.updateTasksByID(this.token, this.task.id, this.bpmApiUrl, referenceobject).then(()=> {
        console.log("Update due date")
        this.getBPMTaskDetail(this.task.id)
        this.getBPMTasks()
    }).catch((error) =>{
        console.log("Error", error)
    })
}

fetchData() {
    if (this.selectedTask) {       
        this.task = this.getTaskFromList(this.tasks, this.selectedTask);
        this.getGroupDetails()
        CamundaRest.getTaskById(this.token, this.selectedTask, this.bpmApiUrl).then((result) => {
            CamundaRest.getProcessDefinitionById(this.token, result.data.processDefinitionId, this.bpmApiUrl).then((res) => {
                this.taskProcess = res.data.name;
            });
        })
        this.showfrom = false
        CamundaRest.getVariablesByTaskId(this.token, this.selectedTask, this.bpmApiUrl).then((result)=> {
            this.applicationId = result.data["applicationId"].value;
            this.formioUrl = result.data["formUrl"].value;           
            const {formioUrl, formId, submissionId} = getFormDetails(this.formioUrl, this.formIOApiUrl);
            this.formioUrl = formioUrl; this.submissionId = submissionId; this.formId = formId
            this.showfrom = true
        });
    }
}

togglefilter(index: number) {
    this.activefilter = index
}

findFilterKeyOfAllTask(array: string|any[], key: string|number, value: any) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i]["id"];
        }
    }
    return null;
}

addGroup() {
    CamundaRest.createTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {"userId": null, "groupId": this.setGroup, "type": "candidate"}).then((result) => {
        console.log("Create group", result.data);
        this.getGroupDetails();
        this.getBPMTaskDetail(this.task.id);
        this.getBPMTasks();
    })
}

getGroupDetails() {
    CamundaRest.getTaskGroupByID(this.token, this.task.id, this.bpmApiUrl).then((response) => {
        this.groupList = response.data;
        this.groupListItems = []
        this.groupListNames = null
        for (const group of response.data){
            if (group.type==="candidate") {
                this.groupListItems.push(group.groupId)
            }
        }
        if (this.groupListItems.length) {
            this.groupListNames = this.groupListItems
        }
    })
}

deleteGroup(groupid: string) {
    CamundaRest.deleteTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {"groupId": groupid, "type": "candidate"}).then(()=> {
        this.getGroupDetails();
        this.getBPMTaskDetail(this.task.id);
    })
}

submitFunctionality() {
    console.log("Form submitted")
    this.getBPMTaskDetail(this.task.id)
}

created() {
    CamundaRest.filterList(this.token, this.bpmApiUrl).then((response) => {
        this.filterList = response.data;
        const key = this.findFilterKeyOfAllTask(this.filterList, "name", "All tasks")
        this.fetchTaskList(key)
    });
}

mounted() {
    this.checkPropsIsPassed();
    authenticateFormio(this.formIOResourceId, this.formIOReviewerId, this.formIOReviewer,this.userEmail, this.formIOUserRoles)

    this.fetchData();
    CamundaRest.getProcessDefinitions(this.token, this.bpmApiUrl).then((response) => {
        this.getProcessDefinitions = response.data;
    });
}
}
</script>
