<template>
    <b-modal
        id="AddGroupModal"
        ref="modal"
        no-close-on-backdrop
        no-close-on-esc
        ok-title="Close"
        ok-only
    >
      <template #modal-header>
        <h4>Manage Groups</h4>
      </template>
        <div class="modal-text">
        <i class="bi bi-info-circle"></i>
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
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import CamundaRest from '../services/camunda-rest';

@Component
export default class TaskListGroup extends Vue {
    
  @Prop() private token !: string;
  @Prop() private task!: any;
  @Prop() private bpmApiUrl!: string;
  @Prop() private groupList!: Array<object>;
  private setGroup = null;

  @Emit()
  addGroup() {
    CamundaRest.createTaskGroupByID(
      this.token,
      this.task.id,
      this.bpmApiUrl,
      { userId: null, groupId: this.setGroup, type: "candidate" }
    ).then(() => {
      this.setGroup = null;
    });
  }

  @Emit()
  deleteGroup(groupid: string) {		 
    CamundaRest.deleteTaskGroupByID(this.token, this.task.id, this.bpmApiUrl, {
      groupId: groupid,
      type: "candidate",
    });
  }

}
</script>