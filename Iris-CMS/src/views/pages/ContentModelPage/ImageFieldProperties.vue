<template>
  <div class="flex w-full">
    <div style="" class="p-2 left-prop left-prop-last">
      <p>
        <b>Folder Path</b>
      </p>
      <span class="text-sm">Path where you save the image.</span>
    </div>
    <div class="flex-1 right-prop">
      <PathSelector @set-path="$emit('setPath', $event)" />
    </div>
  </div>
</template>

<script>
import PathSelector from "./PathSelector";

export default {
  name: "ImageFieldProperties",
  components: {
    PathSelector,
  },

  mounted() {
    this.$emit("setPath", "");
  },
};
</script>

<style></style>
