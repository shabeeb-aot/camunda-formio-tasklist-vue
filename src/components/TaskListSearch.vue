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
          :disabled="selectedSearchQueries.length < 2"
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
          v-for="(item, index) in selectedSearchQueries"
          :key="item.label + index"
        >
          <span @click="deleteSearchListElement(index)"
            ><i class="fa fa-times"></i
          ></span>
          <span class="cftf-search-title" title="type" @click="showUpdateSearchList(index)">{{
            item.label
          }}</span>
          <div v-if="showUpdatesearch[index]" class="cft-sort-items">
            <div
              v-for="s in searchListElements"
              :key="s.label"
              @click="updateSearchListElement(s, index)"
              class="mb-2 cft-sort-element"
            >
              {{ s.label }}
            </div>
          </div>
          <div>
            <p
              class="cft-search-operator"
              title="operator"
              @click="showSearchQueryOperatorList(index)"
            >
              {{ operator[index] }}
            </p>
            <div class="cft-operator-dropdown" v-if="showSearchQueryOperators[index]">
              <div v-for="x in item.compares" :key="x">
                <span @click="updateSearchQueryOperators(x, index)">{{ x }}</span>
              </div>
            </div>
            <!-- <div class="cft-rhs-container" v-if="item.type === 'date'">
              <span
                v-if="showSearchs[index] === 'a'"
                @click="updatesearchinput(index)"
              >
                ??</span
              >
              <DatePicker
                type="datetime"
                v-model="searchDate[index]"
                @change="
                  callSearchDateApi(searchDate[index], item, operator, index)
                "
              ></DatePicker>
            </div>
            <div class="cft-rhs-container" v-else-if="item.label === 'Task Variables'">
              <input
                v-if="showSearchs[index] === 'i'"
                v-model="searchItem[index]" 
              />
              <span
                v-if="showSearchs[index] === 's'"
                @click="updateresultOnclick(index)"
              >
                {{ searchItem[index] }}
              </span>
              <span
                v-if="showSearchs[index] === 'a'"
                @click="updatesearchinput(index)"
              >
                ??</span
              >
              <input
                v-model="variableValue[index]"
                v-on:keyup.enter="
                  callTaskVariablesApi(searchItem[index], operator[index], variableValue[index])
                "
              />
            </div>
            <div class="cft-rhs-container" v-else-if="item.label === 'Process Variables'">
              <input
                v-if="showSearchs[index] === 'i'"
                v-model="searchItem[index]" 
              />
              <span
                v-if="showSearchs[index] === 's'"
                @click="updateresultOnclick(index)"
              >
                {{ searchItem[index] }}
              </span>
              <span
                v-if="showSearchs[index] === 'a'"
                @click="updatesearchinput(index)"
              >
                ??</span
              >
              <input
                v-model="variableValue[index]"
                v-on:keyup.enter="
                  callProcessVariablesApi(searchItem[index], operator[index], variableValue[index])
                "
              />
            </div> -->
            <div class="cft-rhs-container">
              <span
                v-if="showSearchs[index] === 'a'"
                @click="updatesearchinput(index)"
              >
                ??</span
              >
              <span v-if="showSearchs[index] === 'i'">
              <span class="cft-icon-actions">
                <span
                  @click="
                    callSearchApi(searchItem[index], item, operator, index)
                  "
                >
                  <i class="bi bi-check cft-approve-box"></i>
                </span>
                <i class="bi bi-x cft-reject-box"></i
              ></span>
              <input
                v-model="searchItem[index]"
                v-on:keyup.enter="
                  callSearchApi(searchItem[index], item, operator, index)
                "
              />
              </span>
              <span
                v-if="showSearchs[index] === 's'"
                @click="updateresultOnclick(index)"
              >
                {{ searchItem[index] }}
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
    </b-col>
  </div>
</template>

<script lang="ts">
import '../styles/camundaFormIOTaslistSearch.scss'
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { getVariableOperator, searchQuery, taskSearchFilters } from "../services/search-constants";
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
  private searchItem = [];
  private variableValue = [];
  private operator: Array<string> = [];
  private showSearchs: Array<string> = [];
  private searchDate: any = [];
  private setupdateSortListDropdownindex = 0;

  setActiveSearchItem(index: number) {
    this.activeSearchItem = index;
  }

  cftshowSearchListElements() {
    this.showSearchList = !this.showSearchList;
  }
  changeQueryType() {
    this.queryType==="ALL"? (this.queryType= "ANY") : this.queryType = "ALL"
  }

  showSearchQueryOperatorList(index: number) {
    Vue.set(this.showSearchQueryOperators, index, !this.showUpdatesearch[index]);
  }

  updateSearchQueryOperators(operator: any, index: number) {
    this.operator[index] = operator;
    Vue.set(this.showSearchQueryOperators, index, false);
  }

  updatesearchinput(index: number) {
    Vue.set(this.showSearchs, index, "i");
  }

  updateresultOnclick(index: number) {
    Vue.set(this.showSearchs, index, "i");
  }

  makeInputNull(index: number) {
    Vue.set(this.showSearchs, index, "a");
  }

  addSearchElementItem(item: any) {
    this.selectedSearchQueries.push(item);
    if (this.selectedSearchQueries === []) {
      this.operator[0] = item["compares"][0];
      this.showSearchs[0] = "a";
      this.showUpdatesearch[0] = false;
      this.showSearchQueryOperators[0] = false;
    } else {
      this.operator[this.selectedSearchQueries.length - 1] = item["compares"][0];
      this.showSearchs[this.selectedSearchQueries.length - 1] = "a";
      this.showUpdatesearch[this.selectedSearchQueries.length - 1] = false;
      this.showSearchQueryOperators[this.selectedSearchQueries.length - 1] = false;
    }
    this.showSearchList = false;
  }

  deleteSearchListElement(index: number) {
    this.selectedSearchQueries.splice(index, 1);
    this.operator.splice(index, 1);
  }

  showUpdateSearchList(index: number) {
    for (let i = 0; i < this.searchListElements.length; i++) {
      this.showUpdatesearch[i] = false;
    }
    Vue.set(this.showUpdatesearch, index, !this.showUpdatesearch[index]);
  }

  updateSearchListElement(searchitem: any, index: number) {
    this.selectedSearchQueries[index].label = searchitem.label;
    this.selectedSearchQueries[index].compares = searchitem.compares;
    this.selectedSearchQueries[index].values = searchitem.values;
    this.operator[index] = searchitem.compares[0];
    this.showUpdatesearch[index] = false;

    this.searchListElements = taskSearchFilters;
  }

  @Emit()
  callSearchApi(item: any, searchItem: any, comparator: string, idx: number) {
    Vue.set(this.showSearchs, idx, "s");
    let index = 0;
    for (let i = 0; i < searchItem["compares"].length; i++) {
      if (searchItem["compares"][i] === comparator) {
        index = i;
        break;
      }
    }
    if (searchItem["compares"][index] === "like") {
      searchQuery[searchItem["values"][index]] = "%" + item + "%";
    } else {
      searchQuery[searchItem["values"][index]] = item;
    }

    return [searchQuery];
    //just return payload and after which call fetchApi
    // this.payload["orQueries"] = searchQuery;
    // this.fetchTaskList(this.selectedfilterId, this.payload);
  }

  // @Emit()
  // callSearchDateApi(
  //   item: any,
  //   searchItem: any,
  //   comparator: string,
  //   idx: number
  // ) {
  //   Vue.set(this.showSearchs, idx, "s");
  //   let index = 0;
  //   for (let i = 0; i < searchItem["compares"].length; i++) {
  //     if (searchItem["compares"][i] === comparator) {
  //       index = i;
  //       break;
  //     }
  //   }

  //   const timearr = moment(item)
  //     .format("yyyy-MM-DD[T]HH:mm:ss.SSSZ")
  //     .split("+");
  //   const replaceTimezone = timearr[1].replace(":", "");
  //   const titem = moment(item)
  //     .format("yyyy-MM-DD[T]HH:mm:ss.SSSZ")
  //     .replace(timearr[1], replaceTimezone);

  //   searchQuery[searchItem["values"][index]] = titem;
  //   return [searchQuery]
  //   // this.payload["orQueries"] = searchQuery;
  //   // this.fetchTaskList(this.selectedfilterId, this.payload);
  // }

  // @Emit()
  // callTaskVariablesApi(searchItem: string, operator: string, variableValue: string) {
  //   const item = {"name": searchItem, "operator": getVariableOperator(operator), "value": variableValue}
  //   return item;
  // }
  
  // @Emit()
  // callProcessVariablesApi(searchItem: string, operator: string, variableValue: string) {
  //   const item = {"name": searchItem, "operator": getVariableOperator(operator), "value": variableValue}
  //   return item;
  // }
}
</script>
