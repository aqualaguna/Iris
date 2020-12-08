<!-- =========================================================================================
    File Name: Email.vue
    Description: Email Application (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    id="email-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#email-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isSidebarActive"
    >
      <FileManagerSidebar @closeSidebar="toggleSidebar" />
    </vs-sidebar>

    <div
      :class="{ 'sidebar-spacer': clickNotClose }"
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
          @delete="deleteSelected"
          @add-file="$refs.uPopup.open()"
          @select-all="selectAllCheckBox = $event"
          :selectAllCheckBox="selectAllCheckBox"
        />
        <StorageProgress />

        <div
          class="flex not-selectable"
          style="background-color:white;height: calc(100% - 94px)"
        >
          <StorageBody
            :mode="mode"
            :filesFiltered="filesFiltered"
            @contextmenu="openContextMenu"
            @select-file="selectedFile = $event"
            @drop-file="handleDropFiles"
            @move="moveFiles"
          />
          <FileInfoSidebar :selectedFile="selectedFile" />
        </div>
      </div>
    </div>
    <UploadPopup
      ref="uPopup"
      :path="currentFolderPath"
      @finish="refreshCurrentFolder"
    />
    <StorageContextMenu ref="menu" @cut="cutFiles" @copy="copyFiles" />
  </div>
</template>

<script>
import FileManagerSidebar from "./FileManagerSidebar.vue";
import UploadPopup from "./UploadPopup";
import EventBus from "@/event-bus";
import handleFirestoreReject from "@/helper/handleFirestoreReject";
import getAllSelectedFiles from "@/helper/getAllSelectedFiles";
import StorageNavigation from "./StorageNavigation";
import StorageContextMenu from "./StorageContextMenu";
import StorageProgress from "./StorageProgress";
import StorageBody from "./StorageBody";
import FileInfoSidebar from "./FileInfoSidebar";
import pool from "@ricokahler/pool";

export default {
  name: "StoragePage",
  data() {
    return {
      // files: [
      // { selected: false, filename: "text.exe", size: "10 Mb" },
      // ],
      isSidebarActive: true,
      clickNotClose: true,
      searchQuery: "",
      selectedFile: null,
    };
  },
  watch: {
    windowWidth() {
      this.setSidebarWidth();
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
  methods: {
    cutFiles() {
       if (
        !(
          this.$can("storage", "read") &&
          this.$can("storage", "create") &&
          this.$can("storage", "delete")
        )
      ) {
        this.$vs.notify({
          title: "You do not have permission!",
          text:
            "Please ask your admin to allow you to read, create & delete file.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "bottom-center",
        });
        return;
      }
      let destination = this.currentFolderPath;
      let source = this.$store.state.storage.clipboard;
      let sourcedir = this.$store.state.storage.clipboard_base_dir;
      if (this.isFunctionAvailable) {
        this.moveFilesOperation(destination, source, sourcedir);
      } else {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm`,
          text:
            'Moving Operation is "Heavy Operation" because Firebase Storage SDK does not support this feature using API.\n IRIS will DOWNLOAD the selected file to client & RE-UPLOAD it to destination. Accept?',
          accept: this.moveFilesOperation.bind(
            this,
            destination,
            source,
            sourcedir
          ),
        });
      }
    },
    async copyFiles() {
      if (!(this.$can("storage", "read") && this.$can("storage", "create"))) {
        this.$vs.notify({
          title: "You do not have permission!",
          text: "Please ask your admin to allow you to read & create file.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "bottom-center",
        });
        return;
      }
      let destination = this.currentFolderPath;
      let source = this.$store.state.storage.clipboard;
      let sourcedir = this.$store.state.storage.clipboard_base_dir;
      if (this.isFunctionAvailable) {
        this.moveFilesOperation(destination, source, sourcedir, {
          copy: true,
        });
      } else {
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm`,
          text:
            'Copy Operation is "Heavy Operation" because Firebase Storage SDK does not support this feature using API.\n IRIS will DOWNLOAD the selected file to client & RE-UPLOAD it to destination. Accept?',
          accept: this.moveFilesOperation.bind(
            this,
            destination,
            source,
            sourcedir,
            {
              copy: true,
            }
          ),
        });
      }
    },
    async moveFiles(data) {
      if (
        !(
          this.$can("storage", "read") &&
          this.$can("storage", "create") &&
          this.$can("storage", "delete")
        )
      ) {
        this.$vs.notify({
          title: "You do not have permission!",
          text:
            "Please ask your admin to allow you to read, create & delete file.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "bottom-center",
        });
        return;
      }

      let { destination, source, sourcedir } = data;
      if (this.isFunctionAvailable) {
        this.moveFilesOperation(destination, source, sourcedir);
      } else
        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm`,
          text:
            'Moving Operation is "Heavy Operation" because Firebase Storage SDK does not support this feature using API.\n IRIS will DOWNLOAD the selected file to client & RE-UPLOAD it to destination. Accept?',
          accept: this.moveFilesOperation.bind(
            this,
            destination,
            source,
            sourcedir
          ),
        });
    },
    async moveFilesOperation(
      destination,
      source,
      sourcedir,
      opt = {
        copy: false,
      }
    ) {
      if (this.isFunctionAvailable) {
        // start loading
        EventBus.$emit("file-manager-loading", {
          isProgress: true,
          progress: Infinity,
        });
        var copyFiles = this.app.functions().httpsCallable("copyFiles");
        await copyFiles({
          mode: opt.copy ? "copy" : "move",
          destination,
          files: source.map((t) => t.fullPath),
          source: sourcedir,
        })
          .then((result) => {
            this.$vs.notify({
              position: "bottom-center",
              color: "success",
              title: "Success moving files",
              text: result.message,
            });
          })
          .catch((e) => {
            this.$vs.notify({
              position: "bottom-center",
              color: "danger",
              title: e.code,
              text: e.message,
            });
          });
      } else {
        let step = 100 / source.length;
        EventBus.$emit("file-manager-loading", {
          isProgress: true,
          progress: 0,
        });
        const CONCURRENT_LIMIT = 5;
        // first download all data
        await pool({
          collection: source,
          maxConcurrency: CONCURRENT_LIMIT, // only fetch two pages at a time
          task: async (file) => {
            let { data } = await this.$http.get(
              file.downloadUrl || file.meta.downloadUrl,
              {
                responseType: "blob",
                timeout: 30000,
              }
            );
            // reupload it
            await this.storage
              .ref(destination + "/" + file.fullPath.replace(sourcedir, ""))
              .put(data)
              .then(async () => {
                // delete previous file
                if (opt.copy) EventBus.$emit("file-manager-loading-inc", step);
                else
                  await this.storage
                    .ref(file.fullPath)
                    .delete()
                    .then(() => {
                      EventBus.$emit("file-manager-loading-inc", step);
                    });
              });
          },
        })
          .then(() => {
            this.$vs.notify({
              position: "bottom-center",
              color: "success",
              title: "Success Moved Files & Folder!",
            });
          })
          .catch(handleFirestoreReject);
      }
      // reset loading
      EventBus.$emit("file-manager-loading", {
        isProgress: false,
        progress: 0,
      });
      this.refreshCurrentFolder();
    },
    async handleDropFiles(files) {
      if (!this.$can("storage", "create")) {
        this.$vs.notify({
          title: "You do not have permission!",
          text: "Please ask your admin to allow you to create file.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "bottom-center",
        });
        return;
      }
      let step = 100 / files.length;
      EventBus.$emit("file-manager-loading", {
        isProgress: true,
        progress: 0,
      });
      let task = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let path = this.currentFolderPath + "/" + file.name;
        task.push(
          this.storage
            .ref(path)
            .put(file)
            .then(() => {
              EventBus.$emit("file-manager-loading-inc", step);
            })
        );
      }
      await Promise.all(task)
        .then(() => {
          this.$vs.notify({
            title: "Files Uploaded!",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
            position: "bottom-center",
          });
        })
        .catch(handleFirestoreReject.bind(this));
      EventBus.$emit("file-manager-loading", {
        isProgress: false,
        progress: 0,
      });
      this.refreshCurrentFolder();
    },
    openContextMenu(evt) {
      if (this.$refs.menu) this.$refs.menu.open(evt);
    },
    deleteSelected() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "You are about to Delete Selected Files & Folder. Accept?",
        accept: this.deleteFiles,
      });
    },
    async deleteFiles() {
      // recursive dive if folder...
      let listFiles = await this.getAllSelectedFiles(this.files);
      let step = 100 / listFiles.length;

      EventBus.$emit("file-manager-loading", {
        isProgress: true,
        progress: 0,
      });
      let task = [];
      for (const file of listFiles) {
        task.push(
          this.storage
            .ref(file.fullPath)
            .delete()
            .then(() => {
              EventBus.$emit("file-manager-loading-inc", step);
            })
        );
      }
      await Promise.all(task)
        .then(() => {
          this.$vs.notify({
            title: "Files & Folder Deleted!",
            color: "success",
            iconPack: "feather",
            icon: "icon-check",
            position: "bottom-center",
          });
        })
        .catch(handleFirestoreReject.bind(this));
      // wheter is fail or success
      EventBus.$emit("file-manager-loading", {
        isProgress: false,
        progress: 0,
      });
      // refresh current path
      this.refreshCurrentFolder();
    },
    refreshCurrentFolder() {
      // refresh current path
      EventBus.$emit("folder-dive", {
        fullPath: this.currentFolderPath,
      });
    },
    async getAllSelectedFiles(
      tempfiles,
      opt = {
        getDownloadUrl: false,
        downloadCurrentFolder: false,
      }
    ) {
      return getAllSelectedFiles(this.storage, tempfiles, opt);
    },
    toggleSidebar(value = false) {
      if (!value) {
        this.isSidebarActive = false;
        if (this.clickNotClose) {
          return;
        }
      }
      this.isSidebarActive = value;
    },
    setSidebarWidth() {
      if (this.windowWidth < 992) {
        this.isSidebarActive = this.clickNotClose = false;
      } else {
        this.isSidebarActive = this.clickNotClose = true;
      }
    },
    async importSc() {
      // eslint-disable-next-line no-unused-vars
      let IRIS = {
        message: "test",
        app: this.app,
      };
      let temp = `async function init(iris) {
  console.log('init executed', this, window, document);
  console.log(iris.message);
}`;
      eval(`((${temp})(IRIS))`);
    },
  },
  components: {
    FileManagerSidebar,
    UploadPopup,
    StorageNavigation,
    StorageContextMenu,
    StorageProgress,
    FileInfoSidebar,
    StorageBody,
  },
  beforeDestroy() {
    this.$store.commit("storage/setCurrentFolderData", []);
  },
  created() {
    this.setSidebarWidth();
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/apps/email.scss";
</style>
