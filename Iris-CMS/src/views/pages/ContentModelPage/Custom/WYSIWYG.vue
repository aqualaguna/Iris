<template>
  <div class=" mb-base">
    <h3>{{ label }}</h3>
    <quillEditor
      v-model="val"
      @input="validate"
      :placeholder="placeholder"
      @onEditorReady="onEditorReady($event)"
      :options="editorOption"
    />
    <span class="text-danger text-sm" v-show="danger">{{ dangerText }}</span>
    <ImagePicker ref="ipicker" />
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import ImagePicker from "./ImagePicker";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  components: {
    quillEditor,
    ImagePicker,
  },
  name: "WYSIWYGEditor",
  props: {
    value: {},
    schema: {
      type: Object,
      required: true,
    },
    label: String,
    placeholder: String,
  },
  computed: {
    maxLength() {
      return (this.schema ? this.schema.maxLength : null) || Infinity;
    },
    counterDanger() {
      let min = (this.schema ? this.schema.minLength : null) || 0;

      return typeof this.val == "string"
        ? this.val.length >= min && this.val.length <= this.maxLength
        : false;
    },
  },
  methods: {
    imageHandler(quill) {
      console.log(quill);
      this.$refs.ipicker.open();
    },
    onEditorReady(editor) {
      editor.getModule("toolbar").addHandler("image", this.imageHandler);
      console.log("editor ready!", editor);
    },
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
    let tis = this;
    return {
      val: "",
      danger: false,
      dangerText: "",
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ direction: "rtl" }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ["clean"],
              ["link", "image", "video"],
            ],
            handlers: {
              image: function() {
                tis.imageHandler(this);
              },
            },
          },
        },
        placeholder: this.placeholder,
        readOnly: false,
      },
    };
  },
};
</script>

<style></style>
