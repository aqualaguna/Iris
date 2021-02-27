<template>
  <vs-popup title="File Picker" :active.sync="popupActive" fullscreen>
    <div
      class="no-scroll-content border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0"
    >
      <div class="flex flex-col h-full">
        <!-- SEARCH BAR -->
        <div class="flex border d-theme-dark-bg items-center flex-initial">
          <feather-icon
            class="md:inline-flex lg:hidden ml-4 mr-4 cursor-pointer"
            icon="MenuIcon"
            @click.stop="toggleSidebar(true)"
          />
          <vs-input
            icon-no-border
            icon="icon-search"
            size="large"
            icon-pack="feather"
            placeholder="Search Files & Folder"
            v-model="searchQuery"
            class="vs-input-no-border vs-input-no-shdow-focus w-full"
            v-shortkey.native.avoid
          />
        </div>

        <!-- EMAIL ACTION BAR -->
        <StorageNavigation
          local
          @mode="mode = $event"
          @add-file="$refs.uPopup.open()"
          @select-all="selectAllCheckBox = $event"
          :selectAllCheckBox="selectAllCheckBox"
          @folder-dive="folderDive($event.fullPath)"
        />
        <StorageProgress />

        <div class="flex flex-1 not-selectable">
          <StorageBody
            :mode="mode"
            local
            :filesFiltered="filesFiltered"
            @select-file="selectedFile = $event"
            @folder-dive="folderDive($event.fullPath)"
          />
        </div>
      </div>
    </div>
    <vs-button class="float-right" @click="select">
      Select
    </vs-button>
    <UploadPopup ref="uPopup" :path="currentFolderPath" />
  </vs-popup>
</template>

<script>
import UploadPopup from "../../StoragePage/UploadPopup";
import StorageBody from "../../StoragePage/StorageBody";
import StorageProgress from "../../StoragePage/StorageProgress";
import StorageNavigation from "../../StoragePage/StorageNavigation";
import getAllSelectedFiles from "@/helper/getAllSelectedFiles";

export default {
  name: "FilePickerPopup",
  components: {
    UploadPopup,
    StorageBody,
    StorageProgress,
    StorageNavigation,
  },
  data() {
    return {
      popupActive: false,
      searchQuery: "",
      selectedFile: null,
      type: "",
      opt: null,
    };
  },
  watch: {
    popupActive(newval) {
      if (!newval) {
        this.reset();
      } else {
        setTimeout(() => {
          this.focus();
        }, 1000);
      }
    },
  },

  computed: {
    mode: {
      get() {
        return this.$store.state.storage.view_mode;
      },
      set(val) {
        this.$store.commit("storage/setViewMode", val);
      },
    },
    filesFiltered() {
      let result;
      try {
        new RegExp(this.searchQuery);
        result = this.files.filter((t) => t.filename.match(this.searchQuery));
      } catch (e) {
        result = this.files;
      }
      // filter by type
      result = result.filter((t) =>
        t.type == "file"
          ? /^image/.test(t.meta.contentType) ||
            /^video/.test(t.meta.contentType)
          : true
      );
      return result;
    },
    files: {
      get() {
        return this.$store.state.storage.currentFolderData;
      },
      set(val) {
        this.$store.commit("storage/setCurrentFolderData", val);
      },
    },
    currentFolderPath() {
      var string_copy = (
        " " + this.$store.state.storage.currentFolderPath
      ).slice(1);

      return string_copy;
    },
    selectAllCheckBox: {
      get() {
        return !this.files.some((t) => !t.selected);
      },
      set(value) {
        this.files = JSON.parse(JSON.stringify(this.files)).map((t) => {
          t.selected = value;
          return t;
        });
      },
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    storage() {
      return this.app ? this.app.storage() : null;
    },
    isFunctionAvailable() {
      return this.$store.state.isFunctionAvailable;
    },
  },
  mounted() {
    this.folderDive("/");
  },
  methods: {
    async select() {
      let files = await getAllSelectedFiles(this.storage, this.files, {
        getDownloadUrl: true,
        downloadCurrentFolder: false,
      });
      const quill = this.opt.quill;
      const range = quill.getSelection();

      console.log(range);
      for (const file of files) {
        if (/^image/.test(file.meta.contentType)) {
          quill.editor.insertEmbed(range.index, "image", file.meta.downloadUrl);
        } else if (/^video/.test(file.meta.contentType)) {
          quill.editor.insertEmbed(range.index, "video", file.meta.downloadUrl);
        }
      }
      this.close();
    },
    async folderDive(paths) {
      await this.storage
        .ref(paths)
        .listAll()
        .then(async (t) => {
          let folders = t.prefixes.map((folder) => {
            return {
              title: folder.name,
              ref: folder.fullPath,
              icon: "FolderIcon",
              expanded: false,
              async: true,
              selected: false,
            };
          });
          let folders_mod = folders.map((f) => {
            return {
              selected: f.selected,
              filename: f.title,
              size: null,
              fullPath: f.ref,
              type: "folder",
            };
          });
          let files = await Promise.all(
            t.items.map(async (t) => {
              let meta = await t.getMetadata();
              let DURL = await t.getDownloadURL();
              return {
                fullPath: t.fullPath,
                filename: t.name,
                selected: false,
                size: meta.size,
                type: "file",
                meta: {
                  size: meta.size,
                  contentType: meta.contentType,
                  createdAt: meta.timeCreated,
                  updatedAt: meta.updated,
                  downloadUrl: DURL,
                },
              };
            })
          );
          // set current folder
          this.$store.commit(
            "storage/setCurrentFolderData",
            JSON.parse(JSON.stringify(folders_mod.concat(files)))
          );
          this.$store.commit("storage/setCurrentFolderPath", paths);

          return folders;
        });
    },
    focus() {},
    open(opt) {
      this.popupActive = true;
      this.opt = opt;
    },
    close() {
      this.popupActive = false;
      setTimeout(() => {
        this.$emit("close");
      }, 500);
    },
    toggle() {
      this.popupActive = !this.popupActive;
    },
    reset() {},
  },
};
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/apps/email.scss";
</style>
