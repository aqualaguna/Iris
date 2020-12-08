<template>
  <form-wizard
    color="rgba(var(--vs-primary), 1)"
    :title="null"
    :subtitle="null"
    ref="wizard"
    finishButtonText="Go to Dashboard"
    @on-complete="formSubmitted"
  >
    <tab-content title="Step 1" class="mb-5">
      <Step1 />
    </tab-content>
    <tab-content title="Step 2" class="mb-5" :before-change="validateStep2">
      <Step2 ref="s2" />
    </tab-content>

    <!-- tab 2 content -->
    <tab-content title="Step 3" class="mb-5" :before-change="validateStep3">
      <Step3 ref="s3" />
    </tab-content>

    <!-- tab 3 content -->
    <tab-content title="Step 4" class="mb-5">
      <div class="vx-row">
        <h2 class="text-center mb-base">Finished</h2>
      </div>
    </tab-content>
  </form-wizard>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default {
  computed: {
    initLog() {
      return this.log.join("\n");
    },
    projectId() {
      let app = this.$store.state.selectedApp;
      return app ? app.projectId : null;
    },
  },
  data() {
    return {};
  },
  methods: {
    validateStep2() {
      return this.$refs.s2
        ? this.$refs.s2.validateLogin()
        : Promise.resolve(false);
    },
    validateStep3() {
      return this.$refs.s3
        ? this.$refs.s3.checkFinish()
        : Promise.resolve(false);
    },
    formSubmitted() {
      // mark app as initialized.
      this.$store.commit('markAsInitialized');
      this.$router.push('/dashboard');

    },
  },
  components: {
    FormWizard,
    TabContent,
    Step1,
    Step2,
    Step3,
  },
};
</script>
