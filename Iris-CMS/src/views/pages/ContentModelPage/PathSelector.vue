<template>
  <div>
    <vs-input
      class="w-full p-3"
      icon-pack="feather"
      icon="icon-folder"
      icon-after
      vs-icon-after="true"
      @click.native="handle"
      :disabled="true"
      v-model="path"
      style="background-color:white;"
    />
    <FolderSelectorPopup ref="fsPopup" @input="path = $event; $emit('set-path', $event);" />
  </div>
</template>

<script>
import FolderSelectorPopup from "./FolderSelectorPopup";

export default {
  name: "PathSelector",
  components: {
    FolderSelectorPopup,
  },
  data() {
    return {
      path: '',
    }
  },
  methods: {
    handle(){
      this.$refs.fsPopup.open();
    }
  }
};
</script>

<style></style>
