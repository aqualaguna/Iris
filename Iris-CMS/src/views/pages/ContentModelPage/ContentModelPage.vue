<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-table
      ref="table"
      multiple
      v-model="selected"
      pagination
      :max-items="itemsPerPage"
      search
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
              <vs-dropdown-item @click="deleteGroup" v-if="$can('content_model', 'delete')">
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
            <span class="mr-2"
              >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
                products.length - currentPage * itemsPerPage > 0
                  ? currentPage * itemsPerPage
                  : products.length
              }}
              of {{ queriedItems }}</span
            >
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage = 4">
              <span>4</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 15">
              <span>15</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 20">
              <span>20</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th>Icon</vs-th>
        <vs-th sort-key="title">Name</vs-th>
        <vs-th sort-key="collection_name">Collection Name</vs-th>
        <vs-th># Properties</vs-th>
        <vs-th sort-key="row_count"># Record</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr
            :state="tr.archived ? 'dark' : null"
            :data="tr"
            :key="indextr"
            v-for="(tr, indextr) in data"
          >
            <vs-td>
              <feather-icon :icon="tr.icon || 'KeyIcon'" />
            </vs-td>
            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.title | title }}
              </p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.collection_name }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.definitions.length }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.row_count }}</p>
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
                <vx-tooltip text="Delete" v-if="$can('content_model', 'delete')">
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    class="ml-2"
                    @click.stop="confirmDelete(tr)"
                  />
                </vx-tooltip>
                <vx-tooltip :text="!tr.archive ? 'Archive' : 'Un-Archive'">
                  <feather-icon
                    v-if="!tr.archive"
                    icon="ArchiveIcon"
                    class="ml-2"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    :style="{ color: !tr.archive ? '' : '#C8A5C8' }"
                    @click.stop="archiveData(tr)"
                  />
                </vx-tooltip>
              </div>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import handleFirestoreReject from "@/helper/handleFirestoreReject";

export default {
  name: 'ContentModelPage',
  data() {
    return {
      selected: [],
      itemsPerPage: 4,
      isMounted: false,
    };
  },
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return this.$app(config.projectId) || null;
    },
    products() {
      return this.$store.state.content_model.irisContentModel;
    },
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.products.length;
    },
  },
  methods: {
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
        .dispatch("content_model/archiveContentModel", tr.id)
        .catch(handleFirestoreReject.bind(this));
      if (typeof res == "object" && res.color && notify) this.$vs.notify(res);
    },
    addNewData() {
      this.$router.push("/dashboard/content-model-create");
    },
    confirmDelete(tr) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: `You are about to DELETE '${tr.title}' Collection. this is irreversible (cannot be undone).`,
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
        .dispatch("content_model/deleteContentModel", tr)
        .catch(handleFirestoreReject.bind(this));
      if (typeof res == "object" && res.color && notify) this.$vs.notify(res);
    },
    editData(tr) {
      this.$store.commit("content_model/setUpdateData", tr);
      this.$router.push("/dashboard/content-model-update");
    },
  },
  mounted() {
    this.isMounted = true;
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
