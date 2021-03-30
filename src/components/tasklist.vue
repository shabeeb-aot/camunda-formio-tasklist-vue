<template>
  
<b-container fluid class="task-outer-container">
  <div class="main-filters my-2 mb-1">
    <!-- Filter section begins -->
    <div 
      class="cft-filter-dropdown mx-2"
    >
        <button class="cft-filter-dropbtn mr-0">
          <i class="bi bi-filter-square"/>
        </button>
        <b-list-group  v-if="filterList && filterList.length" class="cft-filter-dropdown-content">
          <b-list-group-item button v-for="(filter, idx) in filterList" :key="filter.id"
          @click="fetchTaskList(filter.id, payload); togglefilter(idx)"
          :class="{'cft-filter-selected': idx == activefilter}">
            {{filter.name}}
          </b-list-group-item>
        </b-list-group>
        <b-list-group class="cft-filter-dropdown-content"  v-else>
          <b-list-group-item>
            <i class="bi bi-exclamation-circle-fill"></i>
              No Filters found  
          </b-list-group-item>
        </b-list-group>
      </div>
										
      <FormListModal :token="token" :bpmApiUrl="bpmApiUrl"/>          

																			
      <div class="cft-first">
        <!-- Sorting section -->
				<div id="cftf-dpdown-container" class="mx-2">
					<div class="cftf-dpdown-box mr-2" v-for="(sort, idx) in sortList" :key="sort.sortBy">
              <span v-if="sortList.length>1"
                class="cftf-exit-button"
                title="Remove Sorting" 
                @click="deleteSort(sort, index)"
              >
                  <i class="bi bi-x"></i>
              </span>
							<span
               class="cftf-span-element"
                @click="showUpdateSortOptions(idx)"
              >{{sortList[idx]["label"]}}</span>
              <div
                v-if="showSortListDropdown[idx]"
                class="cft-sort-items"
              >
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
  </div>
	<b-row class="cft-service-task-list mt-1">
		<b-col cols="*" xl="3" lg="3" md="3" sm="12" class="cft-first">
      <!-- <TaskListSearch :tasklength="tasklength"/> -->
       <div class="cft-input-filter">
          <b-col class="cft-filter-container" cols="*" xl="12" lg="12" md="12" sm="12">
					<input type="text" class="cft-filter" placeholder="Filter Tasks"/>
            {{tasklength}}
          </b-col>
        </div>
        <!-- Task list section -->
        <b-list-group class="cft-list-container" v-if="tasks && tasks.length">
          <b-list-group-item
            button
            v-for="(task, idx) in tasks"
            v-bind:key="task.id"
            v-on:click="toggle(idx)"
            :class="{ 'cft-selected': idx == activeIndex }"
          >
            <div @click="setselectedTask(task.id)" class="cft-select-task">
              <h5 class="task-title">{{ task.name }}</h5>

              <div class="cft-task-details-assign assigne-details ">
                <div>
                  {{
                    getProcessDataFromList(
                      getProcessDefinitions,
                      task.processDefinitionId,
                      "name"
                    )
                  }}
                </div>
                <div class="cft-task-assignee" data-title="Task assignee">
                  {{ task.assignee }}
                </div>
              </div>
              <div class="cft-task-details-assign font-11">
                <div class="created-details">
                  <div>
                    <span v-if="task.due">
                      Due {{ timedifference(task.due) }},
                    </span>
                    <span v-if="task.followUp">
                      Follow-up {{ timedifference(task.followUp) }},
                    </span>
                    <span v-if="task.created">
                      Created {{ timedifference(task.created) }}
                    </span>
                  </div>
                  <div class="cft-priority" data-title="priority">
                    {{ task.priority }}
                  </div>
                </div>
              </div>
            </div>
          </b-list-group-item>
          <b-pagination-nav
            :link-gen="linkGen"
            :number-of-pages="numPages"
            v-model="currentPage"
            class="cft-paginate"
          />
        </b-list-group>
        <b-list-group cols="3" v-else>
          <b-row class="cft-not-selected mt-2 ml-1 row">
            <i class="bi bi-exclamation-circle-fill" scale="1"></i>
            <p>No tasks found in the list.</p>
          </b-row>
        </b-list-group>
      </b-col>
      <!-- Task Detail section -->
      <b-col v-if="selectedTask" lg="9" md="9" sm="12">
        <div class="cft-service-task-details">
          <b-row class="ml-0 task-header task-header-title" data-title="Task Name">
            {{ task.name }}</b-row
          >
          <br />
          <b-row class="ml-0 task-name">
            <span class="cft-process-name" data-title="Process Name">{{ taskProcess }}</span></b-row
          >
          <br />
          <b-row class="ml-0 cft-application-id" data-title="application ID"
            >Application ID # {{ applicationId }}</b-row
          >
          <div style="height:100%;">
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
                <div
                  v-b-modal.AddGroupModal
                  v-if="groupListNames"
                  class="cft-groups"
                  data-title="groups"
                >
                  <i class="bi bi-grid-3x3-gap-fill"></i>
                  {{ String(groupListNames) }}
                </div>				 
                <div
                  v-b-modal.AddGroupModal 
                  data-title="groups"
                  v-else
                >
                  <i class="bi bi-grid-3x3-gap-fill"></i> Add Groups
                </div>
                <b-modal
                  id="AddGroupModal"
                  ref="modal"
                  title="Manage Groups"
                  ok-title="Close"
                  ok-only
                >
                  <div class="modal-text">
                    <i class="bi bi-exclamation-circle"></i>
                    You can add a group by typing a group ID into the input
                    field and afterwards clicking the button with the plus sign.
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
                        <input
                          type="text"
                          placeholder="Group ID"
                          v-model="setGroup"
                          v-on:keyup.enter="addGroup"
                        />
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col v-if="groupList.length">
                        <ul v-for="g in groupList" :key="g.groupId">
                          <div class="mt-1">
                            <i
                              class="fa fa-times mr-2 click-element"
                              @click="deleteGroup(g.groupId)"
                            ></i>
                            <span>{{ g.groupId }}</span>
                          </div>
                        </ul>
                      </b-col>
                    </b-row>
                  </div>
                </b-modal>
              </b-col>
              <b-col>
                <div
                  class="cft-task-assignee"
                  v-if="task.assignee"
                  data-title="Reset assignee"
                >
                  <i class="bi bi-person-fill cft-person-fill" />
                  <span class="cft-user-span">
                  <b-form-select
                    class="cft-user-select"
                    v-model="userSelected"
                    :options="userList"
                    @change="onSetassignee"
                    >
                  </b-form-select>
                    <i class="bi bi-x cft-user-close" @click="onUnClaim" />
                  </span>
                </div>
                <div class="cft-task-assignee" v-else @click="onClaim">
                  <i class="bi bi-person-fill" />
                  Claim
			
                </div>
              </b-col>
            </b-row>
            <div style="height:100%;">
              <!-- form section -->
              <b-tabs style="height:100%;" content-class="mt-3" v-if="showfrom">
                <b-tab title="Form">
                  <div class="ml-4 mr-4">
                    <b-overlay
                      :show="task.assignee !== userName"
                      variant="light"
                      opacity="0.75"
                      spinner-type="none"
                      aria-busy="true"
                    >
                      <formio
                        :src="formioUrl"
                        :submission="submissionId"
                        :form="formId"
                        :options="
                          task.assignee === userName ? options : readoption
                        "
                        v-on:submit="onFormSubmitCallback"
                        v-on:customEvent="oncustomEventCallback"
                      ></formio>
                    </b-overlay>
                  </div>
                </b-tab>
                <b-tab title="History"></b-tab>
                <!-- Process diagram -->
                <b-tab
                  style="height:100%;"
                  id="diagramContainer"
                  title="Diagram"
                >
                  <div style="height:100%;" id="canvas"></div>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
      </b-col>
      <b-col v-else>
        <b-row class="cft-not-selected mt-2 ml-1 row">
          <i
            class="bi bi-exclamation-circle-fill"
            variant="secondary"
            scale="1"
          ></i>
          <p>Select a task in the list.</p>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
// removed for this project since its making some issue
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
import "font-awesome/scss/font-awesome.scss";
import 'formiojs/dist/formio.full.min.css'
import 'vue2-datepicker/index.css';
import 'semantic-ui-css/semantic.min.css';
import '../user-styles.css'
import '../camundaFormIOTasklist.scss'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  TASK_FILTER_LIST_DEFAULT_PARAM,
  decodeTokenValues,
  findFilterKeyOfAllTask,
  getTaskFromList,
  sortingList,
} from '../services/utils';
import BpmnJS from 'bpmn-js';
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import FormListModal from './FormListModal.vue';
import Modeler from 'bpmn-js/lib/Modeler';
// import TaskListSearch from "../components/Tasklist-Search.vue";
import TaskSortOptions from '../components/tasklist-sortoptions.vue';
import {authenticateFormio} from "../services/formio-token";
import {getFormDetails} from '../services/get-formio';
import {getISODateTime} from '../services/format-time';
import moment from "moment";
import vueBpmn from "vue-bpmn";


@Component({
  components: {
    formio: Form,
    DatePicker,
    FormListModal,
    // TaskListSearch,
    TaskSortOptions,
    vueBpmn,
    Modeler,
    BpmnJS,
  },
})
export default class Tasklist extends Vue {
  @Prop() private bpmApiUrl!: string;
  @Prop() private token!: string;
  @Prop() private formIOResourceId!: string;
  @Prop() private formIOReviewerId!: string;
  @Prop() private formIOReviewer!: string;
  @Prop() private formIOApiUrl!: string;
  @Prop() private formsflowaiApiUrl!: string;
  @Prop() private formsflowaiUrl!: string;
  @Prop() private formIOUserRoles!: string;
  @Prop() private userName!: string;

  private tasks: Array<object> = [];
  private getProcessDefinitions: Array<object> = [];
  private taskProcess = null;
  private formId = '';
  private submissionId = '';
  private formioUrl = '';
  private activeIndex = 0;
  private task: any;
  private setFollowup = null;
  private setDue = null;
  private setGroup = null;
  private selectedTask = '';
  private userSelected = null;
  private showfrom = false;
  private currentPage = 1;
  private perPage = 15;
  private numPages = 5;
  private tasklength = 0;
  private readoption = { readOnly: true };
  private options = {
    noAlerts: false,
    i18n: {
      en: {
        error: "Please fix the errors before submitting again.",
      },
    },
  };
 
  private filterList = [];
  private activefilter = 0;
  private applicationId = '';
  private groupList = [];
  private groupListNames: Array<string> | null = null;
  private groupListItems: string[] = [];
  private userEmail = "external";
  private selectedfilterId = '';
  private xmlData!: string;
  private sortList = TASK_FILTER_LIST_DEFAULT_PARAM;
  private sortOptions: Array<object> = [];
  private userList: Array<object> = [];
  private updateSortOptions: Array<object> = [];
  private setupdateSortListDropdownindex = 0;
  private showSortListDropdown = [false, false, false, false, false, false];
  private showaddNewSortListDropdown = false;
  private payload: any = {
    active: true,
    sorting: TASK_FILTER_LIST_DEFAULT_PARAM,
  };
  private showUserList = false;
  
@Watch('token')
  ontokenChange (newVal: any) {
  // updating token
    localStorage.setItem("authToken", newVal);
  }


checkPropsIsPassedAndSetValue() {
  if (!this.bpmApiUrl || this.bpmApiUrl === "") {
    console.warn("bpmApiUrl prop not Passed");
  }
  if (!this.token || this.token === "") {
    console.warn("token prop not Passed");
  }
  if (!this.formIOResourceId || this.formIOResourceId === "") {
    console.warn("formIOResourceId prop not passed");
  }
  if (!this.formIOReviewerId || this.formIOReviewerId === "") {
    console.warn("formIOReviewerId prop not passed");
  }
  if (!this.formIOApiUrl || this.formIOApiUrl === "") {
    console.warn("formIOApiUrl prop not passed");
  }
  if (!this.formsflowaiApiUrl || this.formsflowaiApiUrl === "") {
    console.warn("formsflow.ai API url prop not passed");
  }
  if (!this.formsflowaiUrl || this.formsflowaiUrl === "") {
    console.warn("formsflow.ai URL prop not passed");
  }
  const engine = "/engine-rest";
  localStorage.setItem("bpmApiUrl", this.bpmApiUrl + engine);
  localStorage.setItem("authToken", this.token);
  localStorage.setItem("formsflow.ai.url", this.formsflowaiUrl);
  localStorage.setItem("formsflow.ai.api.url", this.formsflowaiApiUrl);

  const val = decodeTokenValues(
    this.token,
    this.userName,
    this.formIOUserRoles
  );
  this.userName = val.userName;
  this.userEmail = val.userEmail;
  this.formIOUserRoles = val.formIOUserRoles;
}

timedifference(date: Date) {
  return moment(date).fromNow();											
}													   

getProcessDataFromList(processList: any[], processId: string, dataKey: string) {
  const process = processList.find((process) => process.id === processId);
  return process && process[dataKey];
}

setselectedTask(task: string) {
  this.selectedTask = task;
  this.fetchData();
}

toggle(index: number) {
  this.activeIndex = index;						  
}

togglefilter(index: number) {
  this.activefilter = index;
}

cftShowUserList() {
  this.showUserList = !this.showUserList;
}

addGroup() {
  CamundaRest.createTaskGroupByID(
    this.token,
    this.task.id,
    this.bpmApiUrl,
    { userId: null, groupId: this.setGroup, type: "candidate" }
  ).then(() => {
    this.getGroupDetails();
    this.reloadCurrentTask();
  });
}

getGroupDetails() {
  CamundaRest.getTaskGroupByID(this.token, this.task.id, this.bpmApiUrl).then(
    (response) => {
      this.groupList = response.data;
      this.groupListItems = [];
      this.groupListNames = null;
      for (const group of response.data) {
        this.groupListItems.push(group.groupId);
      }
      if (this.groupListItems.length) {
        this.groupListNames = this.groupListItems;
      }
    }
  );
}

deleteGroup(groupid: string) {		 
  CamundaRest.deleteTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {
    groupId: groupid,
    type: "candidate",
  }).then(() => {
    this.getGroupDetails();
    this.reloadCurrentTask();
  });
}
 

onFormSubmitCallback() {
  if (this.task.id) {
    this.onBPMTaskFormSubmit(this.task.id);								   
  }					  
}
 

onBPMTaskFormSubmit(taskId: string) {
  const formRequestFormat = {
    variables: {
      formUrl: {
        value: this.formioUrl,
      },
      applicationId: {
        value: this.applicationId,
      },
    },
  };
  CamundaRest.formTaskSubmit(
    this.token,
    taskId,
    formRequestFormat,
    this.bpmApiUrl
  )
    .then(() => {
      this.reloadCurrentTask();
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

getBPMTaskDetail(taskId: string) {
  CamundaRest.getTaskById(this.token, taskId, this.bpmApiUrl).then(
    (result) => {
      this.task = result.data;
    }		   
  );
	
 

  this.showfrom = false;
  CamundaRest.getVariablesByTaskId(
    this.token,
    this.selectedTask,
    this.bpmApiUrl
  ).then((result) => {
    this.formioUrl = result.data["formUrl"].value;
    const { formioUrl, formId, submissionId } = getFormDetails(
      this.formioUrl,
      this.formIOApiUrl
    );
    this.formioUrl = formioUrl;
    this.submissionId = submissionId;
    this.formId = formId;

    this.showfrom = true;
  });
}
	

  oncustomEventCallback = (customEvent: any) => {
    switch (customEvent.type) {
    case "reloadTasks":
      this.reloadTasks();
      break;
    case "reloadCurrentTask":
      this.reloadCurrentTask();
      break;
    }
  };

  reloadTasks() {
    //used to unSelect the task and refresh taskList
    this.selectedTask = "";
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }

  reloadCurrentTask() {
    //used to refresh selected task and taskList
    this.getBPMTaskDetail(this.task.id);
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }
 

  onClaim() {
    CamundaRest.claim(
      this.token,
      this.task.id,
      { userId: this.userName },
      this.bpmApiUrl
    )
      .then(() => {
        this.reloadCurrentTask();
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  onUnClaim() {				  
    CamundaRest.unclaim(this.token, this.task.id, this.bpmApiUrl)
      .then(() => {
        this.reloadCurrentTask();
      })
      .catch((error) => {
        console.error("Error", error);
      });
  }

  onSetassignee() {
    CamundaRest.setassignee(this.token, this.task.id,
      {"userId": this.userSelected},
      this.bpmApiUrl)
      .then(() => {
        this.reloadCurrentTask()
      })
      .catch((error) => {
        console.error("Error", error);
      })
  }

  fetchTaskList(filterId: string, requestData: object) {
    this.selectedfilterId = filterId;
    CamundaRest.filterTaskList(
      this.token,
      filterId,
      requestData,
      this.bpmApiUrl
    ).then((result) => {
      this.tasks = result.data.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
      this.tasklength = result.data.length;
      this.numPages = Math.ceil(result.data.length / this.perPage);
    });
  }
  numberOfPages() {
    if (Math.ceil(this.tasks.length / this.perPage) > 1)
      return Math.ceil(this.tasks.length / this.perPage);
    else {
      return 15;
    }
  }

  linkGen() {
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }
 

  getOptions(options: any) {
    const optionsArray: {
      sortOrder: string;
      label: string;
      sortBy: string;
    }[] = [];
    sortingList.forEach((sortOption) => {
      if (
        !options.some(
          (option: { sortBy: string }) => option.sortBy === sortOption.sortBy
        )
      ) {
        optionsArray.push({ ...sortOption });
      }
    });
    return optionsArray;
  }

  addSort(sort: any) {
    this.sortList.push(sort);
    if (this.sortList.length === sortingList.length) {
      this.updateSortOptions = this.sortOptions;
    } else {
      this.sortOptions = this.getOptions(this.sortList);
    }
    this.showaddNewSortListDropdown = false;									  
  }

  showaddSortListOptions() {
    this.showaddNewSortListDropdown = !this.showaddNewSortListDropdown;
    this.sortOptions = this.getOptions(this.sortList);
  }

  showUpdateSortOptions(index: number) {
    for(let i =0; i<6;i++){
      if(this.showSortListDropdown[i]===true){
        this.showSortListDropdown[i] = false;
      }
    }
    this.showSortListDropdown[index] = !this.showSortListDropdown[index];
    this.sortOptions = this.getOptions(this.sortList);
    this.setupdateSortListDropdownindex = index;
  }

  updateSort(sort: any, index: number) {
    this.sortList[index].label = sort.label;
    this.sortList[index].sortBy = sort.sortBy;

    this.sortOptions = this.getOptions(this.sortList);
    this.showSortListDropdown[index] = false;
    this.payload["sorting"] = this.sortList;
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }

  deleteSort(sort: any, index: number) {
    this.sortList.splice(index, 1);
    this.updateSortOptions = [];
    this.sortOptions = this.getOptions(this.sortList);
    this.payload["sorting"] = this.sortList;
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }

  toggleSort(index: number) {
    if (this.sortList[index].sortOrder === "asc")
      this.sortList[index].sortOrder = "desc";
  
    else {
      this.sortList[index].sortOrder = "asc";
    }
    this.payload["sorting"] = this.sortList;
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }

  updateFollowUpDate() {
    const referenceobject = this.task;
    referenceobject['followUp'] = getISODateTime(this.setFollowup);
    if(this.setFollowup && referenceobject['followUp']){
      CamundaRest.updateTasksByID(
        this.token,
        this.task.id,
        this.bpmApiUrl,
        referenceobject
      )
        .then(() => {
          console.warn("Updated follow up date");
          this.reloadCurrentTask();
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
    else {
      console.warn("Follow date error");
    }
  }

  updateDueDate() {
    const referenceobject = this.task;
    referenceobject['due'] = getISODateTime(this.setDue);
    if(this.setFollowup && referenceobject['due']){
      CamundaRest.updateTasksByID(
        this.token,
        this.task.id,
        this.bpmApiUrl,
        referenceobject
      )
        .then(() => {
          console.warn("Update due date");
          this.reloadCurrentTask();
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
    else {
      console.warn("Due date error");
    }
  }

  fetchData() {
    if (this.selectedTask) {
      this.task = getTaskFromList(this.tasks, this.selectedTask);
      this.getGroupDetails();
      CamundaRest.getTaskById(
        this.token,
        this.selectedTask,
        this.bpmApiUrl
      ).then((result) => {
        CamundaRest.getProcessDefinitionById(
          this.token,
          result.data.processDefinitionId,
          this.bpmApiUrl
        ).then((res) => {
          this.taskProcess = res.data.name;
        });
        CamundaRest.getProcessDiagramXML(
          this.token,
          result.data.processDefinitionId,
          this.bpmApiUrl
        ).then(async (res) => {
          this.xmlData = res.data.bpmn20Xml;
          const modeler = new Modeler({ container: "#canvas" });
          await modeler.importXML(this.xmlData);
        });
      });

      this.showfrom = false;
      CamundaRest.getVariablesByTaskId(
        this.token,
        this.selectedTask,
        this.bpmApiUrl
      ).then((result) => {
        this.applicationId = result.data["applicationId"].value;
        this.formioUrl = result.data["formUrl"].value;
        const { formioUrl, formId, submissionId } = getFormDetails(
          this.formioUrl,
          this.formIOApiUrl
        );
        this.formioUrl = formioUrl;
        this.submissionId = submissionId;
        this.formId = formId;
        this.showfrom = true;
      });
      this.userSelected = this.task.assignee;									   
    }
  }
 

  mounted() {
    this.checkPropsIsPassedAndSetValue();
    authenticateFormio(
      this.formIOResourceId,
      this.formIOReviewerId,
      this.formIOReviewer,
      this.userEmail,
      this.formIOUserRoles
    );
    CamundaRest.filterList(this.token, this.bpmApiUrl).then((response) => {
      this.filterList = response.data;
      const key = findFilterKeyOfAllTask(this.filterList, "name", "All tasks");
      this.fetchTaskList(key, this.payload);
    });

    this.fetchData();
    this.sortOptions = this.getOptions([]);
    CamundaRest.getProcessDefinitions(this.token, this.bpmApiUrl).then(
      (response) => {
        this.getProcessDefinitions = response.data;
      }
    );
    CamundaRest.getUsers(this.token, this.bpmApiUrl).then((response) => {
      const result = response.data.map((e: { id: number }) => ({ value: e.id,text:e.id }));
      this.userList = result;
    });
  }
}
</script>
