<template> 
<b-container fluid class="task-outer-container">
  <div class="main-filters my-2 mb-1">
    <div 
      class="cft-filter-dropdown mx-2"
    >
        <b-nav-item-dropdown class="cft-nav-backgroup mr-0">
          <template slot="button-content">
             <i class="bi bi-filter-square"/>
        </template>
          <span v-if="filterList.length">
            <b-dropdown-item v-for="(filter, idx) in filterList" 
              :key="filter.id" 
              href="#"
              @click="togglefilter(filter, idx)"
              :class="{'cft-filter-selected': idx == activefilter}"
              >
              {{filter.name}}
            </b-dropdown-item>
          </span>
          <b-dropdown-item v-else >No Filters found</b-dropdown-item>
        </b-nav-item-dropdown>
      </div>
      <FormListModal :token="token" :bpmApiUrl="bpmApiUrl"/>
      <div class="cft-first">
        <!-- Sorting section -->
				<div id="cftf-dpdown-container" class="mx-2">
					<div class="cftf-dpdown-box mr-2" v-for="(sort, idx) in sortList" :key="sort.sortBy">
              <span v-if="sortList.length>1"
                class="cftf-exit-button"
                title="Remove Sorting" 
                @click="deleteSort(sort, index)"
              >
                  <i class="bi bi-x"></i>
              </span>
							<span
               class="cftf-span-element"
                @click="showUpdateSortOptions(idx)"
              >{{sortList[idx]["label"]}}</span>
              <div
                v-if="showSortListDropdown[idx]"
                class="cft-sort-items"
              >
                <div v-for="s in sortOptions" :key="s.sortBy"
                 @click="updateSort(s,idx)"
                 class="mb-2 cft-sort-element"
                >
                  {{s.label}}
                </div>
              </div>
                <a v-if="sort.sortOrder==='asc'" @click="toggleSort(idx)" href="#" title="Ascending">
                  <i class="bi bi-chevron-up cftf-arrow"></i>
                </a>
                <a v-else @click="toggleSort(idx)"  href="#" title="Descending">
                  <i class="bi bi-chevron-down cftf-arrow"></i>
                </a>
            </div>
          <i v-if="updateSortOptions.length===0"
           class="fa fa-plus fa-sm click-element cftf-add-sorting"
           @click="showaddSortListOptions"
           title="Add sorting"></i>
          <TaskSortOptions
           :sortOptions="sortOptions"
           :showSortListDropdown="showaddNewSortListDropdown"
           @add-sort="addSort"
          >
          </TaskSortOptions>
          </div>
		</div>					 
  </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import {
  TASK_FILTER_LIST_DEFAULT_PARAM,
  sortingList,
} from '../../services/utils';
import FormListModal from '../FormListModal.vue';
import {Payload} from '../../services/TasklistTypes';
import TaskSortOptions from '../TaskListSortoptions.vue';
import { namespace } from 'vuex-class';

const serviceFlowModule = namespace('serviceFlowModule')

@Component({
  components: {
    FormListModal,
    TaskSortOptions
  }
})
export default class Header extends Vue {
  @Prop() private bpmApiUrl!: string;
  @Prop() private token!: string;
  @Prop() private perPage !: number;
  @Prop() private filterList !: Array<string>;
  @Prop() private selectedfilterId !: string;
  @Prop() private payload !: Payload;

  
  @serviceFlowModule.Getter('getFormsFlowTaskCurrentPage') private getFormsFlowTaskCurrentPage: any;
  @serviceFlowModule.Mutation('setFormsFlowTaskCurrentPage') public setFormsFlowTaskCurrentPage: any;

  private showfilter=false;
  private activefilter = 0;
  private sortList = TASK_FILTER_LIST_DEFAULT_PARAM;
  private sortOptions: Array<object> = [];
  private userList: Array<object> = [];
  private updateSortOptions: Array<object> = [];
  private setupdateSortListDropdownindex = 0;
  private showSortListDropdown = [false, false, false, false, false, false];
  private showaddNewSortListDropdown = false;
  
@Watch('token')
  ontokenChange (newVal: string) {
  // updating token
    localStorage.setItem("authToken", newVal);
  }

toggleshowfilter() {
  this.showfilter = ! this.showfilter;
}

togglefilter(filter: any, index: number) {
  this.activefilter = index;
  this.$root.$emit('call-fetchTaskList', 
    {filterId: filter.id, requestData: this.payload}
  );
  this.setFormsFlowTaskCurrentPage(1);
  this.$root.$emit('update-pagination-currentpage', {page: this.getFormsFlowTaskCurrentPage});
  this.$root.$emit('call-fetchPaginatedTaskList', {
    filterId: filter.id,
    requestData: this.payload,
    firstResult: (this.getFormsFlowTaskCurrentPage-1)*this.perPage,
    maxResults: this.perPage
  })
  this.showfilter = false;
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
addSort(sort: any) {
  this.sortList.push(sort);
  if (this.sortList.length === sortingList.length) {
    this.updateSortOptions = this.sortOptions;
  } else {
    this.sortOptions = this.getOptions(this.sortList);
  }
  this.setFormsFlowTaskCurrentPage(1);
  this.$root.$emit('update-pagination-currentpage', {page: this.getFormsFlowTaskCurrentPage});
  this.$root.$emit('call-fetchPaginatedTaskList', {
    filterId: this.selectedfilterId,
    requestData: this.payload,
    firstResult: (this.getFormsFlowTaskCurrentPage-1)*this.perPage,
    maxResults: this.perPage
  })
  this.showaddNewSortListDropdown = false;									  
}

showaddSortListOptions() {
  this.showaddNewSortListDropdown = !this.showaddNewSortListDropdown;
  this.sortOptions = this.getOptions(this.sortList);
}

showUpdateSortOptions(index: number) {
  for(let i =0; i<6;i++){
    if(this.showSortListDropdown[i]===true){
      this.showSortListDropdown[i] = false;
    }
  }
  this.showSortListDropdown[index] = !this.showSortListDropdown[index];
  this.sortOptions = this.getOptions(this.sortList);
  this.setupdateSortListDropdownindex = index;
}

updateSort(sort: any, index: number) {
  this.sortList[index].label = sort.label;
  this.sortList[index].sortBy = sort.sortBy;

  this.sortOptions = this.getOptions(this.sortList);
  this.showSortListDropdown[index] = false;
  this.payload["sorting"] = this.sortList;
  this.setFormsFlowTaskCurrentPage(1);
  this.$root.$emit('update-pagination-currentpage', {page: this.getFormsFlowTaskCurrentPage});
  this.$root.$emit('call-fetchPaginatedTaskList', {
    filterId: this.selectedfilterId,
    requestData: this.payload,
    firstResult: (this.getFormsFlowTaskCurrentPage-1)*this.perPage,
    maxResults: this.perPage
  })
}

deleteSort(sort: any, index: number) {
  this.sortList.splice(index, 1);
  this.updateSortOptions = [];
  this.sortOptions = this.getOptions(this.sortList);
  this.payload["sorting"] = this.sortList;
  this.setFormsFlowTaskCurrentPage(1);
  this.$root.$emit('update-pagination-currentpage', {page: this.getFormsFlowTaskCurrentPage});
  this.$root.$emit('call-fetchPaginatedTaskList', {
    filterId: this.selectedfilterId,
    requestData: this.payload,
    firstResult: (this.getFormsFlowTaskCurrentPage-1)*this.perPage,
    maxResults: this.perPage
  })
}

toggleSort(index: number) {
  if (this.sortList[index].sortOrder === "asc")
    this.sortList[index].sortOrder = "desc";
  
  else {
    this.sortList[index].sortOrder = "asc";
  }
  this.payload["sorting"] = this.sortList;
  this.setFormsFlowTaskCurrentPage(1);
  this.$root.$emit('update-pagination-currentpage', {page: this.getFormsFlowTaskCurrentPage});
  this.$root.$emit('call-fetchPaginatedTaskList', {
    filterId: this.selectedfilterId,
    requestData: this.payload,
    firstResult: (this.getFormsFlowTaskCurrentPage-1)*this.perPage,
    maxResults: this.perPage
  })
}
}
</script>
