<template>
  <div>
    <CreateFieldSidebar ref="cSidebar" @addField="addField" />
    <IconPickerPopup ref="ipPopup" @setIcon="setIcon" />
    <div class="flex justify-items-center">
      <AvatarIcon :icon="icon" @click="$refs.ipPopup.open()" />
      <!-- <vs-avatar  icon-pack="feather" icon="icon-user" class="p-3 mr-5"/> -->
      <vs-input
        name="title"
        size="large"
        class="w-full mb-base"
        v-model="title"
        placeholder="Content Model Name. eg. Post, Blog, Comment, etc."
      />
    </div>

    <h3>Definition Field</h3>
    <vs-button
      @click="$refs.cSidebar.isSidebarActiveLocal = true"
      type="border"
      class="m-3"
    >
      Add Field
    </vs-button>
    <vs-button
      @click="createContentModel"
      v-shortkey="['ctrl', 'enter']"
      @shortkey.native="createContentModel"
    >
      {{ mode == "create" ? "Create" : "Update" }} Content Model
    </vs-button>
    <DefinitionField
      :definitions="definitions"
      :path="[]"
      @edit="editDefinition"
      @delete="deleteDefinition"
      @add-field="
        path = $event.path;
        index = $event.index;
        $refs.cSidebar.isSidebarActiveLocal = true;
      "
    />
    
  </div>
</template>

<script>
import CreateFieldSidebar from "./CreateFieldSidebar";
import AjvInput from "./AjvInput";
import IconPickerPopup from "./IconPickerPopup";
import handleFirestoreReject from "@/helper/handleFirestoreReject";
import AvatarIcon from "./AvatarIcon";
import DefinitionField from "./DefinitionField";
import EventBus from "@/event-bus";
export default {
  name: "CreateContentModel",
  components: {
    CreateFieldSidebar,
    AjvInput,
    IconPickerPopup,
    AvatarIcon,
    DefinitionField,
  //   Test: (resolve, reject) => {
  //     return resolve({
  //       template: "<div>{{message}}</div>",
  //       data() {
  //         return {
  //           message: "test man",
  //         };
  //       },
  //       created() {
  //         console.log('yo!', this.$app);
  //       }
  //     });
  //   },
  },
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return this.$app(config.projectId) || null;
    },
  },
  data() {
    return {
      path: [],
      index: -1,
      id: null,
      mode: "create",
      field_mode: "create",
      definitions: [],
      title: "",
      icon: "KeyIcon",
      reserved_collection: [
        "iris_content_model",
        "iris_role_permission",
        "iris_user",
        "iris_",
        "iris_global",
        "iris_plugin",
      ],
    };
  },
  mounted() {
    this.focus();
    if (this.$route.name == "ContentModelUpdate") {
      // get update data
      this.mode = "update";
      let data = JSON.parse(
        JSON.stringify(this.$store.state.content_model.updateData)
      );
      this.definitions = data.definitions;
      this.title = data.title;
      this.icon = data.icon;
      this.id = data.collection_name;
    }
  },
  methods: {
    focus() {
      this.$el.querySelector("input[name=title]").focus();
    },
    setIcon(icon) {
      this.icon = icon;
    },
    editDefinition(def) {
      let { definition, path } = def;
      this.$refs.cSidebar.setMode("update", definition);
      this.path = path;
      this.field_mode = "update";
      this.$refs.cSidebar.isSidebarActiveLocal = true;
    },
    deleteDefinition(data) {
      let { index, path } = data;
      // this.definitions.splice(index, 1);
      this.index = index;
      this.path = path;
      let defs = this.definitions;
      // dive
      try {
        for (const p of this.path) {
          if (!Array.isArray(defs)) {
            defs = defs[index].schema.definitions;
            continue;
          }
          let index = defs.findIndex((t) => t.api_label == p);
          if (index != -1) {
            if (
              defs[index].type == "array" &&
              (defs[index].schema.definitions == null ||
                !Array.isArray(defs[index].schema.definitions))
            ) {
              defs = defs[index].schema;
            } else defs = defs[index].schema.definitions;
          } else {
            throw "Unknown Path";
          }
        }
      } catch (e) {
        // clean up, notify & return
        this.path = [];
        this.index = -1;
        this.field_mode = "create";
        this.$vs.notify({
          title: e,
          color: "danger",
          position: "bottom-center",
        });
        return;
      }
      if (Array.isArray(defs)) defs.splice(this.index, 1);
      else {
        defs.definitions = null;
      }
      // clean up
      this.path = [];
      this.index = -1;
      this.field_mode = "create";
      EventBus.$emit("force-refresh");
    },
    createContentModelCollectionName(val) {
      return "iris_" + val.replace(/\s/, "_").toLowerCase();
    },
    async createContentModel() {
      if (this.app) {
        let colName = this.createContentModelCollectionName(this.title);
        if (
          this.mode == "create" &&
          this.reserved_collection.includes(colName)
        ) {
          this.$vs.notify({
            title: "Content Model Name is Reserved for System!",
            text: "Please use other name.",
            color: "warning",
            iconPack: "feather",
            icon: "icon-alert-circle",
            position: "bottom-center",
          });
          return;
        }
        let payload = {
          title: this.title,
          collection_name: colName,
          definitions: this.definitions,
          icon: this.icon,
          row_count: 0,
          archived: false,
          algolia_index: "",
        };
        if (this.mode == "update") {
          // this field in unchangeable.
          payload.collection_name = this.id;
          delete payload.row_count;
          delete payload.archived;
          delete payload.algolia_index;
        }
        let res = await this.$store
          .dispatch(
            this.mode == "create"
              ? "content_model/createContentModel"
              : "content_model/updateContentModel",
            payload
          )
          .catch(handleFirestoreReject.bind(this));
        if (typeof res == "object" && res.color) this.$vs.notify(res);
      } else {
        this.$notify({
          position: "bottom-center",
          color: "danger",
          text: "please select your app first!",
          title: "App not Selected.",
        });
      }
    },
    addField(def) {
      // check for nested
      if (this.path.length == 0) {
        // check for uniqueness
        let item = this.definitions.find((t) => t.api_label == def.api_label);
        if (item) {
          // update
          this.$vs.notify({
            title: "api label must unique",
            color: "danger",
            position: "bottom-center",
          });
        } else {
          this.definitions.push(def);
        }
      } else {
        // nested add field
        let defs = this.definitions;
        let arrayNullFlag = false;
        // dive
        try {
          for (const p of this.path) {
            if (!Array.isArray(defs)) {
              defs = defs.schema.definitions;
              continue;
            }
            let index = defs.findIndex((t) => t.api_label == p);
            if (index != -1) {
              if (
                defs[index].type == "array" &&
                defs[index].schema.definitions == null
              ) {
                arrayNullFlag = true;
                defs = defs[index].schema;
              } else defs = defs[index].schema.definitions;
            } else {
              throw "Unknown Path";
            }
          }
        } catch (e) {
          // clean up, notify & return
          this.path = [];
          this.index = -1;
          this.field_mode = "create";
          this.$vs.notify({
            title: e,
            color: "danger",
            position: "bottom-center",
          });
          return;
        }

        if (!(defs instanceof Array)) {
          switch (def.type) {
            case "array":
              break;
            case "object":
              defs.definitions = [def];
              break;
            default:
              // check if denfinitions field is array
              if (Array.isArray(defs.definitions)) {
                let item = defs.definitions.find(
                  (t) => t.api_label == def.api_label
                );
                if (item) {
                  // update
                  this.$vs.notify({
                    title: "api label must unique",
                    color: "danger",
                    position: "bottom-center",
                  });
                } else {
                  defs.definitions.push(def);
                }
              } else defs.definitions = def;
              break;
          }
        } else {
          if (arrayNullFlag) {
            defs.definitions = def;
          } else {
            let item = defs.findIndex((t) => t.api_label == def.api_label);
            if (item != -1) {
              // update
              if (this.field_mode == "update") {
                // replace it
                defs.splice(item, 1, def);
              } else
                this.$vs.notify({
                  title: "api label must unique",
                  color: "danger",
                  position: "bottom-center",
                });
            } else {
              defs.push(def);
            }
          }
        }
        this.path = [];
        this.index = -1;
        this.field_mode = "create";
      }
      this.$vs.notify({
        position: "bottom-center",
        time: 2500,
        title: `Field ${this.field_mode}d`,
        color: "success",
      });

      EventBus.$emit("force-refresh");
    },
  },
}
</script>
<style lang="scss"></style>
