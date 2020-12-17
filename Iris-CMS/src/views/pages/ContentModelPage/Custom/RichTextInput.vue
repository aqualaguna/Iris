<template>
  <div class=" mb-2">
    <vs-textarea
      :counter="maxLength"
      :label="label"
      :placeholder="placeholder"
      :counter-danger="counterDanger"
      v-model="val"
      @input="validate"
    />
    <span class="text-danger text-sm" v-show="danger">{{ dangerText }}</span>
  </div>
</template>

<script>
export default {
  name: "RichTextInput",
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

      return typeof this.val == 'string' ? this.val.length >= min && this.val.length <= this.maxLength : false;
    },
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
      danger: false,
      dangerText: "",
    };
  },
};
</script>

<style></style>
