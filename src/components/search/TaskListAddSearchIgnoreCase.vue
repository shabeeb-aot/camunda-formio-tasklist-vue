<template>
    <div>
      <b-row>
        <b-col cols="10">
          <b-nav-item-dropdown split text="Filter Tasks" class="cft-search-item-nav">
            <b-dropdown-item-button v-for="(s, idx) in searchList"
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
    </div>
</template>

<script lang="ts">
import '../../styles/camundaFormIOTasklistSearch.scss'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TaskListAddSearchIgnoreCase extends Vue {
    @Prop() private isVariableTypeInSelectedSearchQuery !: string;
    @Prop() private queryList !: any;
    @Prop() private queryType !: string;
    @Prop() private tasklength !: number;
    @Prop() private searchListElements !: any;

    private variablesEndType = [];
    private QList = this.queryList;
    private activeSearchItem = 0;
    private searchList = this.searchListElements;

    setActiveSearchItem(index: number) {
      this.activeSearchItem = index;
    }

    @Emit()
    addToSelectedSearchQuery(item: any) {
      return item
    }

    callTaskVariablesEndApi() {
      this.QList['variableNamesIgnoreCase'] = false;
      this.QList['variableValuesIgnoreCase'] = false;
      for(const variablevalue in this.variablesEndType) {
        this.QList[this.variablesEndType[variablevalue]] = true;
        this.$root.$emit('call-updateTaskList', {queryType: this.queryType, queryList: this.QList})
      }
      this.$root.$emit('call-updateTaskList', {queryType: this.queryType, queryList: this.QList});
    }

}
</script>
