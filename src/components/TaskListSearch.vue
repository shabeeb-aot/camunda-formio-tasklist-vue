<template>
  <div class="cft-input-search-filter">
    <b-col
      class="cft-filter-container"
      xl="12"
      lg="12"
      md="12"
      sm="12"
    >
      <div class="cft-search-criteria" v-if="selectedSearchQueries.length">
        <b-button
          squared
          variant="outline-secondary"
          @click="changeQueryType"
        >
          {{ queryType }}
        </b-button>
        <span class="cft-search-item-criteria"> of the criteria are met.</span>
      </div>

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
            <span @click="showUpdateSearchList(index)">
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
                v-if="showVariableValue[index] === 's'"
                @click="updatevariableinput(index)"
              >
                {{ searchVariableValue[index] }}
              </span>
            </span>
          <div v-if="showUpdatesearch[index]" class="cft-sort-items">
            <div
              v-for="s in searchListElements"
              :key="s.label"
              @click="updateSearchQueryElement(s, index)"
              class="mb-2 cft-sort-element"
            >
              {{ s.label }}
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
              >
                ??</span
              >
              <span v-if="showSearchs[index] === 'i' &&query.type==='date'">
                <b-form-datepicker
                size="sm"
                v-model="setDate[index]"
                @input="setSearchQueryValue(setDate[index], query, operator[index], index)"
                value-as-date
                >
                </b-form-datepicker>
              </span>
              <span v-if="showSearchs[index] === 'i' && query.type !=='date'">
              <span class="cft-icon-actions">
                <span
                  @click="
                    setSearchQueryValue(searchValueItem[index], query, operator[index], index)
                  "
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box" @click="showsearchValueItem(index)"></i
              ></span>
              <b-form-input
                v-model="searchValueItem[index]"
                v-on:keyup.enter="
                  setSearchQueryValue(searchValueItem[index], query, operator[index], index)
                "
              >
              </b-form-input>
              </span>
              <span v-if="showSearchs[index] === 's'&& query.type ==='date'">
                {{setDate[index]}}
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
      <input
        type="text"
        class="cft-filter"
        placeholder="Filter Tasks"
        @click="cftshowSearchListElements"
      />
      {{ tasklength }}
      <b-list-group v-if="showSearchList" class="cft-search-items">
        <b-list-group-item
          button
          v-for="(s, idx) in searchListElements"
          :key="s.label"
          @click="
            addSearchElementItem(s);
            setActiveSearchItem(idx);
          "
          :class="{ 'cft-search-item-selected': idx == activeSearchItem }"
        >
          {{ s.label }}
        </b-list-group-item>
      </b-list-group>
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
import '../styles/camundaFormIOTaslistSearch.scss'
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { FilterSearchTypes, getVariableOperator, searchQuery, taskSearchFilters } from "../services/search-constants";
import DatePicker from "vue2-datepicker";
import moment from "moment";

@Component({
  components: {
    DatePicker,
  },
})
export default class TaskListSearch extends Vue {
  @Prop({}) private tasklength!: number;

  private activeSearchItem = 0;
  private searchListElements: any = taskSearchFilters;
  private queryType = "ALL";
  private showSearchList = false;
  private selectedSearchQueries: any = [];
  private showUpdatesearch: Array<boolean> = [];
  private setUpdatesearchindex = 0;
  private showSearchQueryOperators: any = [];
  private searchValueItem = [];
  private searchVariableValue = [];
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
  private value = '';
  private setDate: Array<string> = [];

  setActiveSearchItem(index: number) {
    this.activeSearchItem = index;
  }

  cftshowSearchListElements() {
    this.showSearchList = !this.showSearchList;
  }
  changeQueryType() {
    this.queryType==="ALL"? (this.queryType= "ANY") : this.queryType = "ALL"
    this.updateTasklistResult();
  }

  toggleSearchQueryOperatorList(index: number) {
    Vue.set(this.showSearchQueryOperators, index, !this.showSearchQueryOperators[index]);
  }

  updateSearchQueryOperators(operator: any, index: number) {
    this.operator[index] = operator;
    Vue.set(this.showSearchQueryOperators, index, false);
  }

  updatesearchinput(index: number) {
    Vue.set(this.showSearchs, index, "i");
  }

  showsearchValueItem(index: number) {
    Vue.set(this.showSearchs, index, "s");
  }

  makeInputNull(index: number) {
    Vue.set(this.showSearchs, index, "a");
  }

  updatevariableinput(index: number) {
    Vue.set(this.showVariableValue, index, "i");
  }

  showVariableValueItem(index: number) {
    Vue.set(this.showVariableValue, index, "s")
  }

  callTaskVariablesEndApi() {
    this.queryList['variableNamesIgnoreCase'] = false;
    this.queryList['variableValuesIgnoreCase'] = false;
    
    for(const variablevalue in this.variablesEndType) {
    this.queryList[this.variablesEndType[variablevalue]] = true;
    this.updateTasklistResult()
    }
  }

  addSearchElementItem(item: any) {
    this.selectedSearchQueries.push(item);
    if (this.selectedSearchQueries === []) {
      this.operator[0] = item["compares"][0];
      this.showSearchs[0] = "a";
      this.showUpdatesearch[0] = false;
      this.showSearchQueryOperators[0] = false;
      if(item.type==="variables"){
      this.showVariableValue[0] = "a";
      this.isVariableTypeInSelectedSearchQuery = true;
      }
    } else {
      this.operator[this.selectedSearchQueries.length - 1] = item["compares"][0];
      this.showSearchs[this.selectedSearchQueries.length - 1] = "a";
      this.showUpdatesearch[this.selectedSearchQueries.length - 1] = false;
      this.showSearchQueryOperators[this.selectedSearchQueries.length - 1] = false;
      if(item.type==="variables"){
      this.showVariableValue[this.selectedSearchQueries.length - 1] = 'a';
      this.isVariableTypeInSelectedSearchQuery = true;
      }
    }
    this.showSearchList = false;
  }

  deleteSearchQueryElement(query: any, index: number) {
    let id = 0;
    for(let i=0; i<this.selectedSearchQueries[index]["compares"].length; i++) {
      if(this.selectedSearchQueries[index]["compares"][i]===this.operator[index]) {
        id = i;
      }
    }
      delete this.queryList[query["values"][id]];
    this.selectedSearchQueries.splice(index, 1);
    this.operator.splice(index, 1);
    this.updateTasklistResult()
  }

  showUpdateSearchList(index: number) {
    for (let i = 0; i < 12; i++) {
      this.showUpdatesearch[i] = false;
    }
    Vue.set(this.showUpdatesearch, index, !this.showUpdatesearch[index]);
  }

  updateSearchQueryElement(searchitem: any, index: number) {
    this.selectedSearchQueries[index].label = searchitem.label;
    this.selectedSearchQueries[index].compares = searchitem.compares;
    this.selectedSearchQueries[index].values = searchitem.values;
    this.operator[index] = searchitem.compares[0];
    this.showUpdatesearch[index] = false;

    this.searchListElements = taskSearchFilters;
  }

  setSearchQueryValue(item: any, query: any, operator: string, idx: number) {
    Vue.set(this.showSearchs, idx, "s");
    let index = 0;
    for (let i = 0; i < query["compares"].length; i++) {
      if (query["compares"][i] === operator) {
        index = i;
        break;
      }
    }
    switch(query.type) {
    case FilterSearchTypes.VARIABLES: {
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
      console.log("Date", item);
      const timearr = moment(item).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ").split("+");
      console.log(timearr)
      const replaceTimezone = timearr[1].replace(":", "");
      const titem = moment(item).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ")
        .replace(timearr[1], replaceTimezone);

      this.queryList[query["values"][index]] = titem;
      this.updateTasklistResult();
      break;
    }
    case FilterSearchTypes.STRING:
    case FilterSearchTypes.NORMAL:{
      if (query["compares"][index] === "like") {
        this.queryList[query["values"][index]] = "%" + item + "%";
      } else {
        this.queryList[query["values"][index]] = item;
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
}

</script>
