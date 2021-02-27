<template>
  <div class=" mb-base">
    <h3>{{ label }}</h3>
    <VueEditor
      ref="editor"
      v-model="val"
      @input="validate"
      :placeholder="placeholder"
      :editorOptions="editorSettings"
      useCustomImageHandler
      @image-added="handleImageAdded"
    />
    <span class="text-danger text-sm" v-show="danger">{{ dangerText }}</span>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { QuillToolbarButton } from "./QuillCustom";

export default {
  components: {
    VueEditor,
  },
  name: "WYSIWYGEditor",
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return this.$app(config.projectId) || null;
    },
    storage() {
      return this.app ? this.app.storage() : null;
    },
  },
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
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)
      const ref = this.storage.ref(file.name);
      ref.put(file).then(async (res) => {
        Editor.insertEmbed(cursorLocation, "image", await (res.ref.getDownloadURL()));
        resetUploader();
      });
    },
    imageHandler(quill) {
      // console.log(imageDataUrl, type, imageData);
      this.$emit("file-pick", {
        index: this.index,
        path: "",
        type: "image",
        quill,
      });
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
    // custom component
    const myButton = new QuillToolbarButton({
      icon: `<svg id="Capa_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path d="m490.007 73.969c4.143 0 7.5-3.358 7.5-7.5v-13.229c0-29.357-23.883-53.24-53.24-53.24h-220.526c-29.356 0-53.24 23.883-53.24 53.24v102.768h-102.768c-29.356 0-53.24 23.883-53.24 53.24v220.537c0 29.351 23.883 53.229 53.24 53.229h14.269c4.143 0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-14.269c-21.086 0-38.24-17.15-38.24-38.23v-220.537c0-21.086 17.154-38.24 38.24-38.24h102.768v102.769c0 29.351 23.883 53.229 53.24 53.229h26.088l6.569 141.009h-144.396c-4.143 0-7.5 3.358-7.5 7.5s3.357 7.5 7.5 7.5h146.038c3.822 14.277 15.214 25.153 30.368 28.18 2.715.542 5.413.806 8.068.806 15.06-.001 28.688-8.482 35.388-22.681l21.371-45.286c5.035-10.666 16.969-16.234 28.377-13.24l48.433 12.719c17.866 4.692 35.82-3.043 44.684-19.247 8.863-16.203 5.691-35.497-7.894-48.008l-53.478-49.252h30.911c29.356 0 53.24-23.879 53.24-53.229v-177.307c0-4.142-3.357-7.5-7.5-7.5s-7.5 3.358-7.5 7.5v177.307c0 21.08-17.154 38.229-38.24 38.229h-47.198l-55.571-51.18v-51.579c0-29.357-23.883-53.24-53.24-53.24h-102.758v-102.766c0-21.086 17.154-38.24 38.24-38.24h220.527c21.086 0 38.24 17.154 38.24 38.24v13.23c-.001 4.141 3.356 7.499 7.499 7.499zm-28.438 343.098c-4.239 7.751-14.045 15.528-27.714 11.938l-48.433-12.719c-18.398-4.831-37.636 4.147-45.751 21.346l-21.371 45.285c-6.033 12.784-18.291 15.299-26.954 13.568-8.663-1.73-19.013-8.762-19.672-22.883l-9.721-208.662c-.563-12.091 6.92-19.985 14.112-23.34 3.025-1.411 6.697-2.346 10.601-2.346 5.378 0 11.193 1.775 16.352 6.526l153.652 141.51c10.401 9.577 9.139 22.026 4.899 29.777zm-173.31-246.059c21.086 0 38.24 17.154 38.24 38.24v37.764l-13.317-12.265c-12.011-11.06-28.663-13.642-43.457-6.74-14.796 6.903-23.514 21.322-22.755 37.631l2.16 46.368h-25.389c-21.086 0-38.24-17.15-38.24-38.229v-102.769z"/></g></svg>`,
    });
    const self = this;
    myButton.onClick = function(quill) {
      // Do whatever you want here. You could use this.getValue() or this.setValue() if you wanted.

      // For example, get the selected text and convert it to uppercase:
      // const { index, length } = quill.selection.savedRange;
      // const selectedText = quill.getText(index, length);
      // const newText = selectedText.toUpperCase();
      // quill.deleteText(index, length);
      // quill.insertText(index, newText);
      // quill.setSelection(index, newText.length);
      self.imageHandler(quill);
    };
    this.$nextTick(() => {
      myButton.attach(this.$refs.editor.quill);
    });
  },

  watch: {
    val(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      val: "",
      danger: false,
      dangerText: "",
      editorSettings: {
        modules: {
          // toolbar: '#toolbar' + this.index,
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [
              { align: "" },
              { align: "center" },
              { align: "right" },
              { align: "justify" },
            ],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            ["image", "video", "link"],
            ["clean"],
          ],
          imageDrop: true,
          imageResize: {},
          videoResize: {},
        },
      },
    };
  },
};
</script>

<style>
.ql-editor iframe {
  pointer-events: none;
}
</style>
