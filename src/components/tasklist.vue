<template>

  <b-container>
    <b-row class="text-left" align-v="start">
      <b-col cols="4">
          <b-list-group  v-if="tasks && tasks.length" class="service-task-list">   
          <div class="filter-container">
                <input type="text" class="filter" placeholder="Filter Tasks"/>
                {{tasks.length}}
          </div>
            <b-list-group-item button v-for="(task, idx) in tasks" v-bind:key="task" 
                v-on:click="toggle(idx)"
                :class="{'selected': idx == activeIndex}">
              <b-link v-bind:to="`/tasklist/${task.id}`">
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
                      Created on: {{ timeDifference(task.created) }}
                    </b-col>
                    <b-col lg=4 xs=4 sm=4 class="pr-0 text-right" title="priority">
                      {{ task.priority }}
                    </b-col>
                  </b-row>
                </b-link>
            </b-list-group-item>
        </b-list-group>

      </b-col>

      <b-col cols="8" v-if="this.$route.params.taskId">
        <b-row class="ml-0 task-header"> {{task.name}}</b-row>
        <b-row class="ml-0 task-name">{{taskProcess}}</b-row>
        <b-row class="ml-0 task-name">PID #{{task.processInstanceId}}</b-row>
        
        <div>
        <b-row class="actionable">
            <div class="col-md-auto">
              <b-icon :icon="'calendar3'"></b-icon>
              <DatePicker 
              type="datetime"
              placeholder="Set Follow-up date"
              v-model="setFollowup"
              >
              </DatePicker>
              </div>
              <div class="col-md-auto">
                <b-icon :icon="'bell'"></b-icon>
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
                    <b-icon class="info-circle"></b-icon>
                    You can add a group by typing a group ID into the input field and afterwards clicking the button with the plus sign.
                    <b-row class="mt-3 mb-3">
                        <b-col>
                            <label class="add">Add a group</label>
                        </b-col>
                        <b-col>
                        <input type="text" placeholder="Group ID" v-model="test">
                        </b-col>
                    </b-row>
                </div>
            </b-modal>
            </div>
            <div class="col-md">
            <!-- <button type="button" class="btn btn-primary"><b-icon :icon="'person-fill'"></b-icon> Claim </button> -->
            <b-col>
              {{task.assignee}}
                 <b-button variant="outline-primary" v-if="task.assignee" @click="onUnClaim">
                   <!-- <b-spinner label="Loading..."></b-spinner> -->
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
            <b-tabs content-class="mt-3" id="service-task-details">
              <b-tab title="Form" active>
                <formio :src=formioUrl
                :submission=submissionId
                :form=formId>
                </formio>
              </b-tab>
              <b-tab title="History"></b-tab>
              <b-tab title="Diagram"></b-tab>
              <b-tab title="Description"></b-tab>
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
import CamundaRest from '../services/camunda-rest';
import { Form } from 'vue-formio';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import 'vue-loading-overlay/dist/vue-loading.css';
import DatePicker from 'vue2-datepicker'

@Component({
  components: {
    formio: Form,
    DatePicker
  }
})
export default class Tasklist extends Vue {
@Prop() private CamundaUrl !: string|any;
@Prop() private BearerToken !: string|any;
@Prop({default: ''}) private username = '';
@Prop({default: ''}) private email = '';
@Prop() private UserRoles !: Array<String>

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

  timeDifference(givendate: Date) {      
    const diff: number = Math.abs(new Date().valueOf() - new Date(givendate).valueOf());
    const msec = diff;
    const days = Math.floor(msec / 1000 / 60 / (60 * 24))
    const dateDiff = new Date(msec);

    const hours = dateDiff.getHours();
    const minutes = dateDiff.getMinutes();
    const seconds = dateDiff.getSeconds();

    if(days === 0 && hours === 0 && minutes === 0) {
      return seconds+ " seconds ago"
    }
    else if (days === 0 && hours === 0) {
      return minutes+ " minutes ago"
    }
    else if(days === 0) {
      return hours+ " hours ago"
    }
    else {
      return days+ " days ago"
    }
  }

  getProcessDataFromList(processList: any[],processId: any,dataKey: string|number) {
    const process = processList.find(process => process.id === processId);
    return process && process[dataKey];
  }

  getTaskFromList(tasks: any[], taskId: string){
      const task = tasks.find(task=>task.id==taskId);
      return task;
    }

  toggle(index: number) {
      this.activeIndex = index
    }

  getBPMTaskDetail(taskId: string) {
        CamundaRest.getTaskById(this.BearerToken, this.CamundaUrl, taskId).then((result) => {
          this.task = result.data;
        })
    }

  onClaim() {
    CamundaRest.claim(this.BearerToken,this.CamundaUrl ,this.task.id, {userId: this.username}).then()
    .catch((error) => {
        console.log("Error", error);
    })
    this.getBPMTaskDetail(this.task.id)
  }

  onUnClaim(){ 
    CamundaRest.unclaim(this.BearerToken, this.CamundaUrl ,this.task.id).then()
    .catch((error) =>{
      console.log("Error", error)
      this.getBPMTaskDetail(this.task.id)
    })
  }


  @Watch('$route')
  fetchData() {
      if (this.$route.params.taskId) {       
        this.task = this.getTaskFromList(this.tasks, this.$route.params.taskId);
        CamundaRest.getTaskById(this.BearerToken, this.CamundaUrl, this.$route.params.taskId).then((result) => {
          CamundaRest.getProcessDefinitionById(this.BearerToken, this.CamundaUrl, result.data.processDefinitionId).then((res) => {
          this.taskProcess = res.data.name;
        });
        })

        CamundaRest.getVariablesByTaskId(this.BearerToken, this.CamundaUrl, this.$route.params.taskId)
        .then((result)=> {
            this.formioUrl = result.data["formUrl"].value;
            const formArr = this.formioUrl.split("/");
            this.formId = formArr[4];
            this.submissionId = formArr[6];
        });
      }
    }

  mounted() {
    CamundaRest.getTasks(this.BearerToken, this.CamundaUrl).then((result) => {
      this.tasks = result.data;      
    }); 

    this.fetchData();
    
    CamundaRest.getProcessDefinitions(this.BearerToken, this.CamundaUrl).then((response) => {
        this.getProcessDefinitions = response.data;
    }); 
  }

}

</script>

<style>
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
</style>