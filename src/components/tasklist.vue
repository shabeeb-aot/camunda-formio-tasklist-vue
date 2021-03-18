<template>
  <b-container fluid class="task-outer-container">
  <b-row class="cft-service-task-list">
    <b-col cols="*" xl="4" lg="4" md="4" sm="12" v-if="tasks && tasks.length" class="cft-first">
    <b-list-group class="cft-list-container">
    <div class="cft-filter-sort"> 
      <div class="d-flex" v-for="(sort, idx) in sortList" :key="sort.sortBy">
          <div>
        <span v-if="sortList.length>1" class="font-weight-bold click-element" title="Remove Sorting" @click="deleteSort(sort, index)">x</span>
        <select class="form-select" aria-label="Select Sorting Options" @change="updateSort($event, idx)">
          <option v-for="s in sortOptions" :value="s.sortBy" :key="s.sortBy">{{s.label}}</option>
        </select>
        <a v-if="sort.sortOrder==='asc'" @click="toggleSort(idx)" href="#" title="Ascending">
          <i class="bi bi-chevron-up"></i>
        </a>
        <a v-else @click="toggleSort(idx)"  href="#" title="Descending">
          <i class="bi bi-chevron-down"></i>
        </a>
        <button v-if="updateSortOptions.length===0"><i class="bi bi-plus" @click="showSortListOptions"></i></button>
        <TaskSortOptions :sortOptions="sortOptions" :showSortListDropdown="showSortListDropdown" @add-sort="addSort"></TaskSortOptions>
        </div>
      </div>
      <div class="cft-filter-dropdown">
      <button class="cft-filter-dropbtn mr-0"><i class="bi bi-filter-square"/></button>
      <b-list-group  v-if="filterList && filterList.length" class="cft-filter-dropdown-content">
        <b-list-group-item button v-for="(filter, idx) in filterList" :key="filter.id"
        @click="fetchTaskList(filter.id, payload); togglefilter(idx)"
        :class="{'cft-selected': idx == activefilter}">
        <div class="col-12">
          {{filter.name}} ({{filter.itemCount}})
        </div>   
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-else>
        <b-list-group-item>
            <i class="bi bi-exclamation-circle-fill"></i>
            No Filters found
        </b-list-group-item>
      </b-list-group>
      </div>
    </div>    
        <div class="cft-filter-container">
          <input type="text" class="cft-filter" placeholder="Filter Tasks"/>
            {{tasklength}}
        </div>
        <b-list-group-item button v-for="(task, idx) in tasks" v-bind:key="task.id" 
          v-on:click="toggle(idx)"
          :class="{'cft-selected': idx == activeIndex}">
          <div @click="setselectedTask(task.id)" class="cft-select-task">
            <div class="col-12">
            <h5>{{ task.name }}</h5>
            </div>
          <div class="cft-task-details-assign assigne-details ">
                <div >
                  {{ getProcessDataFromList(getProcessDefinitions, task.processDefinitionId, 'name') }}     
                </div>
                <div title="Task assignee" >
                {{task.assignee}}
                </div> 
            </div>

            <div class="cft-task-details-assign font-11" >
                <div >
                  <span v-if="task.due">
                  Due {{ timedifference(task.due) }},
                </span>
                <span v-if="task.followUp">
                  Follow-up {{ timedifference(task.followUp) }},
                </span>
                <span v-if="task.created">
                  Created {{ timedifference(task.created) }}     
                </span>
                <div title="Task assignee" >
                 {{ task.priority }}
                </div>
                </div>    
            </div>
          </div>
          </b-list-group-item>
        </b-list-group>
        <b-pagination-nav :link-gen="linkGen" :number-of-pages="numPages" v-model="currentPage" />
      </b-col>
    <b-col cols="4" v-else> 
      <b-row class="cft-not-selected mt-2 ml-1 row">
          <i class="bi bi-exclamation-circle-fill" scale="1"></i>
          <p>No tasks found in the list.</p>
      </b-row>
    </b-col>
    <b-col  v-if="selectedTask"> <div class="service-task-details">
      <b-row class="ml-0 task-header"> {{task.name}}</b-row>
      <b-row class="ml-0 task-name">{{taskProcess}}</b-row>
      <b-row class="ml-0" title="application-id">Application # {{ applicationId}}</b-row>
      
      <div>
        <b-row class="cft-actionable">
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
          <b-button variant="outline-primary" v-b-modal.AddGroupModal v-if="groupListNames"><i class="bi bi-grid-3x3-gap-fill"></i> {{String(groupListNames)}} </b-button>
          <b-button variant="outline-primary" v-b-modal.AddGroupModal v-else><i class="bi bi-grid-3x3-gap-fill"></i> Add Groups</b-button>
          <b-modal
            id="AddGroupModal"
            ref="modal"
            title="Manage Groups"
            ok-title="Close"
            ok-only
          >
            <div class="modal-text">
              <i class="bi bi-exclamation-circle"></i>
              You can add a group by typing a group ID into the input field and afterwards clicking the button with the plus sign.
              <b-row class="mt-3 mb-3">
                <b-col>
                  <b-button variant="primary" @click="addGroup">
                    <span>Add a group</span>
                    <span><i class="bi bi-plus"></i></span>
                  </b-button>
                </b-col>
                <b-col>
                  <input type="text" placeholder="Group ID" v-model="setGroup" v-on:keyup.enter="addGroup">
                </b-col>
              </b-row>
              <b-row>
                <b-col v-if="groupList.length">
                  <ul v-for="g in groupList" :key="g.groupId">
                    <div class="mt-1">
                      <i class="bi bi-x" @click="deleteGroup(g.groupId)"></i>
                      <span>{{g.groupId}}</span>
                    </div>
                  </ul>
                </b-col>
              </b-row>
            </div>
          </b-modal>
          </b-col>
          <b-col>
            <b-button variant="outline-primary" v-if="task.assignee" @click="onUnClaim">
              {{task.assignee}}
            <i class="bi bi-person-x-fill"/>
            </b-button>
            <b-button variant="outline-primary" v-else @click="onClaim">
            <i class="bi bi-person-fill"/>
            Claim
            </b-button>
          </b-col>
        </b-row>

        <div>
          <b-tabs content-class="mt-3" v-if="showfrom">
          <b-tab title="Form">
            <div  class="ml-4 mr-4">
              <b-overlay :show="task.assignee !== userName" variant="light" opacity="0.75" spinner-type="none" aria-busy="true">
                <formio :src="formioUrl"
                :submission="submissionId"
                :form="formId"
                :options="task.assignee===userName ? options :  readoption"
                v-on:submit="onFormSubmitCallback"
                v-on:customEvent="oncustomEventCallback"
                >
                </formio>
              </b-overlay>
            </div>
          </b-tab>
          <b-tab title="History"></b-tab>
          <b-tab title="Diagram">
            Welcome diagram
          </b-tab>
          </b-tabs>
        </div>
      </div>
      </div>   
    </b-col>
    <b-col v-else><b-row class="cft-not-selected mt-2 ml-1 row">
      <i class="bi bi-exclamation-circle-fill" variant="secondary" scale="1"></i>
    <p>Select a task in the list.</p>
      </b-row></b-col>
  </b-row>
  </b-container>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'formiojs/dist/formio.full.min.css'
import '../camundaFormIOTasklist.scss'
import 'vue2-datepicker/index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import  BootstrapVue from 'bootstrap-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import {authenticateFormio} from "../services/formio-token";
import {getFormDetails} from "../services/get-formio";
import moment from "moment";
import {TASK_FILTER_LIST_DEFAULT_PARAM, decodeTokenValues, findFilterKeyOfAllTask, getTaskFromList, sortingList} from "../services/utils";
import TaskSortOptions from '../components/tasklist-sortoptions.vue';

Vue.use(BootstrapVue)


@Component({
  components: {
    formio: Form,
    DatePicker,
    TaskSortOptions
  }
})
export default class Tasklist extends Vue {
@Prop() private bpmApiUrl !: string;
@Prop() private token !: string;
@Prop() private formIOResourceId !: string;
@Prop() private formIOReviewerId !: string;
@Prop() private formIOReviewer !: string;
@Prop() private formIOApiUrl!: string;
@Prop() private formsflowaiApiUrl!: string;
@Prop() private formsflowaiUrl!: string;
@Prop() private formIOUserRoles !: string;
@Prop() private userName !: string;

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
private currentPage= 1
private perPage= 15
private numPages=5
private tasklength=0
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
private groupListNames: any = null
private groupListItems: string[] = []
private userEmail = 'external'
private selectedfilterId = ''
private sortList = TASK_FILTER_LIST_DEFAULT_PARAM
private updatesortList: any = TASK_FILTER_LIST_DEFAULT_PARAM;
private sortOptions: any = []
private updateSortOptions: any = []
private setSortOptions: any = []
private showSortListDropdown = false
private setShowSortListDropdown = false
private payload: any = {"processVariables":[],"taskVariables":[],"caseInstanceVariables":[], "active": true,
  "sorting": TASK_FILTER_LIST_DEFAULT_PARAM
}

checkPropsIsPassedAndSetValue() {
  if(! this.bpmApiUrl|| this.bpmApiUrl===""){
    console.error("bpmApiUrl prop not Passed")
  }

  else if(! this.token || this.token==="") {
    console.error("token prop not Passed")
  }

  else if(! this.formIOResourceId|| this.formIOResourceId==="") {
    console.error("formIOResourceId prop not passed")
  }

  else if(! this.formIOReviewerId|| this.formIOReviewerId==="") {
    console.error("formIOReviewerId prop not passed")
  }

  else if(! this.formIOApiUrl|| this.formIOApiUrl==="") {
    console.error("formIOApiUrl prop not passed")
  }

  else if(! this.formsflowaiApiUrl || this.formsflowaiApiUrl==="") {
    console.error("formsflow.ai API url prop not passed")
  }

  else if(! this.formsflowaiUrl || this.formsflowaiUrl==="") {
    console.error("formsflow.ai URL prop not passed")
  }

  localStorage.setItem("bpmApiUrl", this.bpmApiUrl);
  localStorage.setItem("authToken", this.token);
  localStorage.setItem("formsflow.ai.url", this.formsflowaiUrl);
  localStorage.setItem("formsflow.ai.api.url", this.formsflowaiApiUrl);

  const val = decodeTokenValues(this.token, this.userName, this.formIOUserRoles);
  this.userName = val.userName;this.userEmail = val.userEmail;this.formIOUserRoles = val.formIOUserRoles;
}

timedifference(date: Date)  {
  return moment(date).fromNow();
}

getProcessDataFromList(processList: any[] ,processId: any,dataKey: string) {
  const process = processList.find(process=>process.id===processId);
  return process && process[dataKey] ;
}


setselectedTask(task: string){
  this.selectedTask = task
  this.fetchData()
}

toggle(index: number) {
  this.activeIndex = index
}

togglefilter(index: number) {
  this.activefilter = index
}

addGroup() {
  CamundaRest.createTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {"userId": null, "groupId": this.setGroup, "type": "candidate"}).then((result) => {
    this.getGroupDetails();
    this.reloadCurrentTask()
  })
}

getGroupDetails() {
  CamundaRest.getTaskGroupByID(this.token, this.task.id, this.bpmApiUrl).then((response) => {
    this.groupList = response.data;
    this.groupListItems = []
    this.groupListNames = null
    for (const group of response.data){
      this.groupListItems.push(group.groupId)
    }
    if (this.groupListItems.length) {
      this.groupListNames = this.groupListItems
    }
  })
}

deleteGroup(groupid: string) {
  CamundaRest.deleteTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {"groupId": groupid, "type": "candidate"}).then(()=> {
    this.getGroupDetails();
    this.reloadCurrentTask()
  })
}

onFormSubmitCallback() {
  if(this.task.id){
    this.onBPMTaskFormSubmit(this.task.id)
  }
}

onBPMTaskFormSubmit(taskId: string){
  const formRequestFormat={
    variables: {
      formUrl: {
        value: this.formioUrl
      },
      applicationId: {
        value: this.applicationId
      }
    }
  };
  CamundaRest.formTaskSubmit(this.token, taskId, formRequestFormat, this.bpmApiUrl).then(() => {
    this.reloadCurrentTask()
  }).catch((error) => {
    console.log("Error", error);
  })
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

oncustomEventCallback = (customEvent: any) => {
  switch(customEvent.type){
  case "reloadTasks":
    this.reloadTasks();
    break;
  case "reloadCurrentTask":
    this.reloadCurrentTask();
    break;
  }
}

reloadTasks() {
  //used to unSelect the task and refresh taskList
  this.selectedTask = ''
  this.fetchTaskList(this.selectedfilterId, this.payload);
}

reloadCurrentTask() {
  //used to refresh selected task and taskList
  this.getBPMTaskDetail(this.task.id)
  this.fetchTaskList(this.selectedfilterId, this.payload);
}

onClaim() {
  CamundaRest.claim(this.token,this.task.id, {userId: this.userName}, this.bpmApiUrl).then(()=> 
  {
    this.reloadCurrentTask()
  }).catch((error) => {
    console.log("Error", error);
  })
}

onUnClaim(){ 
  CamundaRest.unclaim(this.token ,this.task.id, this.bpmApiUrl).then(()=> 
  {
    this.reloadCurrentTask()
  }).catch((error) =>{
    console.log("Error", error)
  })
}

fetchTaskList(filterId: string, requestData: object) {
  this.selectedfilterId = filterId
  CamundaRest.filterTaskList(this.token, filterId, requestData,
    this.bpmApiUrl,).then((result) => {
    this.tasks = result.data.slice((this.currentPage - 1) * this.perPage,
      this.currentPage * this.perPage);
    this.tasklength = result.data.length;
    this.numPages = Math.ceil(result.data.length/this.perPage);
  }); 
}
numberOfPages () {
  if(Math.ceil(this.tasks.length / this.perPage)>1)
    return Math.ceil(this.tasks.length / this.perPage);
  else {
    return 15;
  }
}

linkGen () {
  this.fetchTaskList(this.selectedfilterId, this.payload);
}

getOptions(options: any){
  const optionsArray: { sortOrder: string; label: string; sortBy: string }[] = [];
  sortingList.forEach(sortOption=>{
    if(!options.some((option: { sortBy: string })=>option.sortBy===sortOption.sortBy)){
      optionsArray.push({...sortOption})
    }
  });
  return optionsArray;
}

addSort(sort: any){
  this.sortList.push(sort)
  console.log(this.sortList)
  this.updatesortList = this.sortList
  if(this.sortList.length === sortingList.length){
    this.updateSortOptions = this.sortOptions;
  }
  else{
    this.sortOptions = this.getOptions(this.sortList);
  }
  this.showSortListDropdown = false;
}

showSortListOptions() {
  this.showSortListDropdown = ! this.showSortListDropdown;
  this.sortOptions = this.getOptions(this.sortList);
}

updateSort(event: any, index: number) {
  // const value = event?.target.value;
  // const label = event?.target.options[event.target.options.selectedIndex].text;
  // this.sortList[index].sortBy = event?.target.value;
  // this.sortList[index].label = event?.target.options[event.target.options.selectedIndex].text;

  // this.sortOptions = this.getOptions(this.sortList);
  // this.payload["sorting"] = this.sortList
  // this.fetchTaskList(this.selectedfilterId, this.payload)
}

deleteSort(sort: any, index: number) {
  this.sortList.splice(index, 1);
  this.updatesortList = this.sortList;
  this.updateSortOptions = []
  this.sortOptions = this.getOptions(this.sortList);
  this.payload["sorting"] = this.sortList
  this.fetchTaskList(this.selectedfilterId, this.payload);
}

toggleSort(index: number) {
  if(this.sortList[index].sortOrder === "asc")
    this.sortList[index].sortOrder = "desc"
  
  else{
    this.sortList[index].sortOrder = "asc"
  }
  this.payload["sorting"] = this.sortList
  this.fetchTaskList(this.selectedfilterId, this.payload)
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
    this.reloadCurrentTask()
  }).catch((error) =>{
    console.log("Error", error)
  })
}

fetchData() {
  if (this.selectedTask) {     
    this.task = getTaskFromList(this.tasks, this.selectedTask);
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

created() {
  CamundaRest.filterList(this.token, this.bpmApiUrl).then((response) => {
    this.filterList = response.data;
    const key = findFilterKeyOfAllTask(this.filterList, "name", "All tasks")
    this.fetchTaskList(key, this.payload)
  });
}

mounted() {
  this.checkPropsIsPassedAndSetValue()
  authenticateFormio(this.formIOResourceId, this.formIOReviewerId, this.formIOReviewer,this.userEmail, this.formIOUserRoles)

  this.fetchData();
  this.sortOptions = this.getOptions([])
  CamundaRest.getProcessDefinitions(this.token, this.bpmApiUrl).then((response) => {
    this.getProcessDefinitions = response.data;
  });
}
}
</script>
