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
        v-for="(definition, index) in definitions"
        :key="definition.api_label"
        class="w-full"
      >
        <AjvInput
          ref="input"
          v-if="definition.type == 'text'"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        />
        <RichTextInput
          ref="input"
          v-else-if="definition.type == 'rich_text'"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        />
        <WYSIWYG
          ref="input"
          v-else-if="definition.type == 'html'"
          :index="index"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
          @file-pick="filePick"
        ></WYSIWYG>
        <CodeEditor
          ref="input"
          v-else-if="definition.type == 'html_code'"
          :index="index"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        ></CodeEditor>
        <DropDown
          ref="input"
          v-else-if="definition.type == 'dropdown'"
          :index="index"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        ></DropDown>
        <Ref
          ref="input"
          v-else-if="definition.type == 'ref'"
          :index="index"
          :schema="definition.schema"
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        ></Ref>
        <AjvInput
          ref="input"
          v-else-if="definition.type == 'int'"
          :schema="definition.schema"
          noClear
          v-model="customModelData[definition.api_label]"
          :label="definition.title"
          :placeholder="definition.description"
        />
        <!-- <vs-input
          v-if="definition.type == 'text'"
          label="Name"
          placeholder="Your Name"
          v-model="value1"
        /> -->
      </div>
    </div>
    <FilePicker ref="fpPopup" v-if="fpFlag" @close="fpFlag = false" />
  </div>
</template>

<script>
import AjvInput from "../AjvInput";
import handleFirestoreReject from "@/helper/handleFirestoreReject";
import RichTextInput from "./RichTextInput";
import WYSIWYG from "./WYSIWYG";
import FilePicker from "./FilePicker";
import CodeEditor from "./CodeEditor";
import DropDown from "./DropDown";
import Ref from "./Ref";

export default {
  name: "CreateSharedContent",
  components: {
    AjvInput,
    RichTextInput,
    WYSIWYG,
    FilePicker,
    CodeEditor,
    DropDown,
    Ref,
  },
  data() {
    return {
      mode: "create",
      fpFlag: false,
      isLoading: false,
      customModelData: {},
    };
  },
  mounted() {
    if (this.$route.name == "UpdateContentModelCustomPage") {
      // get update data
      this.mode = "update";
      this.customModelData = JSON.parse(
        JSON.stringify(this.$store.state.content_model.updateDataRow)
      );
    }
  },
  methods: {
    filePick(evt) {
      this.fpFlag = true;
      this.$nextTick(() => {
        this.$refs.fpPopup.open(evt);
      });
    },
    reset() {
      this.customModelData = {};
      this.$forceUpdate();
      for (const inp of this.$refs.input) {
        if (typeof inp.reset == "function") inp.reset();
      }
    },
    definitionDive(definitions) {
      const schema = { properties: {} };
      for (const definition of definitions) {
        // exception
        if (Array.isArray(definition.schema.enum)) {
          definition.schema.enum = [
            ...definition.schema.enum.map((t) => t.value),
            null,
          ];
        }

        if (definition.type == "ref") {
          // if ref type
          // change the definition
          schema.properties[definition.api_label] = {
            type: ["object", ...(definition.schema.required ? [] : ["null"])],
            required: ["id", ...definition.schema.fieldFromRef],
            default: null,
          };
          if (definition.schema.required) {
            if (Array.isArray(schema.required))
              schema.required.push(definition.api_label);
            else {
              schema.required = [definition.api_label];
            }
          }
        } else schema.properties[definition.api_label] = definition.schema;
      }
      return schema;
    },
    save() {
      // check for validation

      let clone = JSON.parse(JSON.stringify(this.irisContentModel.definitions));
      const schema = this.definitionDive(clone);
      console.log(this.customModelData, schema);
      let validateFunc = this.$ajv.compile(schema);
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
