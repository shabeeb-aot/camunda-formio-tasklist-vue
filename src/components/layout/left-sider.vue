<template> 
<span>
    <TaskListSearch
    @update-task-list="updateTasklistResult"
    :tasklength="Lentask"
    />
    <!-- Task list section -->
    <b-list-group class="cft-list-container" v-if="tasks && tasks.length">
        <b-list-group-item
        button
        v-for="(task, idx) in tasks"
        v-bind:key="task.id"
        v-on:click="toggle(idx)"
        :class="{ 'cft-selected': idx == activeIndex }"
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

        <b-pagination
        v-model="currentPage"
        :total-rows="Lentask"
        :per-page="perPage"
        />
        <!-- <b-pagination-nav
        :number-of-pages="numPages"
        v-model="currentPage"
        class="cft-paginate"
        /> -->
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
import CamundaRest from '../../services/camunda-rest';
import {Payload} from '../../services/TasklistTypes';
import TaskListSearch from '../../components/TaskListSearch.vue';
import {getFormattedDateAndTime} from '../../services/utils';
import isEqual from 'lodash/isEqual';
import moment from 'moment';


@Component({
  components: {
    TaskListSearch,
  },
})
export default class LeftSider extends Vue {
  @Prop() private bpmApiUrl!: string;
  @Prop() private token!: string;
  @Prop() private tasks !: Array<object>;
  @Prop() private selectedTaskId !: string;
  @Prop() private Lentask !: number;
  @Prop() private perPage !: number;
  @Prop() private selectedfilterId !: string;
  @Prop() private payload !: Payload;

  private getProcessDefinitions: Array<object> = [];
  private processDefinitionId = '';
  private activeIndex = 0;
  private sList: any;
  private sId = '';
  private currentPage = 1;

@Watch('currentPage')
  onPageChange(newVal: number) {
    this.payload["firstResult"] = (newVal-1)*this.perPage
    this.payload["maxResults"] = this.perPage
    this.$root.$emit('call-fetchPaginatedTaskList', {filterId: this.selectedfilterId, requestData: this.payload, firstResult: (newVal-1)*this.perPage, maxResults: this.perPage})
  }

checkPropsIsPassedAndSetValue() {
  if (!this.bpmApiUrl || this.bpmApiUrl === "") {
    console.warn("bpmApiUrl prop not Passed");
  }
  if (!this.token || this.token === "") {
    console.warn("token prop not Passed");
  }   
}

timedifference(date: Date) {
  return moment(date).fromNow();											
}													   

getProcessDataFromList(processList: any[], processId: string, dataKey: string) {
  const process = processList.find((process) => process.id === processId);
  return process && process[dataKey];
}

setselectedTask(taskId: string) {
  this.$root.$emit('call-fetchData', {selectedTaskId: taskId})
}
getExactDate(date: Date) {
  return getFormattedDateAndTime(date);
}
toggle(index: number) {
  this.activeIndex = index;						  
}

updateTasklistResult(queryList: object) {
  console.log(queryList);
  const requiredParams = {...{sorting:this.payload["sorting"]},...queryList}
  console.log(this.payload);
  if(!isEqual(this.payload, requiredParams)){
    console.log("changed")
    this.$root.$emit('call-fetchTaskList', 
      {filterId: this.selectedfilterId, requestData: requiredParams}
    );
    this.$root.$emit('call-fetchPaginatedTaskList', 
      {filterId: this.selectedfilterId,
        requestData: requiredParams,
        firstResult: 0,
        maxResults: this.perPage
      })
  }
}

mounted() {
  this.sId = this.selectedTaskId;
  this.checkPropsIsPassedAndSetValue();
  this.$root.$emit('call-fetchData', {selectedTaskId: this.sId})

  CamundaRest.getProcessDefinitions(this.token, this.bpmApiUrl).then(
    (response) => {
      this.getProcessDefinitions = response.data;
    }
  );
}

}
</script>
