<template>
  <select
    v-if="Array.isArray(schema.enum)"
    v-model="val"
    @input="validate"
    class="form-control m-3"
  >
    <option v-for="data in schema.enum" :key="data" :value="data">{{
      data
    }}</option>

    >
  </select>
  <FlatPickrWrapper
    :danger="danger"
    :danger-text="dangerText"
    v-else-if="['date-time', 'date', 'time'].includes(schema.format)"
    v-model="val"
    class="w-full p-4 m-auto"
    @input="validate"
  />
  <center v-else-if="schema.type.includes('boolean')">
    <input type="checkbox" class="mt-8" v-model="val" @input="validate" />
  </center>
  <div v-else-if="schema.type.includes('array')">
    <vSelect
      multiple
      :closeOnSelect="false"
      class="bg-white m-3"
      v-model="val"
      :options="options"
      :dir="$vs.rtl ? 'rtl' : 'ltr'"
    />
  </div>
  <div v-else class="flex">
    <vs-input
      :danger="danger"
      :danger-text="dangerText"
      class="py-2  pl-2 m-auto"
      :class="{ 'w-full': schema.type && !schema.type.includes('boolean') }"
      @input="validate"
      v-model="val"
      :type="type"
      :min="min"
      :max="max"
      :size="size"
    />

    <vs-button
      color="danger"
      type="flat"
      icon-pack="feather"
      class="mt-2"
      icon="icon-x"
      @click="
        val = null;
        validate(null);
      "
    ></vs-button>
  </div>
</template>

<script>
import FlatPickrWrapper from "@/components/FlatPickrWrapper";
import vSelect from "vue-select";
export default {
  components: {
    FlatPickrWrapper,
    vSelect,
  },
  props: {
    value: {
      required: true,
    },
    schema: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: () => null,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },

  watch: {
    val(val) {
      if (val instanceof Date) this.$emit("input", val.toISOString());
      else this.$emit("input", val);
    },
  },
  data() {
    return {
      type: "text",
      val: "",
      danger: false,
      min: null,
      max: null,
      format: null,
      dangerText: "",
      interval: setInterval(() => {
        if (this.format != this.schema.format) this.$forceUpdate();
        this.format = this.schema.format;
      }, 100),
    };
  },
  destroyed() {
    clearInterval(this.interval);
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
    }
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
};
</script>

<style lang="scss">
.form-control {
  border: 1px solid #d9d9d9;
  color: #5f5f5f;
  display: block;
  width: 90%;
  height: calc(1.25em + 1.4rem + 1px);
  padding: 0.7rem;
  font-size: 0.96rem;
  line-height: 1.25;
  color: #4e5154;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  -webkit-transition: border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
input[type="checkbox"] {
  /* Double-sized Checkboxes */
  -ms-transform: scale(2); /* IE */
  -moz-transform: scale(2); /* FF */
  -webkit-transform: scale(2); /* Safari and Chrome */
  -o-transform: scale(2); /* Opera */
  transform: scale(2);
  padding: 10px;
}
</style>
