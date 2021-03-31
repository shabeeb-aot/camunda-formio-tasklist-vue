<template>
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CamundaRest from '../services/camunda-rest';

@Component
export default class TaskListGroup extends Vue {
  private groupList = [];
  private groupListNames: Array<string> | null = null;
  private groupListItems: string[] = [];
  private setGroup = null;

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

}
</script>