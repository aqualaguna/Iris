<!-- =========================================================================================
    File Name: EmailSidebar.vue
    Description: Email Application Sidebar(Filter) (Inbox)
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="email__email-sidebar h-full">
    <vs-prompt @accept="createFolder" :active.sync="createFolderPrompt">
      <div class="con-exemple-prompt">
        <span>Enter Folder Name</span>
        <vs-input
          placeholder="Folder name"
          vs-placeholder="Folder name"
          v-model="folder_name"
          class="mt-3 w-full"
        />
      </div>
    </vs-prompt>
    <component
      :is="scrollbarTag"
      class="email-filter-scroll-area"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="flex flex-col h-full">
        <div class="flex flex-col flex-1">
          <vs-divider></vs-divider>
          <div class="flex justify-between px-5">
            <b>Folder</b>
            <div class="flex">
              <feather-icon
                title="Add Folder"
                icon="FolderPlusIcon"
                class="mr-1"
                svgClasses="h-6 w-6"
                @click="createFolderPrompt = true"
              />
              <feather-icon
                title="Delete Folder"
                icon="FolderMinusIcon"
                class="mr-1"
                svgClasses="h-6 w-6"
              />
            </div>
          </div>
          <vs-divider></vs-divider>
          <component
            :is="scrollbarTag"
            class="flex flex-col flex-1"
            :settings="settings"
            :key="$vs.rtl"
          >
            <v-tree
              style="width:500px"
              ref="tree"
              class="not-selectable"
              scoped
              :data="treeData"
              :multiple="false"
              :selectAlone="true"
              @node-click="handleClick($event)"
              @async-load-nodes="asyncLoad"
              :tpl="tpl"
            />
          </component>
        </div>

        <div class="flex flex-col flex-1">
          <!-- <vs-divider></vs-divider>
          <div class="flex justify-between px-5">
            <b>Recent Folder</b>
          </div>
          <vs-divider></vs-divider> -->
          <vs-list>
            <vs-list-header
              v-if="favoriteFolder.length > 0"
              title="Favorite"
              color="primary"
            ></vs-list-header>

            <div
              class="vs-list--item"
              v-for="f in favoriteFolder"
              :key="'favorite:/' + f.path"
              @click="
                folderDiveHandler({
                  fullPath: f.path,
                })
              "
            >
              <!---->
              <div class="vs-list--icon">
                <i
                  class="vs-icon notranslate icon-scale feather icon-folder null"
                ></i>
              </div>
              <div class="list-titles">
                <div class="vs-list--title">{{ f.name }}</div>
              </div>
              <div class="vs-list--slot"></div>
            </div>

            <vs-list-header
              v-if="recentFolder.length > 0"
              title="Recent"
              color="primary"
            ></vs-list-header>
            <div
              class="vs-list--item"
              v-for="f in recentFolder"
              :key="'recent:/' + f.path"
              @click="
                folderDiveHandler({
                  fullPath: f.path,
                })
              "
            >
              <!---->
              <div class="vs-list--icon">
                <i
                  class="vs-icon notranslate icon-scale feather icon-folder null"
                ></i>
              </div>
              <div class="list-titles">
                <div class="vs-list--title">{{ f.name }}</div>
              </div>
              <div class="vs-list--slot"></div>
            </div>

            <vs-list-header
              v-if="frequentFolder.length > 0"
              title="Frequent"
              color="primary"
            ></vs-list-header>

            <vs-list-item
              icon-pack="feather"
              icon="icon-folder"
              v-for="f in frequentFolder"
              :key="'freq:/' + f.path"
              :title="f.name + ` (${f.count_call})`"
            ></vs-list-item>
          </vs-list>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { VTree, VSelectTree } from "vue-tree-halower";
import "vue-tree-halower/dist/halower-tree.min.css"; // you can customize the style of the tree
import EventBus from "@/event-bus";

export default {
  name: "FileManagerSidebar",
  data() {
    return {
      folder_name: "",
      createFolderPrompt: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
      options: [
        {
          name: "test",
        },
      ],
      treeData: [
        {
          icon: "FolderIcon",
          title: `Root`,
          ref: "",
          expanded: true,
          async: true,
        },
      ],
    };
  },
  methods: {
    async getNodeFromCurrentPath() {
      let fullpath = this.currentFolderPath.slice(0);
      let path = fullpath.replace(/^\/+|\/+$/g, "");
      if (path == "") {
        // load root then return
        let node = this.treeData[0];
        return node;
      }
      let paths = path.split("/");
      // let dive into tree
      let node = this.treeData[0];
      if (node.children.length == 0)
        await this.asyncLoad(node, { no_set: true });
      for (const path of paths) {
        let item = (node.children || []).find((t) => t.title == path);

        if (item) {
          node.expanded = true;
          node = item;
        } else {
          await this.asyncLoad(node, { no_set: true });
          item = (node.children || []).find((t) => t.title == path);
          if (item) {
            node.expanded = true;
            node = item;
          } else {
            node = null;
            break;
          }
        }
      }
      return node;
    },
    async createFolder() {
      if (this.folder_name == "" || /\//.test(this.folder_name)) {
        this.$vs.notify({
          title: "Folder Name must be not empty or contain '/'!",
          text: "Please Fix your folder name.",
          color: "danger",
          iconPack: "feather",
          icon: "icon-alert-circle",
          position: "bottom-center",
        });
      } else {
        let node = await this.getNodeFromCurrentPath();
        let childnode = {
          icon: "FolderIcon",
          title: `${this.folder_name}`,
          ref: this.currentFolderPath + `/${this.folder_name}`,
          expanded: false,
          async: true,
        };
        this.$refs.tree.addNode(node, childnode);
        // add folder to current folderdata
        this.$store.commit("storage/addNewItemToFolderData", {
          selected: false,
          filename: childnode.title,
          size: null,
          fullPath: childnode.ref,
          type: "folder",
        });
      }
    },
    tpl(...args) {
      // eslint-disable-next-line no-unused-vars
      let { 0: node, 2: parent, 3: index } = args;
      let res = this.currentFolderPath;
      let titleClass =
        node.ref == res ? "node-title node-selected" : "node-title";
      if (node.searched) titleClass += " node-searched";
      return (
        <span>
          <feather-icon
            icon="FolderIcon"
            class="mr-1"
            style="top:3px"
            svgClasses="h-5 w-5"
          />
          <span
            class={titleClass}
            domPropsInnerHTML={node.title}
            onClick={() => {
              this.currentFolderPath = node.ref;
              this.$refs.tree.nodeSelected(node);
            }}
          ></span>
        </span>
      );
    },
    async handleClick(node) {
      await this.asyncLoad(node);

      this.$set(node, "expanded", true);
      node.expanded = true;
      this.currentFolderPath = node.ref;
    },
    async asyncLoad(
      node,
      opt = {
        no_set: false,
      }
    ) {
      const { checked = false } = node;
      this.$set(node, "loading", true);
      let pro = await this.storage
        .ref(node.ref)
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
          if (!opt.no_set)
            this.$store.commit(
              "storage/setCurrentFolderData",
              JSON.parse(JSON.stringify(folders_mod.concat(files)))
            );

          return folders;
        });
      this.$set(node, "children", pro);
      this.$set(node, "loading", false);
      if (checked) {
        this.$refs.tree.childCheckedHandle(node, checked);
      }
    },
    async folderDiveHandler(file) {
      EventBus.$emit("file-manager-loading", "on");
      let path = file.fullPath.replace(/^\/+|\/+$/g, "");
      if (path == "") {
        // load root then return
        let node = this.treeData[0];
        await this.asyncLoad(node);
        this.$set(node, "expanded", true);
        this.currentFolderPath = node.ref;
        return;
      }
      let paths = path.split("/");
      // let dive into tree
      let node = this.treeData[0];
      if (node.children.length == 0)
        await this.asyncLoad(node, { no_set: true });
      let notLoaded = true;
      for (const path of paths) {
        let item = (node.children || []).find((t) => t.title == path);

        if (item) {
          node.expanded = true;
          node = item;
        } else {
          await this.asyncLoad(node, { no_set: true });
          notLoaded = false;
          item = (node.children || []).find((t) => t.title == path);
          if (item) {
            node.expanded = true;
            node = item;
          } else {
            node = null;
            break;
          }
        }
      }
      if (node) {
        if (notLoaded) await this.asyncLoad(node);
        this.currentFolderPath = node.ref;
      } else {
        console.log("failed dive");
      }
      EventBus.$emit("file-manager-loading", "off");
    },
    newFolderHandler() {
      this.createFolderPrompt = true;
    },
  },
  mounted() {
    //auto asyncload root folder
    this.asyncLoad(this.treeData[0]);
    EventBus.$on("folder-dive", this.folderDiveHandler);
    EventBus.$on("new-folder", this.newFolderHandler);
  },
  beforeDestroy() {
    EventBus.$off("folder-dive", this.folderDiveHandler);
    EventBus.$off("new-folder", this.newFolderHandler);
  },
  computed: {
    currentFolderPath: {
      get() {
        return this.$store.state.storage.currentFolderPath;
      },
      set(val) {
        let filename = val.split("/").pop();
        this.$store.commit("storage/setCurrentFolderPath", val);
        // add recent folder & frequent
        // this.$store.commit("storage/addFrequentFolder", {
        //   name: filename,
        //   path: val[0] != "/" ? "/" + val : val,
        // });
        this.$store.commit("storage/addRecentFolder", {
          name: filename,
          path: val[0] != "/" ? "/" + val : val,
        });
      },
    },
    frequentFolder() {
      let rf = this.$store.state.storage.frequent_folder;
      return Object.keys(rf)
        .map((path) => {
          let el = rf[path];
          return {
            path,
            name: el.name,
            count_call: el.count_call,
          };
        })
        .sort((a, b) => (a.count_call > b.count_call ? 1 : -1));
    },

    favoriteFolder() {
      return this.$store.state.storage.favorite_folder;
    },

    recentFolder() {
      return this.$store.state.storage.recent_folder;
    },
    baseUrl() {
      const path = this.$route.path;
      return path.slice(0, path.lastIndexOf("/"));
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    storage() {
      return this.app ? this.app.storage() : null;
    },
  },
  components: {
    VuePerfectScrollbar,
    VTree,
    VSelectTree,
  },
};
</script>
