<template>
  <div
    class="file-item-grid flex flex-col m-2"
    :class="{ selected: selected }"
    @click.exact.stop="$emit('click')"
    @click.ctrl.exact.stop="$emit('click-ctrl')"
    @click.shift.exact.stop="$emit('click-shift')"
    @mousedown.stop=""
    draggable
    @dragstart="startDrag"
    @drop.prevent.stop="handleDrop"
  >
    <div class="m-6">
      <FileIcon :name="extension" :selected="selected" />
    </div>
    <div class="my-1 flex-initial" style="height: 38px;">
      <h5 class="mb-2 text-center" :class="{ truncate: !selected }">
        {{ filename }}
        <p v-if="!folder" class="text-grey text-center">{{ size }}</p>
      </h5>
    </div>
  </div>
</template>

<script>
import FileIcon from "./FileIcon";
import getAllSelectedFiles from "@/helper/getAllSelectedFiles";
export default {
  components: {
    FileIcon,
  },
  computed: {
    extension() {
      if (this.folder) return "folder";
      let temp = this.filename.split(".");
      return temp[temp.length - 1];
    },
    filename() {
      return this.file.filename;
    },
    size() {
      return this.$options.filters.prettyBytes(this.file.size) || "0 Kb";
    },
    folder() {
      return this.file.type == "folder";
    },
    selected() {
      return this.file.selected;
    },
  },
  props: {
    file: {
      required: true,
    },
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
.file-item-grid {
  width: 100px;
  height: 150px;
  margin: 5px;
  -webkit-box-shadow: -1px 8px 11px 6px rgba(242, 246, 251, 0.26);
  box-shadow: -1px 8px 11px 6px rgba(242, 246, 251, 0.26);
  padding: 5px;
  div img {
  }
}
.file-item-grid.selected {
  box-shadow: none;
  div h5 {
    color: #741b75;
    overflow-wrap: break-word;
    overflow: visible;
  }
}
</style>
