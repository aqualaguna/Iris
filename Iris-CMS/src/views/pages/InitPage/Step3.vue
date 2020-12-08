<template>
  <div>
    <h2 class="text-center mb-base">Initialize Starting...</h2>
    <vs-button
      :disabled="isRunning"
      @click="init"
      icon-pack="feather"
      icon="icon-refresh-ccw"
      type="border"
      class="float-right m-3"
    ></vs-button>
    <div class="flex flex-direction-col flex-wrap">
      <prism :key="$vs.rtl" class="w-full flex-initial">{{ initLog }}</prism>
    </div>
  </div>
</template>

<script>
import Prism from "vue-prism-component";
import initPermission from "./initPermission";
export default {
  components: {
    Prism,
  },
  computed: {
    initLog() {
      return this.log.join("\n");
    },
    projectId() {
      let app = this.$store.state.selectedApp;
      return app ? app.projectId : null;
    },
    user() {
      return this.app ? this.$firebase.auth(this.app).currentUser : null;
    },
  },
  data() {
    return {
      log: [],
      db: null,
      app: null,
      finish: false,
      isRunning: false,
    };
  },
  mounted() {
    this.app = this.$app(this.projectId);
    this.db = this.$firebase.firestore(this.app);
    this.init();
  },
  methods: {
    checkFinish() {
      if (!this.finish) {
        this.$vs.notify({
          position: "bottom-center",
          time: 2500,
          title: "Not Finished! wait a moment.",
        });
      }
      return this.finish
        ? Promise.resolve(this.finish)
        : Promise.reject(this.finish);
    },
    async initRolePermissionData() {
      await initPermission(this.db, this.log);
    },
    async init() {
      this.isRunning = true;
      this.log = [];
      this.log.push("Start Initialize");
      this.log.push("Check for Write & Read Avaibility.");
      try {
        await this.checkWRAvaibility();
        this.log.push("Write & Read available!");
      } catch (e) {
        this.log.push(e);
        this.log.push("Cannot Write or Read to Firestore.");
        this.log.push("Aborting.");
        this.isRunning = false;
        return;
      }
      this.log.push("Check Current User.");
      try {
        let user = await this.checkCurrentUser();
        this.log.push("User Valid!");
        this.log.push("email=" + user.email);
      } catch (e) {
        this.log.push(e);
        this.log.push("Aborting.");
        this.isRunning = false;
        return;
      }
      this.log.push("Init Role Permission.");
      try {
        await this.initRolePermissionData();
        this.log.push("Role Permission Initialized!");
      } catch (e) {
        this.log.push(e);
        this.log.push("Aborting.");
        this.isRunning = false;
        return;
      }
      this.log.push("Init User.");
      try {
        await this.initUser();
        this.log.push("User Initialized!");
      } catch (e) {
        this.log.push(e);
        this.log.push("Aborting.");
        this.isRunning = false;
        return;
      }
      this.log.push("Init Settings.");
      try {
        await this.initUser();
        this.log.push("Settings Initialized!");
      } catch (e) {
        this.log.push(e);
        this.log.push("Aborting.");
        this.isRunning = false;
        return;
      }
      this.log.push("Finish Initializing.");
      this.isRunning = false;
      this.finish = true;
    },
    async initSettings() {
      let db = this.$firebase.firestore(this.$app(this.projectId));
      let col = db.collection("iris_global");
      let doc = col.doc('iris_settings');
      let payload = {
        initialized: true
      };
      await doc.set(payload).catch((e) => this.log.push(e));
    },
    async initUser() {
      // get current user
      if (!this.user) {
        throw "Not Signed In!";
      }
      let db = this.$firebase.firestore(this.$app(this.projectId));
      let col = db.collection("iris_user");
      let doc = col.doc(this.user.uid);
      let payload = {
        name: this.user.displayName,
        email: this.user.email,
        phone: this.user.phoneNumber || "",
        profile_picture: this.user.photoURL || "",
        role_id: 'super_admin',
      };
      await doc.set(payload).catch((e) => this.log.push(e));
    },
    async checkWRAvaibility() {
      if (!this.projectId) {
        throw "app not properly selected.";
      }
      let db = this.$firebase.firestore(this.$app(this.projectId));
      let col = db.collection("iris_test");
      let doc = col.doc();
      await doc.set({
        test: 1,
      });
      let row = await doc.get();
      if (row.data().test != 1) {
        throw "data write not same as read";
      } else {
        await doc.delete();
      }
    },
    async checkCurrentUser() {
      if (!this.projectId) {
        throw "app not properly selected.";
      }
      let auth = this.$firebase.auth(this.$app(this.projectId));
      if (auth.currentUser) {
        return auth.currentUser;
      }
      throw "User not logged in.";
    },
  },
};
</script>

<style></style>
