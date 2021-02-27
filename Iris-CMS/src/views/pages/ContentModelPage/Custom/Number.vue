<template>
  <div>
    <h4>{{ label }}</h4>
    
    <span class="text-danger text-sm" v-show="danger">{{ dangerText }}</span>
  </div>
</template>

<script>

export default {
  name: "Number",
  computed: {},
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
  watch: {
    val(val) {
      this.$emit("input", val.value);
      this.validate(val);
    },
  },
  data() {
    return {
      val: "",
      danger: false,
      dangerText: "",
    };
  },
  methods: {
    validate(val) {
      if (this.schema.type && this.schema.type.includes("null") && val == "") {
        this.val = null;
        this.validate(null);
        return;
      }
      // clonee schema
      let clone = JSON.parse(JSON.stringify(this.schema));
      clone.enum = clone.enum.map((t) => t.value);
      if (val.value == null) delete clone.enum;
      let validateFunc = this.$ajv.compile(clone);
      if (val instanceof Date) {
        val = val.toISOString();
      }
      var valid = validateFunc(val.value);
      if (!valid) {
        this.danger = true;
        this.dangerText = validateFunc.errors[0].message;
      } else {
        this.danger = false;
      }
    },
  },
  mounted() {
    this.val = this.schema.enum.find((t) => t.value == this.value) ||
      this.schema.enum.find((t) => t.value == this.schema.default) || {
        key: null,
        value: null,
      };
    this.validate(this.val);
  },
};
</script>

<style></style>
