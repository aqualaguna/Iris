<template>
  <div>
    <vs-input
      :disabled="mode == 'update'"
      name="title"
      size="large"
      class="w-full mb-base"
      v-model="role.name"
      placeholder="Role Name. eg. Editor, Contributor, etc."
    />

    <div class="flex justify-between">
      <h2>Permission</h2>
      <vs-button @click="createRole" class="m-2"
        >{{ mode | title }} Role</vs-button
      >
    </div>
    <vx-card>
      <vs-list v-for="(value, key) in role.permission" :key="key">
        <vs-list-header :title="key"></vs-list-header>
        <template v-for="(val, k) in value">
          <vs-list-item
            :key="k"
            :title="k"
            @click.native="value[k] = !value[k]"
            v-if="k != 'type'"
          >
            <vs-checkbox
              v-model="value[k]"
              @click.native="value[k] = !value[k]"
            ></vs-checkbox>
          </vs-list-item>
        </template>
      </vs-list>
    </vx-card>
  </div>
</template>

<script>
import handleFirestoreReject from "@/helper/handleFirestoreReject";
import Template from "../Template.vue";

export default {
  components: { Template },
  name: "CreateRolePage",
  data() {
    return {
      mode: "create",
      template: {},
      role: {},
    };
  },
  mounted() {
    this.focus();

    if (this.app) {
      let db = this.app.firestore();
      let col = db.collection("iris_role_permission");
      let doc = col.doc("super_admin");
      if (this.$route.name == "RoleUpdate") {
        // init the data i guess
        this.mode = "update";
        doc.get().then(async (t) => {
          this.template = { id: t.id, ...t.data() };
          this.role = this.$store.state.role.updateData;
        });
      } else {
        doc.get().then((t) => {
          this.template = { id: t.id, ...t.data() };
          this.role = { id: t.id, ...t.data() };
          this.role.name = "";
        });
      }
    }
  },
  methods: {
    createApiLabel(val) {
      return val.replace(/\s/, "_").toLowerCase();
    },
    async createRole() {
      let doc_id = this.createApiLabel(this.role.name);
      this.role.role = doc_id;
      let doc = this.app
        .firestore()
        .collection("iris_role_permission")
        .doc(doc_id);
      let data = await doc.get();
      if (data.exists && this.mode == "create") {
        this.$vs.notify({
          title: "Role Already Exists!",
          text: "Please use other name.",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "bottom-center",
        });
      } else {
        doc
          .set(this.role)
          .then(() => {
            this.$vs.notify({
              title: `Role ${this.mode}d!`,
              color: "success",
              iconPack: "feather",
              position: "bottom-center",
            });
            this.reset();
          })
          .catch(handleFirestoreReject.bind(this));
      }
    },
    focus() {
      this.$el.querySelector("input[name=title]").focus();
    },
    reset() {
      this.role = JSON.parse(JSON.stringify(this.template));
      this.role.name = "";
    },
  },
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
  },
};
</script>

<style></style>
