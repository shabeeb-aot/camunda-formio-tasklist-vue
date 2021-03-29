<template>
<b-container fluid class="task-outer-container">
    <div class="overflow-auto">
            <b-table-simple
              hover
              small
              caption-top
              responsive
              :bordered=true
              :outlined=true
              :per-page="formperPage"
            >
              <b-thead>
                <b-tr>
                  <b-th>Form Name</b-th>
                  <b-th>Operations</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="form in formList" :key="form.formId">
                  <b-th> {{form.formName}}</b-th>
                  <b-th>
                    <b-button
                      variant="primary"
                      v-b-modal.modal-multi-2
                      @click="storeFormValue(form.formId, form.formName)"
                    >Submit New
                    </b-button>
                  </b-th>
                </b-tr>
              </b-tbody>
            </b-table-simple>

                <b-pagination-nav
                :link-gen="linkFormGen"
                :number-of-pages="formNumPages"
                v-model="formcurrentPage"
                class="cft-form-list-paginate"
              />
        </div>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop,  Vue } from 'vue-property-decorator';
import CamundaRest from '../services/camunda-rest';

@Component
export default class FormList extends Vue{

private formList: Array<object> = []
private formperPage=10
private formNumPages=5
private formcurrentPage=1

@Prop({}) private token !: string;
@Prop() private bpmApiUrl !: string;

linkFormGen() {
  this.formListItems();
}

formListItems() {
  CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
  {
    this.formNumPages = Math.ceil(response.data.length/this.formperPage);
    this.formList = response.data.splice(
      ((this.formcurrentPage - 1) * this.formperPage),
      (this.formcurrentPage * this.formperPage)
    );
  });
}

mounted() {
  CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
  {
    this.formList = response.data;
  });
}

}
</script>