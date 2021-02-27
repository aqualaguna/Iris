<template>
  <div id="data-list-list-view" class="data-list-container">
    <vx-table
      ref="table"
      multiple
      v-model="selected"
      @search="handleSearch"
      @change-page="
        mode == 'firestore'
          ? handleChangePage($event, currentPage)
          : handlePageAlgolia($event)
      "
      @sort="mode == 'firestore' ? handleSort : handleSortAlgolia"
      :sst="true"
      pagination
      :max-items="itemsPerPage"
      :current-page="currentPage"
      :total="queriedItems"
      :search="irisContentModel ? irisContentModel.algolia_index != '' : false"
      :data="products"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center flex-grow justify-between"
      >
        <div
          class="flex flex-wrap-reverse items-center data-list-btn-container"
        >
          <!-- ACTION - DROPDOWN -->
          <vs-dropdown
            vs-trigger-click
            class="dd-actions cursor-pointer mr-4 mb-4"
          >
            <div
              class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full"
            >
              <span class="mr-2">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu>
              <vs-dropdown-item @click="deleteGroup">
                <span class="flex items-center">
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span>Delete</span>
                </span>
              </vs-dropdown-item>

              <vs-dropdown-item @click="archiveGroup">
                <span class="flex items-center">
                  <feather-icon
                    icon="ArchiveIcon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span>Archive</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

          <!-- ADD NEW -->
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addNewData"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Add New</span>
          </div>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown
          vs-trigger-click
          class="cursor-pointer mb-4 mr-4 items-per-page-handler"
        >
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2">{{ range }} of {{ queriedItems }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
          <vs-dropdown-menu>
            <vs-dropdown-item @click="setPerPage(4)">
              <span>4</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="setPerPage(10)">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="setPerPage(15)">
              <span>15</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="setPerPage(20)">
              <span>20</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th
          v-for="definition in definitions.filter((t) => !t.hidden_field)"
          :key="definition.api_label"
          >{{ definition.title }}</vs-th
        ><vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr
            :state="tr.archived ? 'dark' : null"
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
          >
            <vs-td
              v-for="definition in definitions.filter((t) => !t.hidden_field)"
              :key="definition.api_label"
            >
              <p class="product-name font-medium truncate">
                <template v-if="!isDocumentReference(tr[definition.api_label])">
                  {{ tr[definition.api_label] }}
                </template>
                <template v-else>
                  link
                </template>
                
              </p>
            </vs-td>
            <vs-td class="whitespace-no-wrap">
              <div class="flex">
                <vx-tooltip text="Edit">
                  <feather-icon
                    icon="EditIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="editData(tr)"
                  />
                </vx-tooltip>
                <vx-tooltip text="Delete">
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    class="ml-2"
                    @click.stop="confirmDelete(tr)"
                  />
                </vx-tooltip>
                <vx-tooltip :text="!tr.archived ? 'Archive' : 'Un-Archive'">
                  <feather-icon
                    icon="ArchiveIcon"
                    class="ml-2"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    :style="{ color: !tr.archived ? '' : '#C8A5C8' }"
                    @click.stop="archiveData(tr)"
                  />
                </vx-tooltip>
              </div>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vx-table>
  </div>
</template>

<script>
import handleFirestoreReject from "@/helper/handleFirestoreReject";
import VxTable from "@/components/VxTable.vue";
var debounce = require("lodash.debounce");
const algoliasearch = require("algoliasearch");

export default {
  name: "CustomContentModelPage",
  components: {
    VxTable,
  },
  data() {
    return {
      selected: [],
      itemsPerPage: 4,
      currentPage: 1,
      isMounted: false,
      mode: "firestore", // algolia or firestore lol this is awesome.
      cache: {},
      prods: [],
      listener: null,
      algolia_index: null,
      algolia_meta: {
        nbHits: 0,
        query: "",
      },
    };
  },
  computed: {
    IrisSettings() {
      return this.$store.state.IrisSettings;
    },
    modelName() {
      return this.$route.params.id;
    },
    irisContentModel() {
      return this.$store.state.content_model.irisContentModel.find(
        (t) => t.id == this.modelName
      );
    },
    definitions() {
      return this.irisContentModel ? this.irisContentModel.definitions : [];
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    products() {
      return this.prods;
    },
    queriedItems() {
      let fscount = this.irisContentModel ? this.irisContentModel.row_count : 0;
      return this.mode == "firestore" ? fscount : this.algolia_meta.nbHits;
    },
    range() {
      let start =
        this.currentPage * this.itemsPerPage - (this.itemsPerPage - 1);
      let end = start + this.prods.length - 1;
      return `${start} - ${end}`;
    },
  },
  methods: {
    isDocumentReference(val) {
      return val instanceof this.$firebase.firestore.DocumentReference;
    },
    setPerPage(val) {
      if (val != this.itemsPerPage) {
        // invalidate cache.
        this.cache = {};
      }
      this.itemsPerPage = val;
      if (this.currentPage != 1) this.currentPage = 1;
      else {
        this.currentPage = 1;
        if (this.mode == "firestore") this.handleChangePage(1, 1);
        else this.handlePageAlgolia(1);
      }
    },
    handlePageAlgolia(page) {
      this.algolia_index
        .search(this.algolia_meta.query, {
          page: page - 1,
          hitsPerPage: this.itemsPerPage,
        })
        .then((result) => {
          const { nbHits, hits } = result;
          this.algolia_meta.nbHits = nbHits;
          this.prods = hits;
        });
    },
    async handleChangePage(page, currentPage, nochangepage = false) {
      console.log("handle firestore", page);
      let db = this.app.firestore();
      let col = db.collection(this.modelName);
      // wow such asshole firebase not allowing to offset
      let flagReverse = false;
      let query = col.limit(this.itemsPerPage).orderBy("createdAt", "desc");
      if (
        Math.abs(currentPage - page) == 1 ||
        Math.abs(currentPage - page) == 0
      ) {
        // left right op
        let c = this.cache[page];
        if (c) {
          // use cache
          query = query.startAt(c.startDoc).endAt(c.lastDoc);
        } else if (currentPage < page) {
          // next
          // check prev cache
          query = query.startAfter(this.cache[page - 1].lastDoc);
        } else {
          if (this.cache[page - 1]) {
            query = query.startAfter(this.cache[page - 1].lastDoc);
          } else if (this.cache[page + 1]) {
            query = col.limit(this.itemsPerPage).orderBy("createdAt");
            query = query.startAfter(this.cache[page + 1].startDoc);
            flagReverse = true;
          } else {
            let limit = this.itemsPerPage;
            let lastPage = Math.ceil(this.queriedItems / this.itemsPerPage);
            if (1 == lastPage && lastPage == page) {
              limit = this.itemsPerPage;
              query = col.limit(limit).orderBy("createdAt", "desc");
            } else if (lastPage == page) {
              limit = this.queriedItems % this.itemsPerPage;
              query = col.limit(limit).orderBy("createdAt");
              flagReverse = true;
            }
          }
        }
      } else {
        // jump op
        if (this.cache[page]) {
          query = query
            .startAt(this.cache[page].startDoc)
            .endAt(this.cache[page].lastDoc);
        } else {
          // next x times
          // get least starting point
          // to left
          let leftindex = page - 1,
            leftcount = 1,
            rightcount = 1,
            rightindex = page + 1;

          while (leftindex > 0) {
            if (this.cache[leftindex]) {
              break;
            }
            leftcount++;
            leftindex--;
          }
          while (
            rightindex <= Math.ceil(this.queriedItems / this.itemsPerPage)
          ) {
            if (this.cache[rightindex]) {
              break;
            }
            rightcount++;
            rightindex++;
          }
          if (leftcount < rightcount) {
            // left is least
            if (this.cache[leftindex]) {
              // not start
              for (let index = 1; index <= leftcount; index++) {
                await this.handleChangePage(
                  leftindex + index,
                  leftindex + index - 1,
                  index != leftcount
                );
              }
            } else {
              // starting point lol practically impossible
            }
          } else {
            // right is least
            for (let index = 1; index <= rightcount; index++) {
              await this.handleChangePage(
                rightindex - index,
                rightindex - index + 1,
                index != rightcount
              );
            }
          }
          return;
        }
      }
      await query
        .get()
        .then((snapshot) => {
          this.prods = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          if (flagReverse) this.prods.reverse();
          this.cache[page] = {
            lastDoc: snapshot.docs[snapshot.docs.length - 1],
            startDoc: snapshot.docs[0],
          };
          if (!nochangepage) this.currentPage = page;
        })
        .catch(handleFirestoreReject.bind(this));
    },
    handleSortAlgolia(key, active) {
      console.log(`the user ordered: ${key} ${active}`);
    },
    handleSort(key, active) {
      console.log(`the user ordered: ${key} ${active}`);
    },
    deleteGroup() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: `You are about to DELETE ${this.selected.length} Collection. this is irreversible (cannot be undone).`,
        accept: async () => {
          let task = this.selected.map((tr) => this.deleteData(tr, false));
          await Promise.all(task)
            .then(() => {
              this.$vs.notify({
                position: "bottom-center",
                color: "success",
                title: "Success delete collection!",
              });
              this.selected = [];
            })
            .catch(handleFirestoreReject.bind(this));
        },
      });
    },
    async archiveGroup() {
      let task = this.selected.map((tr) => this.archiveData(tr, false));
      await Promise.all(task)
        .then(() => {
          this.$vs.notify({
            position: "bottom-center",
            color: "success",
            title: "Success toggle archive collection!",
          });
          this.selected = [];
        })
        .catch(handleFirestoreReject.bind(this));
    },
    async archiveData(tr, notify = true) {
      if (!this.app) {
        this.$vs.notify({
          position: "bottom-center",
          color: "danger",
          text: "please select your app first!",
          title: "App not Selected.",
        });
        return;
      }
      let res = await this.$store
        .dispatch("content_model/archiveContentModelRow", {
          model: this.modelName,
          id: tr.id,
        })
        .catch(handleFirestoreReject.bind(this));
      if (typeof res == "object" && res.color && notify) this.$vs.notify(res);
    },
    addNewData() {
      this.$router.push(this.$route.path + "/create");
    },
    confirmDelete(tr) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: `You are about to DELETE 1 Row. this is irreversible (cannot be undone).`,
        accept: this.deleteData.bind(this, tr),
      });
    },
    async deleteData(tr, notify = true) {
      if (!this.app) {
        this.$vs.notify({
          position: "bottom-center",
          color: "danger",
          text: "please select your app first!",
          title: "App not Selected.",
        });
        return;
      }
      let res = await this.$store
        .dispatch("content_model/deleteContentModelRow", {
          model: this.modelName,
          id: tr.id,
        })
        .catch(handleFirestoreReject.bind(this));
      if (typeof res == "object" && res.color && notify) this.$vs.notify(res);
    },
    editData(tr) {
      this.$store.commit("content_model/setUpdateDataRow", tr);
      this.$router.push(this.$route.path + "/update");
    },
    async firstData() {
      let db = this.app.firestore();
      let col = db.collection(this.modelName);
      await col
        .orderBy("createdAt", "desc")
        .limit(this.itemsPerPage)
        .get()
        .then((snapshot) => {
          this.prods = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          this.cache[1] = {
            lastDoc: snapshot.docs[snapshot.docs.length - 1],
            startDoc: snapshot.docs[0],
          };
        })
        .catch(handleFirestoreReject.bind(this));
    },
    mountFunction() {
      // get first
      if (this.app) {
        let db = this.app.firestore();
        let col = db.collection(this.modelName);
        // listen to change and reset cache if so.
        this.listener = col
          .orderBy("createdAt")
          .limitToLast(1)
          .onSnapshot(() => {
            this.cache = {};
            // refresh
            this.firstData().then(() => {
              this.handleChangePage(this.currentPage, this.currentPage);
            });
          });
        // check for algolia
        if (this.irisContentModel.algolia_index != "" && this.IrisSettings) {
          const { app_id, app_search_secret } = this.IrisSettings.algolia;
          const client = algoliasearch(app_id, app_search_secret);
          this.algolia_index = client.initIndex(this.modelName);
        }
      }
    },
  },
  watch: {
    "$route.params.id": function() {
      // destroy listener if exists
      if (typeof this.listener == "function") this.listener();
      // remount
      this.mountFunction();
    },
  },
  destroyed() {
    if (typeof this.listener == "function") this.listener();
  },
  beforeCreate() {
    this.handleSearch = debounce(
      function(searching) {
        if (searching == "") {
          this.mode = "firestore";
          this.currentPage = 1;
          this.firstData();
          return;
        }
        this.algolia_meta.query = searching;
        this.mode = "algolia";

        if (this.algolia_index && this.currentPage == 1) {
          this.algolia_index
            .search(searching, {
              page: this.currentPage - 1,
              hitsPerPage: this.itemsPerPage,
            })
            .then((result) => {
              const { hits, nbHits } = result;
              this.algolia_meta.nbHits = nbHits;
              this.prods = hits;
            });
        } else {
          this.currentPage = 1;
        }
      }.bind(this),
      500
    );
  },
  mounted() {
    this.isMounted = true;
    this.mountFunction();
  },
};
</script>

<style lang="scss">
#data-list-list-view {
  .vs-con-table {
    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
