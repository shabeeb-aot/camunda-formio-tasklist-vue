<template>
    <div class="cft-input-filter">
          <b-col class="cft-filter-container" cols="*" xl="12" lg="12" md="12" sm="12">
            <div class="cft-search-criteria" v-if="searchList.length">
              <b-button
                squared
                v-if="searchList.length>1"
                variant="outline-secondary"
                @click="searchAllCriteria"
              >
                {{ searchA }}
              </b-button>
              <span class="cft-search-item-criteria">
                of the criteria are met.</span
              >
            </div>
            <div v-if="searchList && searchList.length">
              <div
                class="cftf-search-item-box mr-2"
                v-for="(item, index) in searchList"
                :key="item.label+index"
              >
                <span @click="deleteSearchListElement(index)"
                  ><i class="bi bi-x"></i
                ></span>
                <span title="type" @click="showUpdateSearchList(index)">{{
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

                <br />
                <p title="operator" @click="showOperatorList">
                  {{ operator[index] }}
                </p>
                <div v-if="showOperators && item.compares.length > 1">
                  <div v-for="x in item.compares" :key="x">
                    <span @click="updateOperators(x, index)">{{ x }}</span>
                  </div>
                </div>
                <div v-if='item.type==="date"'>
                  <span v-if="showSearchs[index]==='a'" @click="updatesearchinput(index)">
                  ??</span>
                  <DatePicker
                  v-if="showSearchs[index]==='i'"
                  type="datetime"
                  v-model="searchDate[index]"
                  @change="callSearchDateApi(searchDate[index], item, operator, index)"
                ></DatePicker>
                </div>
                <div v-else-if='item.type==="variables"'>
                  Task variables
                  <span>{{item.label}}</span>
                  <input
                    v-model="searchItem[index]"
                    />
                  <span v-if="showSearchs[index]==='a'" @click="updatesearchinput(index)">
                  ??</span>
                <input
                  v-if="showSearchs[index]==='i'"
                  v-model="searchItem[index]"
                  v-on:keyup.enter="
                    callSearchApi(searchItem[index], item, operator, index)
                  "
                />
                <span v-if="showSearchs[index]==='s'" @click="updateresultOnclick(index)">
                  {{searchItem[index]}}
                </span>
                </div>
                <div v-else>
                <span v-if="showSearchs[index]==='a'" @click="updatesearchinput(index)">
                  ??</span>
                <input
                  v-if="showSearchs[index]==='i'"
                  v-model="searchItem[index]"
                  v-on:keyup.enter="
                    callSearchApi(searchItem[index], item, operator, index)
                  "
                />
                <span v-if="showSearchs[index]==='s'" @click="updateresultOnclick(index)">
                  {{searchItem[index]}}
                </span>
                <span @click="callSearchApi(searchItem[index], item, operator, index)">
                  <i class="bi bi-check"></i>
                </span>
                <i class="bi bi-x"></i>
                </div>
              </div>
            </div>
          <input type="text" class="cft-filter" placeholder="Filter Tasks"
          @click="cftshowSearchListElements"/>
            {{tasklength}}
          <b-list-group
            v-if="showSearchList"
            class="cft-search-items"
          >
            <b-list-group-item button
              v-for="(s, idx) in searchListElements"
              :key="s.label"
              @click="addSearchElementItem(s, index);setActiveSearchItem(idx)"
              :class="{'cft-search-item-selected':idx ==activeSearchItem }"
            >
            {{s.label}}
            </b-list-group-item>
          </b-list-group>
          </b-col>
        </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  searchData,
  searchQuery,
} from "../services/utils";
import moment from "moment";

@Component
export default class TaskListSearch extends Vue{

  @Prop({}) private tasklength !: number;

  private activeSearchItem = 0;
  private searchListElements: any = searchData;
  private searchA = "ALL";
  private showSearchList = false;
  private searchList: any = [];
  private showUpdatesearch: Array<boolean> = [];
  private setUpdatesearchindex = 0;
  private showOperators = false;
  private searchItem = [];
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
  searchAllCriteria() {
    if (this.searchA === "ALL") {
      this.searchA = "ANY";
    } else {
      this.searchA = "ALL";
    }
  }

  addSearchElementItem(item: any) {
    this.searchList.push(item);
    if (this.searchList === []) {
      this.operator[0] = item["compares"][0];
      this.showSearchs[0] = 'i';
      this.showUpdatesearch[0] = false;
    } else {
      this.operator[this.searchList.length - 1] = item["compares"][0];
      this.showSearchs[this.searchList.length - 1] = 'i';
      this.showUpdatesearch[this.searchList.length - 1] = false;
    }
    this.showSearchList = false;
  }

  deleteSearchListElement(index: number) {
    this.searchList.splice(index, 1);
    this.operator.splice(index, 1);
  }

  showUpdateSearchList(index: number) {
    for(let i=0; i<this.searchListElements.length; i++) {
      this.showUpdatesearch[i] = false;
    }
    Vue.set(this.showUpdatesearch, index, !this.showUpdatesearch[index])
  }

  updateSearchListElement(searchitem: any, index: number) {
    this.searchList[index].label = searchitem.label;
    this.searchList[index].compares = searchitem.compares;
    this.searchList[index].values = searchitem.values;
    this.operator[index] = searchitem.compares[0];

    this.showUpdatesearch[index] = false;
  }

  callSearchApi(item: any, searchItem: any, comparator: string, idx: number) {
    Vue.set(this.showSearchs, idx, 's');
    let index = 0;
    for (let i = 0; i < searchItem["compares"].length; i++) {
      if (searchItem["compares"][i] === comparator) {
        index = i;
        break;
      }
    }
    if (searchItem["compares"][index] === "like") {
      searchQuery[0][searchItem["values"][index]] = "%" + item + "%";
    } else {
      searchQuery[0][searchItem["values"][index]] = item;
    }

    // this.payload["orQueries"] = searchQuery;
    // this.fetchTaskList(this.selectedfilterId, this.payload);
  }

  callSearchDateApi(item: any, searchItem: any, comparator: string, idx: number) {
    Vue.set(this.showSearchs, idx, 's');
    let index = 0;
    for (let i = 0; i < searchItem["compares"].length; i++) {
      if (searchItem["compares"][i] === comparator) {
        index = i;
        break;
      }
    }

    const timearr = moment(item)
      .format("yyyy-MM-DD[T]HH:mm:ss.SSSZ")
      .split("+");
    const replaceTimezone = timearr[1].replace(":", "");
    const titem = moment(item).format("yyyy-MM-DD[T]HH:mm:ss.SSSZ")
      .replace(timearr[1], replaceTimezone);

    searchQuery[0][searchItem["values"][index]] = titem;
    // this.payload["orQueries"] = searchQuery;
    // this.fetchTaskList(this.selectedfilterId, this.payload);
  }


  showOperatorList() {
    this.showOperators = !this.showOperators;
  }

  updateOperators(operator: any, index: number) {
    this.operator[index] = operator;

    this.showOperators = false;
  }

  updatesearchinput(index: number) {
    Vue.set(this.showSearchs, index, 'i');
  }

  updateresultOnclick(index: number) {
    Vue.set(this.showSearchs, index, 'i');
  }
}
</script>
