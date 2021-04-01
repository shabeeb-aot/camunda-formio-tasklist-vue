<template>
    <b-container fluid class="cft-form-submission">
      <a :href="homeUrl"><i class="fa fa-chevron-left"></i></a>
        <div id='formio'></div>
    </b-container>
</template>

<script lang="ts">
import "font-awesome/scss/font-awesome.scss";
import 'semantic-ui-css/semantic.min.css';
import '../styles/user-styles.css'
import { Component, Prop,  Vue } from 'vue-property-decorator'
import { Form, Formio } from 'vue-formio';
import { getFormDetails } from "../services/get-formio";

@Component({
  components: {
    formio: Form
  }
})
export default class FormViewSubmission extends Vue {
  @Prop() private formid !: string;
  @Prop() private submissionid !: string;

  private formUrl = ''
  private formioUrlLink = ''
  private readoption = { readOnly: true };
  private fId = ''
  private sId = ''
  private formioProjectUrl = "https://forms2.aot-technologies.com"
  private homeUrl = ''

  mounted() {
    this.formUrl = window.location.href;
    this.homeUrl = localStorage.getItem('formsflow.ai.url') || "https://app2.aot-technologies.com"

    const { formioUrl, formId, submissionId } = getFormDetails(
      this.formUrl,
      localStorage.getItem('formioApiUrl') || this.formioProjectUrl
    );

    if(formId&& submissionId){

      this.formioUrlLink = formioUrl.replace("http", "https");
      this.fId = formId;
      this.sId = submissionId;
    }

    else {
      this.fId = this.formid;
      this.sId = this.submissionid;
      this.formioUrlLink = localStorage.getItem('formioApiUrl') || this.formioProjectUrl + "/form/" + this.fId + "/submission/" + this.sId;
    }

    Formio.createForm(document.getElementById('formio'), this.formioUrlLink, {
      readOnly: true,
    });
  }

}
</script>
