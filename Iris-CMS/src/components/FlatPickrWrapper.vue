<template>
  <div>
    <div v-if="label" class="text-xs text-muted">{{ label }}</div>
    <div class="flex">
      <flat-pickr
        v-model="clone_value"
        class="w-full"
        @input="onInput"
        :config="config"
        @on-change="$emit('on-change', $event)"
      />
      <feather-icon
        tabindex="-1"
        @click="onInput(null)"
        icon="TrashIcon"
        svgClasses="h-4 w-4 text-danger"
        class="ml-1"
      />
    </div>
    <span class="text-danger text-sm" v-show="danger">{{ dangerText }}</span>
  </div>
</template>
<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

export default {
  name: "FlatPickrWrapper",
  components: {
    flatPickr,
  },
  props: {
    value: {
      required: true,
      default: "",
    },
    label: {
      default: "",
      type: String,
    },
    danger: Boolean,
    dangerText: String,
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      clone_value: new Date(this.value),
    };
  },
  watch: {
    // value(val) {
    //   this.clone_value = val instanceof Date ? val.toString() : val;
    // }
  },
  methods: {
    setValue(value) {
      this.clone_value = new Date(value);
      // this.onInput(value);
    },
    onInput(value) {
      if (value == null) {
          this.$emit("input", null);
          this.clone_value = null;
      }
      else {
          if(!isNaN(Date.parse(value)))
            this.$emit("input", new Date(value));
      }
    },
  },
};
</script>
