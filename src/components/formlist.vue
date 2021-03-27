<template>
  <div class="cftf-form-conatiner">
   <button type="button" class="btn btn-light cft-form-title" v-b-modal.modal-multi-1>
        <h4 ref="btn-show"> <i class="fa fa-wpforms"></i> Forms</h4>
   </button>
        <b-modal
          ref="modal-1"
          id="modal-multi-1"
          hide-header
          no-close-on-backdrop
          no-close-on-esc
          ok-only
          ok-title="Cancel"
          ok-variant="danger"
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
                class="cft-form-list-paginate"
              />
          </div>
        </b-modal>
        <b-modal
          ref="modal-2"
          id="modal-multi-2"
          size="lg"
          title="SUBMIT FORM"
          no-close-on-backdrop
          no-close-on-esc
          ok-only
          ok-title="Cancel"
          ok-variant="danger"
        >
          <i class="bi bi-arrow-left" @click="backClick"></i>
          <h4>{{formTitle}}</h4>
          <Form 
            :src="formValueId"
            form=""
            submission=""
            options=""
            v-on:submit="onSubmit"
          >
          </Form>
        </b-modal>
    </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
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
  private formId =  ''
  private formTitle = ''
  private showForms = true

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
        ((this.formcurrentPage - 1) * this.formperPage),
        (this.formcurrentPage * this.formperPage)
      );
    });
  }

  storeFormValue(val: string, name: string){
    this.$bvModal.hide('modal-multi-1')
    const forms = localStorage.getItem('formioApiUrl') + '/form/';
    this.formId = val;
    this.formValueId = forms.concat(val);
    this.formTitle = name;
  }

  backClick() {
    this.$bvModal.show('modal-multi-1')
    this.$bvModal.hide('modal-multi-2')
  }

  onSubmit(submission: any) {
    // this.$router.push({name: 'routename'})
    this.$router.push({path: `/form/${submission.form}/submission/${submission._id}`
    })
  }

  mounted() {
    CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
    {
      this.formList = response.data;
    });
  }
}
</script>