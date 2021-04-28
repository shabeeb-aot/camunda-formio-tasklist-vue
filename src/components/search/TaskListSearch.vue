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
      <div v-if="selectedSearchQueries.length">
        <div
          class="cftf-search-item-box mr-2"
          v-for="(query, index) in selectedSearchQueries"
          :key="query.label + index"
        >
        <b-row>
          <b-col cols="1">
          <span @click="deleteSearchQueryElement(query,index)">
            <i class="fa fa-times cftf-x" @click="deleteSearchQueryElement(query,index)"></i>
          </span>
          </b-col>
          <b-col cols="4">
            <b-nav-item-dropdown :text=query.label>
              <b-dropdown-item-button
                v-for="updateSearch in searchListElements"
                :key="updateSearch.label"
                @click="updateSearchQueryElement(updateSearch, index)"
              >
                {{updateSearch.label}}
              </b-dropdown-item-button>
            </b-nav-item-dropdown>
          </b-col>
            <!-- <b-form-select :value="query.label" :options="options"></b-form-select> -->
            <!-- <v-select :options="options" v-model="query.label"
            /> -->
            <b-col cols="*">
            <span v-if="query.type === 'variables'"> 
              <span>: </span>     
              <span
                v-if="showVariableValue[index] === 'a'"
                @click="updatevariableinput(index)"
                title="Property"
              > ??
              </span>
              <span v-if="showVariableValue[index]==='i'" title="Property">
                <span>
                <span
                  @click="showVariableValueItem(index)"
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box" @click="showVariableValueItem(index)"></i
                ></span>
                <b-form-input
                  v-model="searchVariableValue[index]"
                  v-on:keyup.enter="showVariableValueItem(index)"
                />
              </span>
              </span>
              <span
                class="cft-search-cursor"
                v-if="showVariableValue[index] === 's'&&query.type === 'variables'"
                @click="updatevariableinput(index)"
              >
                {{ searchVariableValue[index] }}
              </span>
            </b-col>
        </b-row>

        <b-row>
          <b-nav-item-dropdown :text=operator[index]>
            <b-dropdown-item-button
            v-for="x in query.compares"
            :key="x"
            @click="updateSearchQueryOperators(x, index)">
            {{x}}
            </b-dropdown-item-button>
          </b-nav-item-dropdown>
          <!-- <div>
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
            </div> -->
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
                {{formatDate(query.name)}}
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
                v-if="showSearchs[index] === 's' && query.type !=='date'"
                @click="updatesearchinput(index)"
              >
                {{ query.name }}
              </span>
            </div>
          <!-- </div> -->
        </b-row>
        </div>
      </div>
      <TaskListAddSearchIgnoreCase
        :queryList="queryList"
        :queryType="queryType"
        :tasklength="tasklength"
        :isVariableTypeInSelectedSearchQuery="isVariableTypeInSelectedSearchQuery"
        :searchListElements="searchListElements"
        @add-to-selected-search-query="addToSelectedSearchQuery"
      />
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
import TaskListAddSearchIgnoreCase from './TaskListAddSearchIgnoreCase.vue';
import TaskListSearchType from './TaskListSearchType.vue';
import vSelect from 'vue-select'

@Component({
  components: {
    TaskListAddSearchIgnoreCase,
    TaskListSearchType,
    vSelect
  }
})
export default class TaskListSearch extends Vue {
  @Prop({}) private tasklength!: number;

  private searchListElements: any = taskSearchFilters;
  // private searchLabels: any = (Object.values(taskSearchFilters).map((values: any) => values.label));
  private queryType = "ALL";
  private selectedSearchQueries: any = [];
  // private showUpdatesearch: Array<boolean> = [];
  private setUpdatesearchindex = 0;
  private showSearchQueryOperators: any = [];
  private searchValueItem: any = [];
  private searchVariableValue: any = [];
  private operator: Array<string> = [];
  private showSearchs: Array<string> = []; //3 states - a, i, s
  private showVariableValue: Array<string> = [];
  private queryList: any = {
    "taskVariables": [],
    "processVariables": []
  };
  private isVariableTypeInSelectedSearchQuery = false;
  private setDate: Array<string> = [];
  // private options = [
  //   {value: this.searchListElements[0], text: this.searchListElements[0]["label"]},
  //   {value: this.searchListElements[1], text: this.searchListElements[1]["label"]},
  //   {value: this.searchListElements[2], text: this.searchListElements[2]["label"]},
  //   {value: this.searchListElements[3], text: this.searchListElements[3]["label"]},
  //   {value: this.searchListElements[4], text: this.searchListElements[4]["label"]},
  //   {value: this.searchListElements[5], text: this.searchListElements[5]["label"]},
  //   {value: this.searchListElements[6], text: this.searchListElements[6]["label"]},
  //   {value: this.searchListElements[7], text: this.searchListElements[7]["label"]},
  //   {value: this.searchListElements[8], text: this.searchListElements[8]["label"]},
  //   {value: this.searchListElements[9], text: this.searchListElements[9]["label"]},
  //   {value: this.searchListElements[10], text: this.searchListElements[10]["label"]},
  //   {value: this.searchListElements[11], text: this.searchListElements[11]["label"]},
  // ]

  toggleSearchQueryOperatorList(index: number) {
    Vue.set(this.showSearchQueryOperators, index, !this.showSearchQueryOperators[index]);
  }

  updateSearchQueryOperators(operator: any, index: number) {
    console.log("operator->", operator)
    delete this.queryList[
      searchValueObject(this.selectedSearchQueries[index].key, this.operator[index])
    ];
    console.log("query passed", this.queryList);
    console.log("selected search variable", this.selectedSearchQueries[index])
    this.operator[index] = operator;
    Vue.set(this.showSearchQueryOperators, index, false);
    this.setSearchQueryValue(this.selectedSearchQueries[index], this.selectedSearchQueries[index], this.operator[index], index);
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

  addToSelectedSearchQuery(item: any) {
    this.selectedSearchQueries.push(item);
    if (this.selectedSearchQueries === []) {
      this.operator[0] = item["compares"][0];
      this.showSearchs[0] = "a";
      // this.showUpdatesearch[0] = false;
      this.showSearchQueryOperators[0] = false;
      this.showVariableValue[0] = "a";
      if(item.type==="variables"){
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    } 
    else {
      this.operator[this.selectedSearchQueries.length - 1] = item["compares"][0];
      this.showSearchs[this.selectedSearchQueries.length - 1] = "a";
      // this.showUpdatesearch[this.selectedSearchQueries.length - 1] = false;
      this.showSearchQueryOperators[this.selectedSearchQueries.length - 1] = false;
      this.showVariableValue[this.selectedSearchQueries.length - 1] = "a";
      if(item.type==="variables"){
        this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
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

  // showUpdateSearchQueryList(index: number) {
  //   for (let i = 0; i < 12; i++) {
  //     this.showUpdatesearch[i] = false;
  //   }
  //   Vue.set(this.showUpdatesearch, index, !this.showUpdatesearch[index]);
  // }

  updateSearchQueryElement(searchitem: any, index: number) {
    if(this.selectedSearchQueries[index].type==='variables'){
      this.queryList = getDeletedVariableIndex(this.selectedSearchQueries[index] , this.selectedSearchQueries, this.selectedSearchQueries[index]["key"], this.queryList);
    }
    else {
      delete this.queryList[
        searchValueObject(this.selectedSearchQueries[index].key, this.operator[index])
      ];
    }
    Vue.set(this.selectedSearchQueries, index, searchitem);
    this.operator[index] = this.selectedSearchQueries[index].compares[0];
    // this.showUpdatesearch[index] = false;
    this.setSearchQueryValue(this.searchValueItem[index], this.selectedSearchQueries[index], this.operator[index], index);
  }

  setSearchQueryValue(item: any, query: any, operator: string, idx: number) {
    const Vindex = searchValueObject(this.selectedSearchQueries[idx].key, this.operator[idx]);
    this.selectedSearchQueries[idx]["name"] = item;
    switch(query.type) {
    case FilterSearchTypes.VARIABLES: {
      this.selectedSearchQueries[idx]["name"] = this.searchVariableValue[idx];
      this.selectedSearchQueries[idx]["variable"] = this.searchValueItem[idx];
      if(this.searchValueItem[idx] && this.searchVariableValue[idx]){
        this.queryList[query.key].push({
          "name": this.searchVariableValue[idx],
          "operator": getVariableOperator(operator),
          "value": this.searchValueItem[idx]
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
      this.queryList = para.queryList;
      this.updateTasklistResult();
    })
  }

  beforeDestroy() {
    this.$root.$off('call-updateTaskList');
  }
}
</script>
