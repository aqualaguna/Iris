<template>
  <div>
    <h2>
      {{ modelName.substring(5) | title }}
      <vs-button
        :disabled="isLoading"
        class="float-right"
        v-shortkey="['ctrl', 'enter']"
        @shortkey.native="save"
        @click="save"
        >Save</vs-button
      >
    </h2>
    <br />
    <div class="flex flex-wrap">
      <div
        v-for="definition in definitions"
        :key="definition.api_label"
        class="w-full"
      >
        <AjvInput
          v-if="definition.type == 'text'"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        />
        <RichTextInput
          v-else-if="definition.type == 'rich_text'"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        />
        <WYSIWYG
          v-else-if="definition.type == 'html'"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        ></WYSIWYG>

        <!-- <vs-input
          v-if="definition.type == 'text'"
          label="Name"
          placeholder="Your Name"
          v-model="value1"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import AjvInput from "../AjvInput";
import handleFirestoreReject from "@/helper/handleFirestoreReject";
import RichTextInput from "./RichTextInput";
import WYSIWYG from './WYSIWYG';


export default {
  name: "CreateSharedContent",
  components: {
    AjvInput,
    RichTextInput,
    WYSIWYG
  },
  data() {
    return {
      isLoading: false,
      customModelData: {},
    };
  },
  methods: {
    reset() {
      this.customModelData = {};
    },
    save() {
      // check for validation
      const schema = { properties: {} };
      for (const definition of this.irisContentModel.definitions) {
        schema.properties[definition.api_label] = definition.schema;
      }
      let validateFunc = this.$ajv.compile(schema);
      console.log(this.customModelData, schema);
      var valid = validateFunc(this.customModelData);
      if (!valid) {
        let firstError = validateFunc.errors[0];
        this.$vs.notify({
          position: "bottom-center",
          time: 2500,
          title: firstError.dataPath,
          text: firstError.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
        console.log(validateFunc.errors);
        return;
      }
      if (this.isLoading) return;
      this.isLoading = true;
      // save it yeahh..
      const db = this.app.firestore();

      db.runTransaction(async (transaction) => {
        const doc = db.collection(this.modelName).doc();
        // set the doc
        await transaction.set(doc, {
          ...this.customModelData,
          createdAt: this.$firebase.firestore.Timestamp.now(),
          updatedAt: this.$firebase.firestore.Timestamp.now(),
        });
        // increase the counter
        const cmDoc = db.collection("iris_content_model").doc(this.modelName);
        await transaction.update(cmDoc, {
          row_count: this.$firebase.firestore.FieldValue.increment(1),
        });
        return true;
      })
        .then(() => {
          this.isLoading = false;
          this.$vs.notify({
            title:
              this.$options.filters.title(this.modelName.substring(5)) +
              " record created!",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
            position: "bottom-center",
          });
          this.reset();
        })
        .catch(handleFirestoreReject.bind(this));
    },
  },
  computed: {
    definitions() {
      return this.irisContentModel ? this.irisContentModel.definitions : [];
    },
    app() {
      let config = this.$store.state.selectedApp;
      return this.$app(config.projectId) || null;
    },
    modelName() {
      return this.$route.params.id;
    },
    irisContentModel() {
      return this.$store.state.content_model.irisContentModel.find(
        (t) => t.id == this.modelName
      );
    },
  },
};
</script>

<style></style>
