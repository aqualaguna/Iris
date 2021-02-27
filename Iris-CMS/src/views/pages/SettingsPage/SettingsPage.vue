<template>
  <vx-card>
    <h3 class="title">Algolia</h3>
    <vs-divider></vs-divider>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>App Id</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" v-model="settings.algolia.app_id" />
      </div>
    </div>

    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>App Secret</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" v-model="settings.algolia.app_secret" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>App Search Secret</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" v-model="settings.algolia.app_search_secret" />
      </div>
    </div>
    <vs-divider></vs-divider>
    <div class="flex justify-end">
      <vs-button @click="saveSettings" :disabled="isLoading">
        Save
      </vs-button>
    </div>
  </vx-card>
</template>

<script>
import handleFirestoreReject from "@/helper/handleFirestoreReject";

export default {
  name: "Settings",
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return this.$app(config.projectId) || null;
    },
  },
  data() {
    return {
      isLoading: false,
      settings: {
        algolia: {
          app_id: "",
          app_secret: "",
          app_search_secret: "",
        },
      },
    };
  },
  methods: {
    saveSettings() {
      this.isLoading = true;
      const setSettings = this.app.functions().httpsCallable("setSettings");
      setSettings(this.settings)
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$vs.notify({
            position: "bottom-center",
            color: "success",
            title: "Settings Saved!",
          });
        })
        .catch(handleFirestoreReject.bind(this));
    },
  },
};
</script>

<style></style>
