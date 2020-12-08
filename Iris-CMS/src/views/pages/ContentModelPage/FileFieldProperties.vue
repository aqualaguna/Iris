<template>
  <div class="flex flex-col">
    <div class="flex w-full">
      <div style="" class="p-2 left-prop">
        <p>
          <b>Folder Path</b>
        </p>
        <span class="text-sm">Path where you save the file.</span>
      </div>
      <div class="flex-1 right-prop">
        <PathSelector @set-path="$emit('setPath', $event)" />
      </div>
    </div>
    <div class="flex w-full">
      <div style="" class="p-2 left-prop left-prop-last">
        <p>
          <b>File Type</b>
        </p>
        <span class="text-sm">Filter type of file to upload.</span>
      </div>
      <div class="flex-1 right-prop">
        <v-select
          multiple
          :closeOnSelect="false"
          v-model="selected"
          @input="$emit('setValidType', $event)"
          :options="options"
          class="m-2"
          :dir="$vs.rtl ? 'rtl' : 'ltr'"
        /><br />
      </div>
    </div>
  </div>
</template>

<script>
import PathSelector from "./PathSelector";
import vSelect from "vue-select";

export default {
  name: "FileFieldProperties",
  components: {
    PathSelector,
    vSelect,
  },

  mounted() {
    this.$emit('setValidType', []);
    this.$emit('setPath', '');
  },
  data() {
    return {
      selected: [],
      options: [
        "ppt",
        "pptx",
        "pdf",
        "doc",
        "docx",
        "xlsx",
        "xls",
        "jpg",
        "jpeg",
        "gif",
        "png",
        "svg",
        "bmp",
        "all",
      ],
    };
  },
};
</script>

<style>
.left-prop {
  width: 370px;
  border: 1px solid #e0e0e0;
  border-bottom: none;
}
.left-prop-last {
  border-bottom: 1px solid #e0e0e0;
}
.right-prop {
  width: 370px;
  border: 1px solid #e0e0e0;
  background-color: #f7f7f7;
  border-left: none;
}
.v-select {
  background-color: white;
}
</style>
