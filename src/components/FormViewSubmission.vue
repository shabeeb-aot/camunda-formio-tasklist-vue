<template>
    <div>
        <h4>Form Submission View</h4>
        {{formioUrlLink}}
        <br>
        {{fId}}
        <br>
        {{sId}}
        <br>
        <formio 
        :src="formioUrlLink"
        :form="fId"
        :submission="sId"></formio>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import CamundaRest from '../services/camunda-rest'
import { Form } from 'vue-formio';
import { getFormDetails } from "../services/get-formio";

@Component({
  components: {
    formio: Form
  }
})
export default class FormViewSubmission extends Vue {

  private formUrl = ''
  private formioUrlLink = ''
  private readoption = { readOnly: true };
  private fId = ''
  private sId = ''
  private formioProjectUrl = "https://forms2.aot-technologies.com"
  private test="https://forms2.aot-technologies.com/form/604a542a3a94803fbcf8289b/submission/605c174913e06b30c50c0408"

  mounted() {
    this.formUrl = window.location.href;

    const { formioUrl, formId, submissionId } = getFormDetails(
      this.formUrl,
      localStorage.getItem('formioApiUrl') || this.formioProjectUrl
    );

    console.log(submissionId, formId)
    this.formioUrlLink = formioUrl.replace("http", "https");
    console.log(this.formioUrlLink)
    this.fId = formId;
    this.sId = submissionId;
    console.log(this.sId)
  }

}
</script>