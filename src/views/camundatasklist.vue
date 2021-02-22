<template>
  <CamundaTasklist Url=""  KeycloakUrl=""  KeycloakRealm=""
 ReviewerRole="" ReviewerRoleId="" UserResourceId=""  />
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import CamundaTasklist from '@components/tasklist.vue'

@Component({
  components: {
    CamundaTasklist
  }
})
export default class TaskList extends Vue {
}
</script>