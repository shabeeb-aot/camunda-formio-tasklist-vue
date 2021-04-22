<template> 
<b-navbar >
    <b-nav-form>
    <b-button @click="clickMaxi" variant="light" size="sm"> 
        <i v-if="maxi" class="bi bi-arrows-angle-expand"></i>
        <i v-else class="bi bi-arrows-angle-contract"></i>
    </b-button>
    </b-nav-form>
</b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ExpandContract  extends Vue {
  private maxi = true

    clickMaxi () {
        this.maxi = !this.maxi
        this.$root.$emit('call-managerScreen', {maxi: this.maxi});
    }
}
</script>
