<template>
  <div>
   <b-button class="cft-form-title" v-b-modal.modal-multi-1>
        <h4> <i class="fa fa-wpforms"></i> Forms</h4>
        </b-button>
        <b-modal
          id="modal-multi-1"
          title="Forms"
        >
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
              />
          </div>
        </b-modal>
        <b-modal
          id="modal-multi-2"
          size="lg"
          title="Create forms"
        >
          Enter and submit form
          <h4>{{formTitle}}</h4>
          <Form 
            :src="formValueId"
          >
          </Form>
        </b-modal>
    </div>
</template>

<script lang="ts">
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../camundaFormIOTasklist.scss'
import { Component, Prop, Vue } from 'vue-property-decorator'
import CamundaRest from '../services/camunda-rest'
import { Form } from 'vue-formio';

@Component({
  components: {
    Form
  }
})
export default class FormList extends Vue{
  private formList: Array<object> = []
  private formperPage=10
  private formNumPages=5
  private formcurrentPage=1
  private formValueId = ''
  private formTitle = ''

  @Prop({}) private token !: any;
  @Prop() private bpmApiUrl !: string;

  linkFormGen() {
    this.formListItems();
  }

  formListItems() {
    CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
    {
      this.formNumPages = Math.ceil(response.data.length/this.formperPage);
      this.formList = response.data.splice(
        (this.formcurrentPage - 1) * this.formperPage,
        this.formcurrentPage * this.formperPage
      );
      console.log("Current Page, num page", this.formcurrentPage, this.formperPage)
      console.log("end length", this.formcurrentPage*this.formperPage)
      console.log("length of response", this.formList.length);
    });
  }

  storeFormValue(val: string, name: string){
    const forms = localStorage.getItem('formioApiUrl') + '/form/';
    this.formValueId = forms.concat(val);
    this.formTitle = name;
  }

  mounted() {
    CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
    {
      this.formList = response.data;
    });
  }
}
</script>