<template>
  
<b-container fluid class="task-outer-container">
  <b-row>
    <!-- Filter section begins -->
    <b-col cols="*" xl="1" lg="1" md="1" sm="12"
      class="cft-filter-dropdown"
    >
        <button class="cft-filter-dropbtn mr-0">
          <i class="bi bi-filter-square"/>
        </button>
        <b-list-group  v-if="filterList && filterList.length" class="cft-filter-dropdown-content">
          <b-list-group-item button v-for="(filter, idx) in filterList" :key="filter.id"
          @click="fetchTaskList(filter.id, payload); togglefilter(idx)"
          :class="{'cft-selected': idx == activefilter}">
            {{filter.name}}
          </b-list-group-item>
        </b-list-group>
        <b-list-group v-else>
          <b-list-group-item>
            <i class="bi bi-exclamation-circle-fill"></i>
              No Filters found  
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col cols="*" xl="2" lg="2" md="2" sm="12">
        <b-button v-b-modal.modal-multi-1>
        <h1> <i class="fa fa-wpforms"></i> Forms</h1>
        </b-button>
        <b-modal
          id="modal-multi-1"
          title="Forms"
        >
          <div class="overflow-auto">
            <b-table-simple
              hover
              small
              caption-top
              responsive
              :bordered=true
              :outlined=true
              :per-page="perPage"
            >
              <b-thead>
                <b-tr>
                  <b-th>Form Name</b-th>
                  <b-th>Operations</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="form in formList" :key="form.formId">
                  <b-th> {{form.formName}}</b-th>
                  <b-th>
                    <b-button `
                      variant="primary"
                      v-b-modal.modal-multi-2
                      @click="storeFormValue(form.formId, form.formName)"
                    >Submit New
                    </b-button>
                  </b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>

                <b-pagination-nav
                :link-gen="linkFormGen"
                :number-of-pages="formNumPages"
                v-model="formcurrentPage"
              />
          </div>
        </b-modal>
        <b-modal
          id="modal-multi-2"
          size="lg"
          title="Create forms"
        >
          Enter and submit form
          <h4>{{formTitle}}</h4>
          <formio :src="formValueId">
          </formio>
        </b-modal>
      </b-col>
  </b-row>
  <b-row>
    <b-col cols="*" xl="3" lg="3" md="3" sm="12" class="cft-first">
      <div>
        <!-- Sorting section -->
				<div id='cftf-dpdown-container'>
					<div class="cftf-dpdown-box" v-for="(sort, idx) in sortList" :key="sort.sortBy">
              <span v-if="sortList.length>1" class="cftf-exit-button" title="Remove Sorting" @click="deleteSort(sort, index)"><i class="bi bi-x"></i></span>
							<span class="cftf-span-element" @click="showUpdateSortOptions(idx)">{{sortList[idx]["label"]}}</span>
              <div v-if="showUpdateSortListDropdown[idx]" class="cft-sort-items">
                <div v-for="s in sortOptions" :key="s.sortBy"
                 @click="updateSort(s,idx)"
                 class="mb-2 cft-sort-element"
                >
                  {{s.label}}
                </div>
            </div>
							<a v-if="sort.sortOrder==='asc'" @click="toggleSort(idx)" href="#" title="Ascending">
								<i class="bi bi-chevron-up cftf-arrow"></i>
							</a>
							<a v-else @click="toggleSort(idx)"  href="#" title="Descending">
								<i class="bi bi-chevron-down cftf-arrow"></i>
							</a>
            </div>
          <i v-if="updateSortOptions.length===0"
           class="fa fa-plus fa-sm click-element cftf-add-sorting"
           @click="showaddSortListOptions"
           title="Add sorting"></i>
          <TaskSortOptions
           :sortOptions="sortOptions"
           :showSortListDropdown="showaddNewSortListDropdown"
           @add-sort="addSort"
          >
          </TaskSortOptions>
          </div>
				</div>
    </b-col>
  </b-row>
	<b-row class="cft-service-task-list">
		<b-col cols="*" xl="3" lg="3" md="3" sm="12" class="cft-first">
        <b-row class="cft-input-filter">
          <b-col class="cft-filter-container" cols="*" xl="12" lg="12" md="12" sm="12">
					<input type="text" class="cft-filter" placeholder="Filter Tasks"/>
            {{tasklength}}
          </b-col>
          </b-row>
        <!-- Task list section -->
        <b-list-group class="cft-list-container"  v-if="tasks && tasks.length">
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
        <b-pagination-nav :link-gen="linkGen" :number-of-pages="numPages" v-model="currentPage" class="cft-paginate" />
			</b-list-group>
      <b-list-group cols="3" v-else>
        <b-row class="cft-not-selected mt-2 ml-1 row">
          <i class="bi bi-exclamation-circle-fill" scale="1"></i>
          <p>No tasks found in the list.</p>
        </b-row>
      </b-list-group>
		</b-col>
    <!-- Task Detail section -->
		<b-col  v-if="selectedTask"  lg="9" md="9" sm="12">
			<div class="service-task-details">
				<b-row class="ml-0 task-header"> {{task.name}}</b-row>
        <br>
				<b-row class="ml-0 task-name">{{taskProcess}}</b-row>
        <br>
				<b-row class="ml-0" title="application-id">Application # {{ applicationId}}</b-row>
				<div>
          <!-- four buttons -->
					<b-row class="cft-actionable">
						<b-col>
							<DatePicker 
          type="datetime"
          placeholder="Set Follow-up date"
          v-model="setFollowup"
          @change="updateFollowUpDate"
          ></DatePicker>
						</b-col>
						<b-col>
							<DatePicker 
          type="datetime"
          placeholder="Set Due Date"
          v-model="setDue"
          @change="updateDueDate"
          ></DatePicker>
						</b-col>
						<b-col>
							<b-button variant="primary" v-b-modal.AddGroupModal v-if="groupListNames">
								<i class="bi bi-grid-3x3-gap-fill"></i> {{String(groupListNames)}} 
							</b-button>
							<b-button variant="primary" v-b-modal.AddGroupModal v-else>
								<i class="bi bi-grid-3x3-gap-fill"></i> Add Groups
							</b-button>
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
											<b-button
                        variant="primary"
                        @click="addGroup"
                        :disabled='!setGroup'
                      >
												<span>Add a group</span>
												<span>
													<i class="bi bi-plus"></i>
												</span>
											</b-button>
										</b-col>
										<b-col>
											<input type="text" placeholder="Group ID" v-model="setGroup" v-on:keyup.enter="addGroup"/>
											</b-col>
										</b-row>
										<b-row>
											<b-col v-if="groupList.length">
												<ul v-for="g in groupList" :key="g.groupId">
													<div class="mt-1">
														<i class="fa fa-times mr-2 click-element" @click="deleteGroup(g.groupId)"></i>
														<span>{{g.groupId}}</span>
													</div>
												</ul>
											</b-col>
										</b-row>
									</div>
								</b-modal>
							</b-col>
							<b-col>
								<b-button variant="primary" v-if="task.assignee" @click="onUnClaim">
              {{task.assignee}}
            
									<i class="bi bi-person-x-fill"/>
								</b-button>
								<b-button variant="primary" v-else @click="onClaim">
									<i class="bi bi-person-fill"/>
                  Claim
            
								</b-button>
							</b-col>
						</b-row>
						<div>
              <!-- form section -->
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
                ></formio>
										</b-overlay>
									</div>
								</b-tab>
								<b-tab title="History"></b-tab>
                <!-- Process diagram -->
                <b-tab  style="height:100%;" id="diagramContainer" title="Diagram">
                  <div  style="height:100%;" id="canvas"></div>
                </b-tab>
							</b-tabs>
						</div>
					</div>
				</div>
			</b-col>
			<b-col v-else>
				<b-row class="cft-not-selected mt-2 ml-1 row">
					<i class="bi bi-exclamation-circle-fill" variant="secondary" scale="1"></i>
					<p>Select a task in the list.</p>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import "font-awesome/scss/font-awesome.scss";
import 'formiojs/dist/formio.full.min.css'
import 'vue2-datepicker/index.css';
import 'semantic-ui-css/semantic.min.css';
import '../user-styles.css'
import '../camundaFormIOTasklist.scss'
import { Component, Prop, Vue } from 'vue-property-decorator'
import {TASK_FILTER_LIST_DEFAULT_PARAM,
  decodeTokenValues,
  findFilterKeyOfAllTask,
  getTaskFromList,
  sortingList
} from "../services/utils";
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import Modeler from 'bpmn-js/lib/Modeler';
import TaskSortOptions from '../components/tasklist-sortoptions.vue';
import {authenticateFormio} from "../services/formio-token";
import {getFormDetails} from "../services/get-formio";
import moment from "moment";
import vueBpmn from "vue-bpmn";


@Component({
  components: {
    formio: Form,
    DatePicker,
    TaskSortOptions,
    vueBpmn,
    Modeler
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
private formList: Array<object> = []
private setFollowup = null
private setDue = null
private setGroup = null
private selectedTask = ''
private showfrom = false
private currentPage= 1
private perPage= 15
private numPages=5
private formperPage=10
private formNumPages=5
private formcurrentPage=1
private formValueId = ''
private formTitle = ''
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
  private xmlData: any;
private sortList = TASK_FILTER_LIST_DEFAULT_PARAM
private sortOptions: any = []
private updateSortOptions: any = []
private showUpdateSortListDropdown = [false, false, false, false, false, false]
private showaddNewSortListDropdown = false
private optionsList: any = ['created',]
private payload: any = {"processVariables":[],"taskVariables":[],"caseInstanceVariables":[], "active": true,
  "sorting": TASK_FILTER_LIST_DEFAULT_PARAM
}

checkPropsIsPassedAndSetValue() {
  if(!this.bpmApiUrl || this.bpmApiUrl===""){
    console.warn("bpmApiUrl prop not Passed")
  }

  if(!this.token || this.token==="") {
    console.warn("token prop not Passed")
  }

  if(!this.formIOResourceId || this.formIOResourceId==="") {
    console.warn("formIOResourceId prop not passed")
  }

  if(!this.formIOReviewerId || this.formIOReviewerId==="") {
    console.warn("formIOReviewerId prop not passed")
  }

  if(!this.formIOApiUrl || this.formIOApiUrl === "") {
    console.warn("formIOApiUrl prop not passed")
  }

  if(!this.formsflowaiApiUrl || this.formsflowaiApiUrl==="") {
    console.warn("formsflow.ai API url prop not passed")
  }

  if(!this.formsflowaiUrl || this.formsflowaiUrl==="") {
    console.warn("formsflow.ai URL prop not passed")
  }
  const engine = '/engine-rest'
  localStorage.setItem("bpmApiUrl", this.bpmApiUrl+engine);
  localStorage.setItem("authToken", this.token);
  localStorage.setItem("formsflow.ai.url", this.formsflowaiUrl);
  localStorage.setItem("formsflow.ai.api.url", this.formsflowaiApiUrl);

  const val = decodeTokenValues(this.token, this.userName, this.formIOUserRoles);
  this.userName = val.userName;this.userEmail = val.userEmail;this.formIOUserRoles = val.formIOUserRoles;
}

timedifference(date: Date)  {
  return moment(date).fromNow();
}

getProcessDataFromList(processList: any[] ,processId: any, dataKey: string) {
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
  if(!this.setGroup){
    CamundaRest.createTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {"userId": null, "groupId": this.setGroup, "type": "candidate"}).then(() => {
      this.getGroupDetails();
      this.reloadCurrentTask()
    })
  }
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
  if(this.sortList.length === sortingList.length){
    this.updateSortOptions = this.sortOptions;
  }
  else{
    this.sortOptions = this.getOptions(this.sortList);
  }
  this.showaddNewSortListDropdown = false;
}

showaddSortListOptions() {
  this.showaddNewSortListDropdown = ! this.showaddNewSortListDropdown;
  this.sortOptions = this.getOptions(this.sortList);
}

showUpdateSortOptions(index: number) {
  this.showUpdateSortListDropdown[index] = !this.showUpdateSortListDropdown[index];
  this.sortOptions = this.getOptions(this.sortList);
}

updateSort(sort: any, index: number) {
  this.sortList[index].label = sort.label
  this.sortList[index].sortBy = sort.sortBy;

  this.sortOptions = this.getOptions(this.sortList);
  this.showUpdateSortListDropdown[index] = false;
  this.payload["sorting"] = this.sortList;
  this.fetchTaskList(this.selectedfilterId, this.payload);
}

deleteSort(sort: any, index: number) {
  this.sortList.splice(index, 1);
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
      CamundaRest.getProcessDiagramXML(
        this.token,
        result.data.processDefinitionId,
        this.bpmApiUrl
      ).then(async (res) => {
        this.xmlData = res.data.bpmn20Xml;
        const modeler = new Modeler({ container: '#canvas' });
        await modeler.importXML(this.xmlData);
        // const { warnings } = await viewer.importXML(this.xmlData);
        // viewer.attachTo('#diagramContainer');
        // console.log("xml", res.data.bpmn20Xml);
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

linkFormGen() {
  this.formListItems();
}

formListItems() {
  console.log("start", (this.formcurrentPage-1)*this.formperPage)
  console.log("end", this.formcurrentPage* this.formperPage)
  CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
  {
    this.formNumPages = Math.ceil(response.data.length/this.formperPage);
    this.formList = response.data.splice(
      (this.formcurrentPage - 1) * this.formperPage,
      this.formcurrentPage * this.formperPage
    );
    console.log("Current Page, num page", this.formcurrentPage, this.formperPage)
    console.log("end length", this.formcurrentPage*this.formperPage)
    console.log("length of response", this.formList.length);
  });
}

storeFormValue(val: string, name: string){
  const forms = localStorage.getItem('formioApiUrl') + '/form/';
  this.formValueId = forms.concat(val);
  this.formTitle = name;
}


mounted() {
  this.checkPropsIsPassedAndSetValue();
  authenticateFormio(this.formIOResourceId, this.formIOReviewerId, this.formIOReviewer,this.userEmail, this.formIOUserRoles);
  CamundaRest.filterList(this.token, this.bpmApiUrl).then((response) => {
    this.filterList = response.data;
    const key = findFilterKeyOfAllTask(this.filterList, "name", "All tasks")
    this.fetchTaskList(key, this.payload)
  });

  this.formListItems();
  this.fetchData();
  this.sortOptions = this.getOptions([])
  CamundaRest.getProcessDefinitions(this.token, this.bpmApiUrl).then((response) => {
    this.getProcessDefinitions = response.data;
  });
}
}
</script>
