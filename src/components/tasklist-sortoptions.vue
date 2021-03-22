<template>
    <div v-if="showSortListDropdown" class="cft-sort-items">
        <div
          v-for="s in sortOptions" :key="s.sortBy"
          @click="addSort(s)"
          class="mb-2 cft-sort-element"
        >
            {{s.label}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TaskSortOptions extends Vue {
    @Prop() private sortOptions !: any;
    @Prop({default: 'true'}) private showSortListDropdown !: boolean;

    @Emit()
    addSort(sort: any){
      return sort
    }

}
</script>