<template>
  <div class=" mb-base">
    <h3>{{ label }}</h3>
    <div class="flex">
      <VueAceEditor
        v-model="val"
        @init="editorInit"
        lang="html"
        theme="chrome"
        class="w-full"
        height="300"
      />
      <div style="width:500px;height:300px" class="p-3 flex-none">
        <h3>Preview</h3>
        <component
          :is="scrollbarTag"
          class="pt-4 pb-6"
          style="width:500px;height:300px"
          :settings="settings"
          :key="$vs.rtl"
        >
          <div v-html="val"></div>
        </component>
      </div>
    </div>

    <span class="text-danger text-sm" v-show="danger">{{ dangerText }}</span>
  </div>
</template>

<script>
import VueAceEditor from "vue2-ace-editor";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  name: "CodeEditor",

  props: {
    index: Number,
    value: {},
    schema: {
      type: Object,
      required: true,
    },
    label: String,
    placeholder: String,
  },
  computed: {
    scrollbarTag() {
      return this.$store.state.is_touch_device ? "div" : "VuePerfectScrollbar";
    },
  },
  components: {
    VueAceEditor,
    VuePerfectScrollbar,
  },

  mounted() {
    if (
      this.schema.type &&
      (this.schema.type.includes("integer") ||
        this.schema.type.includes("number"))
    ) {
      this.type = "number";
      (this.val = this.value || this.schema.default || ""),
        (this.min = this.schema.minimum);
      this.max = this.schema.maximum;
    } else if (this.schema.type && this.schema.type.includes("boolean")) {
      this.type = "checkbox";
      this.val = this.value || this.schema.default || false;
    } else if (this.schema.type && this.schema.type.includes("array")) {
      this.val = this.value || this.schema.default || [];
    } else {
      this.val = this.value || this.schema.default || "";
    }
    this.validate(this.val);
  },

  watch: {
    val(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      val: "",

      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  methods: {
    validate(val) {
      if (this.schema.type && this.schema.type.includes("null") && val == "") {
        this.val = null;
        this.validate(null);
        return;
      }
      let validateFunc = this.$ajv.compile(this.schema);
      if (val instanceof Date) {
        val = val.toISOString();
      }

      var valid = validateFunc(val);
      if (!valid) {
        this.danger = true;
        this.dangerText = validateFunc.errors[0].message;
      } else {
        this.danger = false;
      }
    },
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/chrome");
      require("brace/snippets/javascript"); //snippet
    },
  },
};
</script>

<style></style>
