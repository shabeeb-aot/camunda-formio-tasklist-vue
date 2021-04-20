<template> 
<span>
    <TaskListSearch
    @update-task-list="updateTasklistResult"
    :tasklength="tasklength"
    />
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
            <h5 class="cft-task-title" data-title='Task Name'>{{ task.name }}</h5>
            <div class="cft-task-details-assign assigne-details ">
            <div class='cft-process-title' data-tile='Process Definition Name'>
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
                <span class="cft-due-date" :data-title="getExactDate(task.due)" v-if="task.due">
                    Due {{ timedifference(task.due) }},
                </span>
                <span class="cft-due-date" :data-title="getExactDate(task.followUp)" v-if="task.followUp">
                    Follow-up {{ timedifference(task.followUp) }},
                </span>
                <span class="cft-due-date" :data-title="getExactDate(task.created)" v-if="task.created">
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
    </span>
</template>

<script lang="ts">
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'font-awesome/scss/font-awesome.scss';
import 'formiojs/dist/formio.full.min.css'
import 'vue2-datepicker/index.css';
import 'semantic-ui-css/semantic.min.css';
import '../../styles/user-styles.css'
import '../../styles/camundaFormIOTasklist.scss'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  TASK_FILTER_LIST_DEFAULT_PARAM,
  findFilterKeyOfAllTask,
  getFormattedDateAndTime,
  getTaskFromList,
  sortingList,
} from '../../services/utils';
import BpmnJS from 'bpmn-js';
import CamundaRest from '../../services/camunda-rest';
import DatePicker from 'vue2-datepicker'
import { Form } from 'vue-formio';
import FormListModal from '../../components/FormListModal.vue';
import Modeler from 'bpmn-js/lib/Modeler';
import {Payload} from '../../services/TasklistTypes';
import SocketIOService from '../../services/SocketIOServices';
import TaskHistory from '../../components/TaskHistory.vue';
import TaskListSearch from '../../components/TaskListSearch.vue';
import TaskSortOptions from '../../components/TaskListSortoptions.vue';
import {authenticateFormio} from '../../services/formio-token';
import {getFormDetails} from '../../services/get-formio';
import {getformHistoryApi} from '../../services/formsflowai-api';
import moment from 'moment';
import {searchQuery} from '../../services/search-constants';
import isEqual from 'lodash/isEqual';
import vueBpmn from 'vue-bpmn';


@Component({
  components: {
    formio: Form,
    DatePicker,
    FormListModal,
    TaskHistory,
    TaskListSearch,
    TaskSortOptions,
    vueBpmn,
    Modeler,
    BpmnJS,
  },
})
export default class Tasklist extends Vue {
  @Prop() private bpmApiUrl!: string;
  @Prop() private token!: string;
  @Prop() private formsflowaiApiUrl!: string;
  @Prop() private formIOApiUrl!: string;
  @Prop() private sortList !: any;

  private tasks: Array<object> = [];
  private getProcessDefinitions: Array<object> = [];
  private taskProcess = null;
  private processDefinitionId = '';
  private formId = '';
  private submissionId = '';
  private formioUrl = '';
  private activeIndex = 0;
  private task: any;
  private selectedTaskId = '';
  private userSelected = null;
  private showfrom = false;
  private currentPage = 1;
  private perPage = 10;
  private numPages = 5;
  private tasklength = 0;
  private editAssignee = false;
  private activefilter = 0;
  private applicationId = '';
  private groupList = [];
  private groupListNames: Array<string> | null = null;
  private groupListItems: string[] = [];
  private userEmail = 'external';
  private selectedfilterId = '';
  private xmlData!: string;
  private payload: Payload = {
    sorting: TASK_FILTER_LIST_DEFAULT_PARAM,
  };
  private showUserList = false;
  private taskHistoryList: Array<object> = [];

@Watch('token')
  ontokenChange (newVal: string) {
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
  if (!this.formsflowaiApiUrl || this.formsflowaiApiUrl === "") {
    console.warn("formsflow.ai API url prop not passed");
  }

  const engine = "/engine-rest";
  const socketUrl = "/forms-flow-bpm-socket";
  localStorage.setItem("bpmApiUrl", this.bpmApiUrl + engine);
  localStorage.setItem("authToken", this.token);
  localStorage.setItem("formsflow.ai.api.url", this.formsflowaiApiUrl);
  localStorage.setItem("formioApiUrl", this.formIOApiUrl);

  // const val = decodeTokenValues(
  //   this.token,
  //   this.userName,
  //   this.formIOUserRoles
  // );
  // this.userName = val.userName;
  // this.userEmail = val.userEmail;
  // this.formIOUserRoles = val.formIOUserRoles;
}

timedifference(date: Date) {
  return moment(date).fromNow();											
}													   

getProcessDataFromList(processList: any[], processId: string, dataKey: string) {
  const process = processList.find((process) => process.id === processId);
  return process && process[dataKey];
}

setselectedTask(task: string) {
  this.selectedTaskId = task;
  this.fetchData();
  this.$root.$emit('call-fetchData', {selectedTaskId: this.selectedTaskId})
}
getExactDate(date: Date) {
  return getFormattedDateAndTime(date);
}
toggle(index: number) {
  this.activeIndex = index;						  
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
	

  reloadCurrentTask() {
    //used to refresh selected task and taskList
    this.getBPMTaskDetail(this.task.id);
    this.fetchTaskList(this.selectedfilterId, this.payload);
  }
 
  fetchTaskList(filterId: string, requestData: object) {
    this.selectedfilterId = filterId;
    CamundaRest.filterTaskList(
      this.token,
      filterId,
      requestData,
      this.bpmApiUrl
    ).then((result) => {
      // this.fulltasks= result.data;
      this.tasks = result.data.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
      this.tasklength = result.data.length;
      this.numPages = Math.ceil(result.data.length / this.perPage);
    });
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

updateTasklistResult(queryList: object) {
  const requiredParams = {...{sorting:this.sortList},...queryList}
  console.log(this.payload);
  if(!isEqual(this.payload, requiredParams)){
    console.log("changed")
  // const combined = { ...this.payload, ...queryList}
    this.payload = requiredParams;
  // this.fetchTaskList(this.selectedfilterId, combined);
  this.$root.$emit('call-fetchTaskList', {filterId: this.selectedfilterId, requestData: this.payload})
  }
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
    this.$root.$on('call-fetchTaskList', (para: any) => {
        this.fetchTaskList(para.filterId, para.requestData)
    })

    this.checkPropsIsPassedAndSetValue();
    this.fetchData();
    CamundaRest.getProcessDefinitions(this.token, this.bpmApiUrl).then(
      (response) => {
        this.getProcessDefinitions = response.data;
      }
    );
  }
}
</script>
