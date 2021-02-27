<template>
  <div>
    <div class="flex w-full">
      <div style="" class="p-6 left-prop">
        <p>
          <b>Required</b>
        </p>
        <span class="text-sm">Value must not empty.</span>
      </div>
      <div class="flex-1 right-prop">
        <center>
          <input type="checkbox" class="mt-8" v-model="required" />
        </center>
      </div>
    </div>
    <div class="flex w-full">
      <div style="" class="p-6 left-prop">
        <p>
          <b>Collection</b>
        </p>
        <span class="text-sm">Select Collection to be referenced.</span>
      </div>
      <div class="flex-1 right-prop">
        <vs-list>
          <vs-list-item
            v-for="item in irisContentModelActive"
            :key="item.collection_name"
            :title="item.title"
            @click.native="selected = item.id"
          >
            <template slot="avatar">
              <AvatarIcon :icon="item.icon" size="small" />
            </template>
            <vs-radio
              v-model="selected"
              vs-name="col"
              :vs-value="item.id"
            ></vs-radio>
          </vs-list-item>
        </vs-list>
      </div>
    </div>
    <div class="flex w-full">
      <div style="" class="p-6 left-prop left-prop-last">
        <p>
          <b>Field From Ref</b>
        </p>
        <span class="text-sm">included field from referenced document.</span>
      </div>
      <div class="flex-1 right-prop">
        <vSelect
          multiple
          :closeOnSelect="false"
          class="bg-white m-3"
          v-model="fieldFromRef"
          :options="options"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AvatarIcon from "./AvatarIcon";
import vSelect from "vue-select";

export default {
  name: "RefFieldProperties",
  components: {
    AvatarIcon,
    vSelect,
  },
  data() {
    return {
      selected: "",
      required: false,
      fieldFromRef: [],
      options: [],
    };
  },
  props: ["schema"],
  watch: {
    selected(newVal) {
      this.$emit("setRef", newVal);
      console.log("newval", newVal);
      let definitions = (
        this.irisContentModelActive.find((t) => t.id == newVal) || {
          definitions: [],
        }
      ).definitions;
      console.log("def", definitions);
      this.options = definitions.map((t) => t.api_label);
    },
    required(newVal) {
      this.$emit("setRequired", newVal);
    },
    fieldFromRef(newVal) {
      this.$emit("setFieldFromRef", newVal);
    },
  },
  mounted() {
    this.required = this.schema.required || false;
    this.selected = this.schema.collection_name || "";
  },
  computed: {
    irisContentModel() {
      return this.$store.state.content_model.irisContentModel.filter(
        (t) => t.algolia_index !== ""
      );
    },
    irisContentModelActive() {
      return this.irisContentModel.filter((t) => t.archived == false);
    },
  },
};
</script>

<style></style>
