<template>
  <div
    class="flex-initial email__actions flex items-center flex-wrap justify-between p-2 border border-r-0 border-l-0 border-solid d-theme-border-grey-light"
  >
    <div class="flex flex-grow items-center">
      <feather-icon
        icon="ArrowLeftIcon"
        class="mr-5 cursor-pointer"
        svg-classes="h-6 w-6"
        v-shortkey="['backspace']"
        @shortkey="back"
        @click="back"
      />
      <VxBreadCrumb
        :items="breadCrumbItem"
        @url-click="goto"
        @submit="goto"
        v-shortkey="['ctrl', 'l']"
        ref="file-navigator"
        @shortkey.native="$refs['file-navigator'].changeMode('input')"
      >
      </VxBreadCrumb>
    </div>
    <div class="flex items-center ml-3">
      <vs-checkbox
        :value="selectAllCheckBox"
        @input="$emit('select-all', $event)"
        icon-pack="feather"
        :icon="selectAllIcon"
        v-shortkey="['ctrl', 'a']"
        @shortkey.native="$emit('select-all', true)"
        class="select-all-chexkbox ml-0"
        >Select All</vs-checkbox
      >
    </div>

    <div class="flex">
      <vx-tooltip text="Upload Files" v-if="$can('storage', 'create')">
        <feather-icon
          icon="FilePlusIcon"
          class="ml-5 mt-3 cursor-pointer"
          svg-classes="h-6 w-6"
          @click="$emit('add-file')"
        />
      </vx-tooltip>
      <vx-tooltip text="Delete Files Or Folders" v-if="$can('storage', 'delete')">
        <feather-icon
          icon="TrashIcon"
          v-shortkey="['del']"
          @shortkey="$emit('delete')"
          class="ml-5 mr-3 mt-3 cursor-pointer"
          svg-classes="h-6 w-6"
          @click="$emit('delete')"
        />
      </vx-tooltip>
      <div class="flex grouped-button mx-1">
        <feather-icon
          :icon="mode == 'grid' ? 'GridIcon' : 'ListIcon'"
          class="cursor-pointer p-1"
          svg-classes="h-6 w-6"
          @click="mode == 'grid' ? (mode = 'list') : (mode = 'grid')"
          :title="mode == 'grid' ? 'List View' : 'Grid View'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VxBreadCrumb from "@/components/VxBreadCrumb";
import EventBus from "@/event-bus";

export default {
  name: "StorageNavigation",
  props: ["selectAllCheckBox"],
  components: {
    VxBreadCrumb,
  },
  computed: {
    selectAllIcon() {
      return this.selectAllCheckBox ? "icon-check" : "icon-minus";
    },
    currentFolderPath() {
      var string_copy = (
        " " + this.$store.state.storage.currentFolderPath
      ).slice(1);

      return string_copy;
    },
    breadCrumbItem() {
      let paths =
        this.currentFolderPath == ""
          ? []
          : this.currentFolderPath.replace(/^\/+|\/+$/g, "").split("/");
      let acc = "/";
      let res = [
        {
          title: "Root",
          url: "/",
        },
      ];
      for (const path of paths) {
        acc += path + "/";
        res.push({
          title: path,
          url: acc,
        });
      }
      res[res.length - 1].active = true;
      return res;
    },
    mode: {
      get() {
        return this.$store.state.storage.view_mode;
      },
      set(val) {
        this.$store.commit("storage/setViewMode", val);
      },
    },
  },
  methods: {
    back() {
      let temp = this.currentFolderPath.split("/");
      temp.pop();
      this.goto(temp.join("/") || "/");
    },
    goto(url) {
      EventBus.$emit("folder-dive", {
        fullPath: url,
      });
    },
  },
};
</script>

<style lang="scss">
.grouped-button {
  border: 1px solid #dae1e7;
  background: white;
  border-radius: 10px;
  padding: 5px;
}
</style>
