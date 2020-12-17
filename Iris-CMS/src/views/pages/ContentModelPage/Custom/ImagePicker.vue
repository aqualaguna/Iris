<template>
  <vs-popup title="Error List" :active.sync="popupActive">
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
          @mode="mode = $event"
          @add-file="$refs.uPopup.open()"
          @select-all="selectAllCheckBox = $event"
          :selectAllCheckBox="selectAllCheckBox"
        />
        <StorageProgress />

        <div class="flex flex-1 not-selectable">
          <StorageBody
            :mode="mode"
            :filesFiltered="filesFiltered"
            @contextmenu="openContextMenu"
            @select-file="selectedFile = $event"
          />
        </div>
      </div>
    </div>
    <UploadPopup ref="uPopup" :path="currentFolderPath" />
  </vs-popup>
</template>

<script>
import UploadPopup from "../../StoragePage/UploadPopup";
import StorageBody from "../../StoragePage/StorageBody";
import StorageProgress from "../../StoragePage/StorageProgress";
import StorageNavigation from "../../StoragePage/StorageNavigation";

export default {
  name: "ImagePickerPopup",
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
      try {
        new RegExp(this.searchQuery);
        return this.files.filter((t) => t.filename.match(this.searchQuery));
      } catch (e) {
        return this.files;
      }
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
    this.folderDive('/');
  },
  methods: {
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

          return folders;
        });
    },
    openContextMenu(evt) {
      if (this.$refs.menu) this.$refs.menu.open(evt);
    },
    focus() {},
    open() {
      this.popupActive = true;
    },
    close() {
      this.popupActive = false;
    },
    toggle() {
      this.popupActive = !this.popupActive;
    },
    reset() {},
  },
};
</script>
