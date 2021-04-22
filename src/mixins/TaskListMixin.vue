<script lang="ts">
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'font-awesome/scss/font-awesome.scss';
import 'formiojs/dist/formio.full.min.css'
import 'vue2-datepicker/index.css';
import 'semantic-ui-css/semantic.min.css';
import '../styles/user-styles.css'
import '../styles/camundaFormIOTasklist.scss'

import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
// import Vue from 'vue'
import {
  TASK_FILTER_LIST_DEFAULT_PARAM,
  findFilterKeyOfAllTask,
  getFormattedDateAndTime,
  getTaskFromList,
  sortingList,
} from '../services/utils';
import BpmnJS from 'bpmn-js';
import CamundaRest from '../services/camunda-rest';
import DatePicker from 'vue2-datepicker';
import Modeler from 'bpmn-js/lib/Modeler';
import { Form } from 'vue-formio';
import {Payload} from '../services/TasklistTypes';
import SocketIOService from '../services/SocketIOServices';
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
    vueBpmn,
    Modeler,
    BpmnJS,
  }
})
export default class TaskListMixin extends Vue {
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
    private getProcessDefinitions: Array<object> = [];
    private taskProcess = null;
    private processDefinitionId = '';
    private formId = '';
    private submissionId = '';
    private formioUrl = '';
    private activeIndex = 0;
    private task: any;
    private setFollowup = null;
    private setDue = null;
    private setGroup = null;
    private selectedTaskId = '';
    private userSelected = null;
    private showfrom = false;
    private currentPage = 1;
    private perPage = 10;
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
    private showfilter=false;
    private selectedfilterId = '';
    private sortList = TASK_FILTER_LIST_DEFAULT_PARAM;
    private sortOptions: Array<object> = [];
    private userList: Array<object> = [];
    private userEmail = 'external';
    private updateSortOptions: Array<object> = [];
    private setupdateSortListDropdownindex = 0;
    private showSortListDropdown = [false, false, false, false, false, false];
    private showaddNewSortListDropdown = false;
    private payload: Payload = {
      active: true,
      sorting: TASK_FILTER_LIST_DEFAULT_PARAM,
      firstResult: 0,
      maxResults: this.perPage
    };
    private showUserList = false;
    private taskHistoryList: Array<object> = [];
    private applicationId = '';
    private xmlData!: string;
    private groupList = [];
    private groupListNames: Array<string> | null = null;
    private groupListItems: string[] = [];
  
@Watch('token')
    ontokenChange (newVal: string) {
      // updating token
      localStorage.setItem("authToken", newVal);
    }

@Watch('currentPage')
onPageChange(newVal: number) {
  console.log(newVal)
  this.payload["firstResult"] = (newVal-1)*this.perPage
  this.payload["maxResults"] = this.perPage
//   this.fetchTaskPaginatedList(this.selectedfilterId, this.payload, (newVal-1)*this.perPage, this.perPage);
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
  const socketUrl = "/forms-flow-bpm-socket";
  localStorage.setItem("bpmApiUrl", this.bpmApiUrl + engine);
  localStorage.setItem("authToken", this.token);
  const currentUrl = window.location.protocol + '//' +  window.location.host
  localStorage.setItem("formsflow.ai.url", currentUrl);
  localStorage.setItem("formsflow.ai.api.url", this.formsflowaiApiUrl);
  localStorage.setItem("formioApiUrl", this.formIOApiUrl);
}

timedifference(date: Date) {
  return moment(date).fromNow();
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
	
reloadTasks() {
  this.selectedTaskId = "";
  this.fetchTaskList(this.selectedfilterId, this.payload);
}

reloadCurrentTask() {
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

fetchData() {
  if (this.selectedTaskId) {
    console.log(this.tasks)
    //Here old tasks are coming itself(0-10)
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
  });

  this.fetchData();
  if(SocketIOService.isConnected()) {
    SocketIOService.disconnect();
  }
    
  SocketIOService.connect(this.webSocketEncryptkey, (refreshedTaskId: any)=> {
    if(this.selectedfilterId){
      //Refreshes the Task
      this.fetchTaskList(this.selectedfilterId, this.payload);
      this.fetchData();
    }
    if(this.selectedTaskId && refreshedTaskId===this.selectedTaskId){
      this.fetchData()
      this.reloadCurrentTask();
    }
  })

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

beforeDestroy() {
  SocketIOService.disconnect();
}
}
</script>