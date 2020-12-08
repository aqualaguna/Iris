<template>
  <vue-context ref="menu" v-shortkey="['esc']" @shortkey.native="$refs.menu.close">
    <li>
      <a
        href="#"
        @click.prevent="addNewFolder"
        v-shortkey="['ctrl', 'alt', 'n']"
        @shortkey="addNewFolder"
        ><feather-icon icon="FolderIcon" class="mr-3" svgClasses="h-4 w-4" />Add
        New Folder<span class="float-right text-muted shortcut"
          >Ctrl + Alt + n</span
        ></a
      >
    </li>
    <li>
      <a href="#" @click.prevent="addCurrentToFavorite()"
        ><feather-icon
          icon="StarIcon"
          class="mr-3 text-warning"
          svgClasses="h-4 w-4"
        />Add Current Folder to Favorite</a
      >
    </li>
    <li v-if="$can('storage', 'delete')">
      <a href="#" @click.prevent="deleteSelected"
        ><feather-icon
          icon="TrashIcon"
          class="mr-3 text-danger"
          svgClasses="h-4 w-4"
        />Delete <span class="float-right text-muted shortcut">Del</span></a
      >
    </li>
    <vs-divider class="m-1" />
    <li>
      <a
        href="#"
        @click.prevent="cut"
        v-shortkey="['ctrl', 'x']"
        @shortkey="cut"
      >
        <feather-icon icon="ScissorsIcon" class="mr-3" svgClasses="h-4 w-4" />
        Cut
        <span class="float-right text-muted shortcut">Ctrl + X</span>
      </a>
    </li>

    <li>
      <a
        href="#"
        @click.prevent="copy"
        v-shortkey="['ctrl', 'c']"
        @shortkey="copy"
        ><feather-icon icon="CopyIcon" class="mr-3" svgClasses="h-4 w-4" />Copy
        <span class="float-right text-muted shortcut">Ctrl + C</span></a
      >
    </li>

    <li>
      <a
        href="#"
        @click.prevent="paste"
        v-shortkey="['ctrl', 'v']"
        @shortkey="paste"
      >
        <feather-icon
          icon="ClipboardIcon"
          class="mr-3"
          svgClasses="h-4 w-4"
        />Paste <span class="float-right text-muted shortcut">Ctrl + V</span></a
      >
    </li>
    <vs-divider class="m-1" />
    <li v-if="$can('storage', 'read')">
      <a
        href="#"
        @click.prevent="downloadSelected(false)"
        v-shortkey="['ctrl', 'shift', 'd']"
        @shortkey="downloadSelected(false)"
        ><feather-icon
          icon="DownloadIcon"
          class="mr-3"
          svgClasses="h-4 w-4"
        />Download Selected

        <span class="float-right text-muted shortcut">Ctrl + Shift + D</span></a
      >
    </li>
    <li v-if="$can('storage', 'read')">
      <a
        href="#"
        @click.prevent="downloadSelected(true)"
        v-shortkey="['ctrl', 'd']"
        @shortkey="downloadSelected(true)"
        ><feather-icon
          icon="DownloadIcon"
          class="mr-3"
          svgClasses="h-4 w-4"
        />Download Current Folder&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="float-right text-muted shortcut">Ctrl + D</span></a
      >
    </li>
  </vue-context>
</template>

<script>
import VueContext from "vue-context";
import "vue-context/dist/css/vue-context.css";
import JSZip from "jszip";
import FileSaver from "file-saver";
import pool from "@ricokahler/pool";
import getAllSelectedFiles from "@/helper/getAllSelectedFiles";
import EventBus from "@/event-bus";

export default {
  name: "StorageContextMenu",
  components: {
    VueContext,
  },
  computed: {
    files: {
      get() {
        return this.$store.state.storage.currentFolderData;
      },
      set(val) {
        this.$store.commit("storage/setCurrentFolderData", val);
      },
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    storage() {
      return this.app ? this.app.storage() : null;
    },
    currentFolderPath() {
      return this.$store.state.storage.currentFolderPath.slice(0);
    },
    clipboard: {
      get() {
        return this.$store.state.storage.clipboard;
      },
      set(val) {
        this.$store.commit("storage/setClipboard", val);
      },
    },
    clipboardMode: {
      get() {
        return this.$store.state.storage.clipboard_mode;
      },
      set(val) {
        this.$store.commit("storage/setClipboardMode", val);
      },
    },
    clipboardBaseDir: {
      get() {
        return this.$store.state.storage.clipboard_base_dir;
      },
      set(val) {
        this.$store.commit("storage/setClipboardBaseDir", val);
      },
    },
  },
  methods: {
    async cut() {
      this.clipboardMode = "cut";
      this.clipboardBaseDir = this.currentFolderPath;
      this.clipboard = await this.getAllSelectedFiles(this.files, {
        getDownloadUrl: true,
        downloadCurrentFolder: false,
      });
    },
    async copy() {
      this.clipboardMode = "copy";
      this.clipboardBaseDir = this.currentFolderPath;
      this.clipboard = await this.getAllSelectedFiles(this.files, {
        getDownloadUrl: true,
        downloadCurrentFolder: false,
      });
    },

    async paste() {
      // clear clipboard
      switch (this.clipboardMode) {
        case "cut":
          this.$emit("cut");
          break;
        case "copy":
          this.$emit("copy");
          break;
      }
    },
    addNewFolder() {
      EventBus.$emit("new-folder");
    },
    addCurrentToFavorite() {
      let path = this.currentFolderPath;
      let filename = path
        .slice(0)
        .split("/")
        .pop();
      this.$store.commit("storage/addFavoriteFolder", {
        name: filename,
        path: "/" + path,
      });
    },
    open(evt) {
      this.$refs.menu.open(evt);
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
    async downloadSelected(downloadCurrentFolder = false) {
      EventBus.$emit("file-manager-loading", {
        isProgress: true,
        progress: Infinity,
      });
      let zip = new JSZip();
      // get files list
      let listFiles = await this.getAllSelectedFiles(this.files, {
        getDownloadUrl: true,
        downloadCurrentFolder,
      });
      const CONCURRENT_LIMIT = 5;
      await pool({
        collection: listFiles,
        maxConcurrency: CONCURRENT_LIMIT, // only fetch two pages at a time
        task: async (file) => {
          let { data } = await this.$http.get(
            file.downloadUrl || file.meta.downloadUrl,
            {
              responseType: "blob",
              timeout: 30000,
            }
          );
          zip.file(file.fullPath.replace(this.currentFolderPath, ""), data, {
            createFolders: true,
          });
        },
      });
      zip.generateAsync({ type: "blob" }).then(function(content) {
        FileSaver.saveAs(content, "download.zip");
        EventBus.$emit("file-manager-loading", {
          isProgress: false,
          progress: 0,
        });
      });
    },
  },
};
</script>

<style>
.shortcut {
  color: #5e5e5e;
  font-size: 8pt;
}
</style>
