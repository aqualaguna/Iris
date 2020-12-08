<template>
  <vs-popup title="Select a Folder" :active.sync="popupActive">
    <vs-prompt @accept="createFolder" :active.sync="createFolderPrompt" style="z-index:60000">
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
    <div class="float-right">
      <feather-icon
        title="Add Folder"
        icon="FolderPlusIcon"
        class="mr-1"
        svgClasses="h-6 w-6"
        @click="createFolderPrompt = true"
      />
    </div>
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
  </vs-popup>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { VTree, VSelectTree } from "vue-tree-halower";
import "vue-tree-halower/dist/halower-tree.min.css"; // you can customize the style of the tree

export default {
  name: "FolderSelectorPopup",
  components: {
    VTree,
    VSelectTree,
    VuePerfectScrollbar,
  },
  data() {
    return {
      folder_name: '',
      createFolderPrompt: false,
      currentFolderPath: "",
      popupActive: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
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
      this.$emit("input", this.currentFolderPath);
    },
    async asyncLoad(node) {
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
          return folders;
        });
      this.$set(node, "children", pro);
      this.$set(node, "loading", false);
      if (checked) {
        this.$refs.tree.childCheckedHandle(node, checked);
      }
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

<style></style>
