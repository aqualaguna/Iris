<template>
  <vs-list-item
    :class="{ selected: selected }"
    :title="file.filename"
    @click.native.exact.stop="$emit('click')"
    @click.native.ctrl.exact.stop="$emit('click-ctrl')"
    @click.native.shift.exact.stop="$emit('click-shift')"
    :style="{ 'background-color': selected ? '#dedede' : 'white' }"
    draggable.native
    @dragstart.native="startDrag"
    @drop.native.prevent.stop="handleDrop"
  >
    <template slot="avatar">
      <FileIcon class="list-icon m-2" :name="extension" :selected="false" />
    </template>
    <p class="text-grey text-center">
      {{ file.size | prettyBytes }}
    </p>
  </vs-list-item>
</template>

<script>
import FileIcon from "./FileIcon";
import getAllSelectedFiles from "@/helper/getAllSelectedFiles";

export default {
  name: "ItemList",
  components: {
    FileIcon,
  },
  computed: {
    extension() {
      if (this.folder) return "folder";
      let temp = this.file.filename.split(".");
      return temp[temp.length - 1];
    },
    folder() {
      return this.file.type == "folder";
    },
    selected() {
      return this.file.selected;
    },
  },
  props: {
    file: Object,
  },

  methods: {
    async handleDrop(evt) {
      let items = JSON.parse(evt.dataTransfer.getData("files_path"));
      // let check if this item is a folder
      if (this.folder) {
        // okay move it
        this.$emit("move", {
          destination: this.file.fullPath,
          sourcedir: this.$store.state.storage.currentFolderPath.slice(0),
          source: items,
        });
      }
    },
    async startDrag(evt) {
      this.$emit("stop-drop-mode");
      if (!this.file.selected) this.$emit("click");
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      // get current selected path
      let files = this.$store.state.storage.currentFolderData;
      let config = this.$store.state.selectedApp;
      let app = (config ? this.$app(config.projectId) : null) || null;
      let storage = app.storage();

      let selected = (
        await getAllSelectedFiles(storage, files, {
          getDownloadUrl: true,
          downloadCurrentFolder: false,
        })
      );
      if (!this.folder && !selected.some(t => t.fullPath == this.file.fullPath)) {
        selected.push(this.file);
      }
      evt.dataTransfer.setData("files_path", JSON.stringify(selected));
    },
  },
};
</script>

<style lang="scss">
.list-icon {
  width: 32px;
  height: 32px;
}
.selected {
  box-shadow: none;
}
.list-titles {
  word-break: break-all;
  overflow-wrap: break-word;
  overflow: visible;
}
.selected .list-titles {
  color: #741b75;
}
</style>
