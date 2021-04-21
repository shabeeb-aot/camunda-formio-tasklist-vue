<template> 
<b-container fluid class="task-outer-container">
  <Header
  v-if="token  && bpmApiUrl"
  :token="token"
  :bpmApiUrl="bpmApiUrl"
  :filterList="filterList"
  :perPage="perPage"
  :selectedfilterId="selectedfilterId"
  :payload="payload"
  />
    <b-row class="cft-service-task-list mt-1">
      <b-col xl="3" lg="3" md="12" class="cft-first">
        <LeftSider
          v-if="token  && bpmApiUrl"
          :token="token"
          :formsflowaiApiUrl="formsflowaiApiUrl"
          :formIOApiUrl="formIOApiUrl"
          :bpmApiUrl="bpmApiUrl"
          :tasks='tasks'
          :Lentask='tasklength'
          :perPage="perPage"
          :selectedfilterId="selectedfilterId"
          :payload="payload"
        />
      </b-col>
      
      <b-col v-if="selectedTaskId" lg="9" md="12">
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
          <div class="cft-actionable-container">
            <b-row class="cft-actionable">
              <b-col v-if='task.followUp'>
                <span>
                  <i class="fa fa-calendar"></i>
                  {{timedifference(task.followUp)}}
                  <i class="bi bi-x-circle" @click="removeFollowupDate"></i>
                </span>
              </b-col>
              <b-col v-else>
                <DatePicker
                  type="datetime"
                  placeholder="Set Follow-up date"
                  v-model="setFollowup"
                  @change="updateFollowUpDate"
                ></DatePicker>
              </b-col>
              <b-col v-if='task.due'>
                <span>
                  <i class="fa fa-calendar"></i>
                  {{timedifference(task.due)}}
                  <i class="bi bi-x-circle" @click="removeDueDate"></i>
                </span>
              </b-col>
              <b-col v-else>
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
                  class="cft-groups"
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
                        <b-form-input
                          type="text"
                          placeholder="Group ID"
                          v-model="setGroup"
                          v-on:keyup.enter="addGroup"
                        >
			</b-form-input>
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
                >
                  <div v-if="editAssignee" class="cft-user-edit">
                    <div class='cft-assignee-change-box row'>
                      <v-select :options="autoUserList" :reduce="user => user" v-model="userSelected" class="col-9"/>
                      <span @click="onSetassignee" class="col-1">
                        <i class="bi bi-check"></i>
                      </span>
                      <span @click="toggleassignee" class="col-1">
                        <i class="fa fa-times ml-1"></i>
                      </span>
                    </div>
                  </div>
                  <div class="cft-user-details" v-else @click="toggleassignee"> 
                    <i class="bi bi-person-fill cft-person-fill" />
                    <span class="cft-user-span" data-title="Click to change assignee">
                    {{task.assignee}}
                    </span>
                    <i class="fa fa-times ml-1 cft-remove-user"  data-title="Reset assignee" @click="onUnClaim" />
                  </div>
                </div>
                <div class="cft-task-assignee" v-else @click="onClaim" data-title="Set assignee">
                  <i class="bi bi-person-fill" />
                  Claim
                </div>
              </b-col>
            </b-row>
            <div class="height-100">
              <!-- form section -->
              <b-tabs class="height-100" content-class="mt-3">
                <b-tab title="Form">
                  <div v-if="showfrom" class="ml-4 mr-4">
                    <b-overlay
                      :show="task.assignee !== userName"
                      variant="light"
                      opacity="0.75"
                      spinner-type="none"
                      aria-busy="true"
                    >
                      <formio
                        :src="formioUrl"
                        :options="
                          task.assignee === userName ? options : readoption
                        "
                        v-on:submit="onFormSubmitCallback"
                        v-on:customEvent="oncustomEventCallback"
                      ></formio>
                    </b-overlay>
                  </div>
                </b-tab>
                <b-tab title="History">
                  <TaskHistory :taskHistoryList='taskHistoryList' :applicationId="applicationId"/>
                </b-tab>
                <b-tab
                  class="cft-diagram-container"
                  id="diagramContainer"
                  title="Diagram"
                >
                  <div class="diagram-full-screen" id="canvas"></div>
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
import "vue-select/src/scss/vue-select.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'font-awesome/scss/font-awesome.scss';
import 'formiojs/dist/formio.full.min.css'
import 'vue2-datepicker/index.css';
import 'semantic-ui-css/semantic.min.css';
import '../styles/user-styles.css'
import '../styles/camundaFormIOTasklist.scss'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import vSelect from 'vue-select'

import {
  TASK_FILTER_LIST_DEFAULT_PARAM,
  decodeTokenValues,
  findFilterKeyOfAllTask,
  getTaskFromList,
} from '../services/utils';
import BpmnJS from 'bpmn-js';
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import Header from './layout/header.vue'
import LeftSider from './layout/left-sider.vue'
import Modeler from 'bpmn-js/lib/Modeler';
import {Payload} from '../services/TasklistTypes';
import SocketIOService from '../services/SocketIOServices';
import TaskHistory from '../components/TaskHistory.vue';
import {authenticateFormio} from '../services/formio-token';
import {getFormDetails} from '../services/get-formio';
import {getISODateTime} from '../services/format-time';
import {getformHistoryApi} from '../services/formsflowai-api';
import moment from 'moment';
import vueBpmn from 'vue-bpmn';


@Component({
  components: {
    formio: Form,
    DatePicker,
    TaskHistory,
    vueBpmn,
    Modeler,
    BpmnJS,
    Header,
    LeftSider,
    vSelect
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
  @Prop({default:'formflowai'}) private webSocketEncryptkey !: string;

  private tasks: Array<object> = [];
  private taskProcess = null;
  private processDefinitionId = '';
  private formId = '';
  private submissionId = '';
  private formioUrl = '';
  private task: any;
  private setFollowup = null;
  private setDue = null;
  private setGroup = null;
  private selectedTaskId = '';
  private userSelected = null;
  private showfrom = false;
  public currentPage = 1;
  public perPage = 10;
  public numPages = 5;
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
  private editAssignee = false;
  private applicationId = '';
  private groupList = [];
  private groupListNames: Array<string> | null = null;
  private groupListItems: string[] = [];
  private userEmail = 'external';
  private selectedfilterId = '';
  private xmlData!: string;
  // private sortList = TASK_FILTER_LIST_DEFAULT_PARAM;
  // private sortOptions: Array<object> = [];
  private userList: Array<object> = [];
  // private updateSortOptions: Array<object> = [];
  // private setupdateSortListDropdownindex = 0;
  // private showSortListDropdown = [false, false, false, false, false, false];
  // private showaddNewSortListDropdown = false;
  private payload: Payload = {
    active: true,
    sorting: TASK_FILTER_LIST_DEFAULT_PARAM,
    firstResult: 0,
    maxResults: this.perPage
  };
  private showUserList = false;
  private taskHistoryList: Array<object> = [];
  private autoUserList: any = []
  
@Watch('token')
  ontokenChange (newVal: string) {
  // updating token
    localStorage.setItem("authToken", newVal);
  }

@Watch('currentPage')
onPageChange(newVal: number) {
  this.payload["firstResult"] = (newVal-1)*this.perPage
  this.payload["maxResults"] = this.perPage
  this.fetchPaginatedTaskList(this.selectedfilterId, this.payload, (newVal-1)*this.perPage, this.perPage);
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
  if(!this.webSocketEncryptkey || this.webSocketEncryptkey === ""){
    console.warn('WEBSOCKET_ENCRYPT_KEY prop not passed')
  }
  const engine = "/engine-rest";
  localStorage.setItem("bpmApiUrl", this.bpmApiUrl + engine);
  localStorage.setItem("authToken", this.token);
  const currentUrl = window.location.protocol + '//' +  window.location.host
  localStorage.setItem("formsflow.ai.url", currentUrl);
  localStorage.setItem("formsflow.ai.api.url", this.formsflowaiApiUrl);
  localStorage.setItem("formioApiUrl", this.formIOApiUrl);
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

toggleassignee()  {
  this.editAssignee = ! this.editAssignee;
  this.userSelected = this.task.assignee;
}

onFormSubmitCallback() {
  if (this.task.id) {
    this.onBPMTaskFormSubmit(this.task.id);
    this.reloadTasks();					   
  }					  
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
    this.setGroup = null;
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
    this.selectedTaskId,
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
    this.selectedTaskId = "";
    this.fetchPaginatedTaskList(this.selectedfilterId, this.payload, 0, this.perPage);
  }

  reloadCurrentTask() {
    this.getBPMTaskDetail(this.task.id);
    // this.fetchPaginatedTaskList(this.selectedfilterId, this.payload);
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
    this.editAssignee = false;
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
    this.toggleassignee();
  }

  fetchTaskList(filterId: string, requestData: object) {
    CamundaRest.filterTaskList(
      this.token,
      filterId,
      requestData,
      this.bpmApiUrl
    ).then((result) => {
      this.tasklength = result.data.length;
    });
  }

  
  fetchPaginatedTaskList(filterId: string, requestData: object, first: number, max: number) {
    this.selectedfilterId = filterId;
    CamundaRest.filterTaskListPagination(
      this.token,
      filterId,
      requestData,
      first,
      max,
      this.bpmApiUrl
    ).then((result) =>{
      this.tasks = result.data;
    });
  }

  // getOptions(options: any) {
  //   const optionsArray: {
  //     sortOrder: string;
  //     label: string;
  //     sortBy: string;
  //   }[] = [];
  //   sortingList.forEach((sortOption) => {
  //     if (
  //       !options.some(
  //         (option: { sortBy: string }) => option.sortBy === sortOption.sortBy
  //       )
  //     ) {
  //       optionsArray.push({ ...sortOption });
  //     }
  //   });
  //   return optionsArray;
  // }

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
  }

  removeDueDate() {
    const referenceobject = this.task;
    referenceobject["due"] = null;
    CamundaRest.updateTasksByID(
      this.token,
      this.task.id,
      this.bpmApiUrl,
      referenceobject
    ).then(() => {
      this.reloadCurrentTask();
    })
  }

  removeFollowupDate() {
    const referenceobject = this.task;
    referenceobject["followUp"] = null;
    CamundaRest.updateTasksByID(
      this.token,
      this.task.id,
      this.bpmApiUrl,
      referenceobject
    ).then(() => {
      this.reloadCurrentTask();
    })
  }

  fetchData() {
    if (this.selectedTaskId) {
      this.task = getTaskFromList(this.tasks, this.selectedTaskId);
      this.getGroupDetails();
      CamundaRest.getTaskById(
        this.token,
        this.selectedTaskId,
        this.bpmApiUrl
      ).then((result) => {
        CamundaRest.getProcessDefinitionById(
          this.token,
          result.data.processDefinitionId,
          this.bpmApiUrl
        ).then((res) => {
          this.taskProcess = res.data.name;
        });

        CamundaRest.getVariablesByProcessId(
          this.token,
          result.data.processInstanceId,
          this.bpmApiUrl
        )

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
        this.selectedTaskId,
        this.bpmApiUrl
      ).then((result) => {
        if(result.data && result.data["applicationId"].value) {
          getformHistoryApi(this.formsflowaiApiUrl, result.data["applicationId"].value, this.token)
            .then((r)=> {
              this.taskHistoryList = r.data.applications;
            })
        }
        else {
          console.warn("The selected task has no applicationid")
        }
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
        this.userSelected = this.task.assignee;
      });
    }
  }
  
  mounted() {
    this.$root.$on('call-fetchData', (para: any) => {
      this.selectedTaskId = para.selectedTaskId
      this.fetchData()
    })

    this.$root.$on('call-fetchPaginatedTaskList', (para: any) => {
      this.selectedfilterId = para.filterId;
      this.payload = para.requestData;
      this.fetchPaginatedTaskList(para.filterId, para.requestData, para.firstResult, para.maxResults);
    })

    this.$root.$on('call-fetchTaskList', (para: any) => {
      this.fetchTaskList(para.filterId, para.requestData)
    })

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
      this.selectedfilterId = findFilterKeyOfAllTask(this.filterList, "name", "All tasks");
      this.fetchTaskList(this.selectedfilterId, this.payload);
      this.fetchPaginatedTaskList(this.selectedfilterId, this.payload, this.currentPage, this.perPage);
    });

    if(SocketIOService.isConnected()) {
      SocketIOService.disconnect();
    }
    SocketIOService.connect(this.webSocketEncryptkey, (refreshedTaskId: any)=> {
      if(this.selectedfilterId){
        this.fetchPaginatedTaskList(this.selectedfilterId, this.payload, this.currentPage, this.perPage);
        console.log("reached socketIO")
        this.fetchData();
      }
      if(this.selectedTaskId && refreshedTaskId===this.selectedTaskId){
        this.fetchData()
        this.reloadCurrentTask();
      }
    })

    CamundaRest.getUsers(this.token, this.bpmApiUrl).then((response) => {
      const result = response.data.map((e: { id: number }) => ({ value: e.id,text:e.id }));
      this.userList = result;
      this.autoUserList = response.data.map((e: { id: number }) => (e.id));
    });
  }

  beforeDestroy() {
    SocketIOService.disconnect();
  }
}
</script>