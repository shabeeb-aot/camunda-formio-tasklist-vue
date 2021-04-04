<template>
        <div class="cftf-form-conatiner">
          <button type="button" class="btn btn-light cft-form-title" v-b-modal.modal-multi-1>
              <h4 ref="btn-show"> <i class="fa fa-wpforms"></i> Forms</h4>
          </button>
            <b-modal
              ref="modal-1"
              id="modal-multi-1"
              title="Forms"
              size="xl"
              no-close-on-backdrop
              no-close-on-esc
              ok-only
              ok-title="Cancel"
              ok-variant="danger"
            >
          <div
            v-if="formList.length"
            class="overflow-auto"
          >
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
          <div v-else>
            <b-list-group-item>
              <b-row class="cft-not-selected mt-2 ml-1 row">
                <i class="bi bi-exclamation-circle-fill" scale="1"></i>
                <p>No Form found in the list.</p>
              </b-row>
            </b-list-group-item>
          </div>
              </b-modal>
        <b-modal
          ref="modal-2"
          id="modal-multi-2"
          size="xl"
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
        <b-modal
          ref="modal-3"
          id="modal-multi-3"
          size="xl"
          title="View form"
          ok-only
        >
        <FormViewSubmission :formid="formId" :submissionid="submissionId">
        </FormViewSubmission>
        </b-modal>
          </div>
</template>

<script lang="ts">
import '../styles/camundaFormIOFormList.scss'
import { Component, Prop, Vue } from 'vue-property-decorator'
import CamundaRest from '../services/camunda-rest'
import { Form } from 'vue-formio';
import FormViewSubmission from '../components/FormViewSubmission.vue';

@Component({
  components: {
    Form,
    FormViewSubmission
  }
})
export default class FormListModal extends Vue{
  private formList: Array<object> = []
  private formperPage=10
  private formNumPages=1
  private formcurrentPage=1
  private formValueId = ''
  private formId =  ''
  private submissionId = ''
  private formTitle = ''
  private showForms = true

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

  storeFormValue(val: string, title: string){
    this.$bvModal.hide('modal-multi-1')
    const forms = localStorage.getItem('formIOApiUrl') + '/form/';
    this.formId = val;
    this.formValueId = forms.concat(val);
    this.formTitle = title;
  }

  backClick() {
    this.$bvModal.show('modal-multi-1')
    this.$bvModal.hide('modal-multi-2')
  }

  onSubmit(submission: any) {
    this.formId = submission.form;
    this.submissionId = submission._id;
    this.$bvModal.show('modal-multi-3');
    this.$bvModal.hide('modal-multi-2');
  }

  mounted() {
    CamundaRest.listForms(this.token, this.bpmApiUrl).then((response) =>
    {
      this.formList = response.data;
    });
  }
}
</script>
