<template>
    <div>
        <b-list-group  v-if="filters && filters.length" class="service-task-list">
            <b-list-group-item button v-for="(filter, filteridx) in filters" :key="filter.id"
            v-on:click="togglefilter(filteridx)"
            :class="{'selected': filteridx == activefilter}">
              <b-row>
                <div class="col-12">
                  {{filter.name}} ({{filter.itemCount}})
                </div>   
              </b-row>
            </b-list-group-item>
          </b-list-group>
        <div class="mt-2 ml-3" v-else>
          <b-row class="not-selected mt-2 ml-1 row">
          <b-icon icon="exclamation-circle-fill" variant="secondary" scale="1"></b-icon>
          {{filters}}
           <p>No filters found</p>
          </b-row>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

export default class TaskFilter extends Vue {
    @Prop() private filters: any = '';
    private activefilter = 0

    fetchData() {
        console.log(this.filters)
    }
    togglefilter(index: number) {
        this.activefilter = index
    }


}
</script>