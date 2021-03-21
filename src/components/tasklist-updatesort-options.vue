<template>
    <b-list-group v-if="show" class="cft-sortlist-options-dropdown">
        {{show}}
        <b-list-group-item v-for="(s, idx) in sortOptions" :key="s.sortBy" @click="updateSort(s,idx)">
        <div class="col-12"> {{s.label}}</div>
        </b-list-group-item>
    </b-list-group>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TaskUpdateSortOptions extends Vue {
    @Prop() private sortOptions !: any;
    @Prop({default: 'true'}) private showSortListDropdown !: boolean;

    private show = this.showSortListDropdown;

    @Emit()
    updateSort(sort: any, index: number){
      return sort, index
    }

}
</script>