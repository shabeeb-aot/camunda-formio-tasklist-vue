<template>
  <div class="cft-input-search-filter">
    <b-col
      class="cft-filter-container"
      xl="12"
      lg="12"
      md="12"
      sm="12"
    >
      <TaskListSearchType :selectedSearchQueries="selectedSearchQueries"/>

      <div v-if="selectedSearchQueries && selectedSearchQueries.length">
        <div
          class="cftf-search-item-box mr-2"
          v-for="(query, index) in selectedSearchQueries"
          :key="query.label + index"
        >
          <span @click="deleteSearchQueryElement(query,index)">
            <i class="fa fa-times cftf-x"></i>
          </span>
          <span class="cftf-search-title" title="type">
            <!-- <v-select :options="searchLabels" v-model="query.label"/> -->
            <span @click="showUpdateSearchQueryList(index)">
              {{query.label}}
            </span>
            <span v-if="query.type === 'variables'"> 
              <span>: </span>     
              <span
                v-if="showVariableValue[index] === 'a'"
                @click="updatevariableinput(index)"
              > ??
              </span>
              <span v-if="showVariableValue[index]==='i'">
                <span class="cft-variable-box">
                <span
                  @click="showVariableValueItem(index)"
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box" @click="showVariableValueItem(index)"></i
                ></span>
                <b-row align-h="end">
                  <b-col cols="8" class="cft-search-variable-input">
                <b-form-input
                  v-model="searchVariableValue[index]"
                  v-on:keyup.enter="showVariableValueItem(index)"
                />
                  </b-col>
                </b-row>
              </span>
              </span>
              <span
                class="cft-search-cursor"
                v-if="showVariableValue[index] === 's'&&query.type === 'variables'"
                @click="updatevariableinput(index)"
              >
                {{ searchVariableValue[index] }}
              </span>
            </span>
          <div v-if="showUpdatesearch[index]" class="cftf-sort-items">
            <div
              v-for="updateSearch in searchListElements"
              :key="updateSearch.key"
              @click="updateSearchQueryElement(updateSearch, index)"
              class="mb-2 cft-sort-element"
            >
              {{ updateSearch.label }}
            </div>
          </div>
          <div>
            <p
              class="cft-search-operator"
              title="operator"
              @click="toggleSearchQueryOperatorList(index)"
            >
              {{ operator[index] }}
            </p>
            <div class="cft-operator-dropdown" v-if="showSearchQueryOperators[index]">
              <div v-for="x in query.compares" :key="x">
                <span @click="updateSearchQueryOperators(x, index)">{{ x }}</span>
              </div>
            </div>
            <div class="cft-rhs-container">
              <span
                v-if="showSearchs[index] === 'a'"
                @click="updatesearchinput(index)"
                class="cft-search-cursor"
              >
                ??</span
              >
              <span v-if="showSearchs[index] === 'i' &&query.type==='date'">
                <b-form-datepicker
                size="sm"
                v-model="setDate[index]"
                @input="
                  setSearchQueryValue(setDate[index], query, operator[index], index); 
                  showsearchValueItem(index); 
                "
                >
                </b-form-datepicker>
              </span>
              <span v-if="showSearchs[index] === 's'&& query.type ==='date'" @click="updatesearchinput(index)">
                {{formatDate(setDate[index])}}
              </span>
              <span v-if="showSearchs[index] === 'i' && query.type !=='date'">
              <span class="cft-icon-actions">
                <span @click="
                    setSearchQueryValue(searchValueItem[index], query, operator[index], index);
                    showsearchValueItem(index);
                  "
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box" @click="showsearchValueItem(index)"></i
              ></span>
              <b-form-input
                v-model="searchValueItem[index]"
                v-on:keyup.enter="
                  setSearchQueryValue(searchValueItem[index], query, operator[index], index);
                  showsearchValueItem(index);
                "
              />
              </span>
              <span
                v-if="showSearchs[index] === 's'"
                @click="updatesearchinput(index)"
              >
                {{ searchValueItem[index] }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <b-row>
        <b-col cols="10">
          <b-nav-item-dropdown text="Filter Tasks" class="cft-search-item-nav">
            <b-dropdown-item-button v-for="(s, idx) in searchListElements"
              size="sm"
              split
              :key="s.label" 
              @click="
                addToSelectedSearchQuery(s);
                setActiveSearchItem(idx);"
              :class="{ 'cft-search-item-selected': idx == activeSearchItem }"
            > {{s.label}}
            </b-dropdown-item-button>
          </b-nav-item-dropdown>
        </b-col>
        <b-col cols="2">
      {{ tasklength }}
        </b-col>
      </b-row>
      <span v-if="isVariableTypeInSelectedSearchQuery">
        <span>
      <b-form-checkbox-group
        id="checkbox-group-2"
        v-model="variablesEndType"
        name="flavour-2"
      >
        <span class="cft-name-value-container">For Variables, ignore case of
        <b-form-checkbox value="variableNamesIgnoreCase" @change="callTaskVariablesEndApi">name</b-form-checkbox>
        <b-form-checkbox value="variableValuesIgnoreCase" @change="callTaskVariablesEndApi">value.</b-form-checkbox>
        </span>
      </b-form-checkbox-group>
        </span>
      </span>
    </b-col>
  </div>
</template>

<script lang="ts">
import '../../styles/camundaFormIOTasklistSearch.scss'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { 
  FilterSearchTypes,
  getDeletedVariableIndex,
  getVariableOperator,
  searchValueObject,
  taskSearchFilters,
} from "../../services/search-constants";
import {getFormattedDateAndTime, getISODateTime} from '../../services/format-time';
import TaskListSearchType from './TaskListSearchType.vue';
import vSelect from 'vue-select'

@Component({
  components: {
    TaskListSearchType,
    vSelect
  }
})
export default class TaskListSearch extends Vue {
  @Prop({}) private tasklength!: number;

  private activeSearchItem = 0;
  private searchListElements: any = taskSearchFilters;
  private searchLabels: any = (Object.values(taskSearchFilters).map((values: any) => values.label));
  private queryType = "ALL";
  private showSearchList = false;
  private selectedSearchQueries: any = [];
  private showUpdatesearch: Array<boolean> = [];
  private setUpdatesearchindex = 0;
  private showSearchQueryOperators: any = [];
  private searchValueItem: any = [];
  private searchVariableValue: any = [];
  private operator: Array<string> = [];
  private showSearchs: Array<string> = [];
  private showVariableValue: Array<string> = [];
  private searchDate: any = [];
  private setupdateSortListDropdownindex = 0;
  private variablesEndType = [];
  private queryList: any = {
    "taskVariables": [],
    "processVariables": []
  };
  private isVariableTypeInSelectedSearchQuery = false;
  private setDate: Array<string> = [];

  setActiveSearchItem(index: number) {
    this.activeSearchItem = index;
  }

  cftshowSearchList() {
    this.showSearchList = !this.showSearchList;
  }

  toggleSearchQueryOperatorList(index: number) {
    Vue.set(this.showSearchQueryOperators, index, !this.showSearchQueryOperators[index]);
  }

  updateSearchQueryOperators(operator: any, index: number) {
    delete this.queryList[
      searchValueObject(this.selectedSearchQueries[index].key, this.operator[index])
    ];
    this.operator[index] = operator;
    Vue.set(this.showSearchQueryOperators, index, false);
    this.setSearchQueryValue(this.searchValueItem[index], this.selectedSearchQueries[index], this.operator[index], index);
  }

  updatesearchinput(index: number) {
    this.searchValueItem[index] = '';
    Vue.set(this.showSearchs, index, "i");
  }

  showsearchValueItem(index: number) {
    Vue.set(this.showSearchs, index, "s");
  }

  makeInputNull(index: number) {
    Vue.set(this.showSearchs, index, "a");
  }

  updatevariableinput(index: number) {
    this.searchVariableValue[index] = '';
    Vue.set(this.showVariableValue, index, "i");
  }

  showVariableValueItem(index: number) {
    Vue.set(this.showVariableValue, index, "s")
  }

  formatDate(date: Date) {
    return getFormattedDateAndTime(date);
  }

  callTaskVariablesEndApi() {
    this.queryList['variableNamesIgnoreCase'] = false;
    this.queryList['variableValuesIgnoreCase'] = false;
    for(const variablevalue in this.variablesEndType) {
      this.queryList[this.variablesEndType[variablevalue]] = true;
      this.updateTasklistResult()
    }
    this.updateTasklistResult();
  }

  addToSelectedSearchQuery(item: any) {
    this.selectedSearchQueries.push(item);
    if (this.selectedSearchQueries === []) {
      this.operator[0] = item["compares"][0];
      this.showSearchs[0] = "a";
      this.showUpdatesearch[0] = false;
      this.showSearchQueryOperators[0] = false;
      this.showVariableValue[0] = "a";
      if(item.type==="variables"){
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    } 
    else {
      this.operator[this.selectedSearchQueries.length - 1] = item["compares"][0];
      this.showSearchs[this.selectedSearchQueries.length - 1] = "a";
      this.showUpdatesearch[this.selectedSearchQueries.length - 1] = false;
      this.showSearchQueryOperators[this.selectedSearchQueries.length - 1] = false;
      this.showVariableValue[this.selectedSearchQueries.length - 1] = "a";
      if(item.type==="variables"){
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
    this.showSearchList = false;
  }

  deleteSearchQueryElement(query: any, index: number) {
    if(query.type==='variables'){
      this.queryList = getDeletedVariableIndex(query, this.selectedSearchQueries, this.selectedSearchQueries[index]["key"], this.queryList);
    }
    else {
      delete this.queryList[
        searchValueObject(this.selectedSearchQueries[index].key, this.operator[index])
      ];
    }
    this.selectedSearchQueries.splice(index, 1);
    this.operator.splice(index, 1);

    this.isVariableTypeInSelectedSearchQuery = false;
    for (const idx in this.selectedSearchQueries) {
      if(this.selectedSearchQueries[idx]["type"]=== "variables") {
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
    this.updateTasklistResult()
  }

  showUpdateSearchQueryList(index: number) {
    for (let i = 0; i < 12; i++) {
      this.showUpdatesearch[i] = false;
    }
    Vue.set(this.showUpdatesearch, index, !this.showUpdatesearch[index]);
  }

  updateSearchQueryElement(searchitem: any, index: number) {
    delete this.queryList[
      searchValueObject(this.selectedSearchQueries[index].key, this.operator[index])
    ];
    Vue.set(this.selectedSearchQueries, index, searchitem);
    this.operator[index] = this.selectedSearchQueries[index].compares[0];
    this.showUpdatesearch[index] = false;
    this.setSearchQueryValue(this.searchValueItem[index], this.selectedSearchQueries[index], this.operator[index], index);
    this.searchListElements = taskSearchFilters;
  }

  setSearchQueryValue(item: any, query: any, operator: string, idx: number) {
    const Vindex = searchValueObject(this.selectedSearchQueries[idx].key, this.operator[idx])
    switch(query.type) {
    case FilterSearchTypes.VARIABLES: {
      this.selectedSearchQueries[idx]["variable"] = this.searchVariableValue[idx];
      this.selectedSearchQueries[idx]["name"] = this.searchValueItem[idx];
      if(this.searchValueItem[idx] && this.searchVariableValue[idx]){
        this.queryList[query.key].push({
          "name": this.searchValueItem[idx],
          "operator": getVariableOperator(operator),
          "value": this.searchVariableValue[idx]
        })
        this.updateTasklistResult();
      }
      break;
    }
    case FilterSearchTypes.DATE: {
      this.queryList[Vindex] = getISODateTime(item);
      this.updateTasklistResult();
      break;
    }
    case FilterSearchTypes.STRING:
    case FilterSearchTypes.NORMAL:{
      if (this.operator[idx] === "like") {
        this.queryList[Vindex] = "%" + item + "%";
      } else {
        this.queryList[Vindex] = item;
      }
      this.updateTasklistResult();
      break;
    }
    default:
    }
  }

  @Emit('update-task-list')
  updateTasklistResult(){
    if(this.queryType === "ALL") {
      return this.queryList
    }
    else {
      return {orQueries: [this.queryList]}
    }
  }

  mounted() {
    this.updateTasklistResult();
    this.$root.$on('call-updateTaskList', (para: any) => {
      this.queryType = para.queryType;
      this.updateTasklistResult();
    })
  }
}
</script>
