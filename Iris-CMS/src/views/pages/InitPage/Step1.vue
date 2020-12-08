<template>
  <div>
    <h2 class="text-center mb-base">Preparation</h2>
    <!-- tab 1 content -->
    <div class="flex flex-direction-col flex-wrap">
      <p class="w-full flex-initial">
        1. Please Make Sure you are already initialized your firestore.
      </p>
      <p class="w-full flex-initial">
        2. Firestore rule set as bellow (only first time).
      </p>
      <prism :key="$vs.rtl" class="w-full flex-initial">{{
        default_rule
      }}</prism>
    </div>
  </div>
</template>

<script>
import Prism from "vue-prism-component";

export default {
  name: "Step1",
  components: {
    Prism,
  },
  data() {
    return {
      default_rule: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`,
    };
  },
};
</script>

<style></style>
