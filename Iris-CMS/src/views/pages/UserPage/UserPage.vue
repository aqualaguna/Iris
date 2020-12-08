<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-prompt @accept="inviteEmail" :active.sync="invitePrompt">
      <div class="con-exemple-prompt">
        <span>Email</span>
        <vs-input v-model="invite_email" class="mt-3 w-full" />
      </div>
    </vs-prompt>
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
              <vs-dropdown-item
                @click="deleteGroup"
                v-if="$can('user', 'delete')"
              >
                <span class="flex items-center">
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span>Delete</span>
                </span>
              </vs-dropdown-item>

              <!-- <vs-dropdown-item @click="archiveGroup">
                <span class="flex items-center">
                  <feather-icon
                    icon="ArchiveIcon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span>Archive</span>
                </span>
              </vs-dropdown-item> -->
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
        <vs-th sort-key="name">Name</vs-th>
        <vs-th sort-key="email">Email</vs-th>
        <vs-th sort-key="role">Role</vs-th>
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
              <p class="product-name font-medium truncate">
                {{ tr.name | title }}
              </p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.email }}</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.role_id | title }}
              </p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <div class="flex">
                <vx-tooltip text="Edit" v-if="$can('user', 'update') || tr.id == currentUserUid">
                  <feather-icon
                    icon="EditIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="editData(tr)"
                  />
                </vx-tooltip>
                <vx-tooltip text="Delete">
                  <feather-icon
                    v-if="$can('user', 'delete')"
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    class="ml-2"
                    @click.stop="confirmDelete(tr)"
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
  name: "UserPage",
  data() {
    return {
      invitePrompt: false,
      invite_email: "",
      selected: [],
      itemsPerPage: 4,
      products: [],
      isMounted: false,
    };
  },
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    currentUserUid() {
      return this.app.auth().currentUser.uid;
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
  mounted() {
    this.isMounted = true;
    if (this.app) {
      let db = this.app.firestore();
      let col = db.collection("iris_user");
      col
        .get()
        .then((snapshot) => {
          this.products = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
        })
        .catch(handleFirestoreReject.bind(this));
    }
  },
  methods: {
    inviteEmail() {
      let schema = { type: "string", format: "email" };
      let validateFunc = this.$ajv.compile(schema);
      var valid = validateFunc(this.invite_email);
      if (!valid) {
        this.$vs.notify({
          position: "bottom-center",
          color: "warning",
          title: "Not Email Format!",
        });
      } else {
        // valid lets create the user shall we?
        // let see if user exists
        let user = this.products.find((t) => t.email == this.invite_email);
        if (!user) {
          let actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: location.origin + "/pages/login?email=" + this.invite_email,
            // This must be true.
            handleCodeInApp: true,
          };
          // create it
          this.app
            .auth()
            .sendSignInLinkToEmail(this.invite_email, actionCodeSettings)
            .then(() => {
              this.$vs.notify({
                position: "bottom-center",
                color: "success",
                title: "Email Login Already Sent!",
              });
            })
            .catch(handleFirestoreReject.bind(this));
        } else {
          this.$vs.notify({
            position: "bottom-center",
            color: "warning",
            title: "User Email Already Registered!",
          });
        }
      }
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
    addNewData() {
      this.invitePrompt = true;
    },
    confirmDelete(tr) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: `You are about to DELETE '${tr.email}' User. this is irreversible (cannot be undone).`,
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
      if (tr.role_id == "super_admin") {
        this.$vs.notify({
          position: "bottom-center",
          color: "danger",
          text: "super admin user is immortal and may not deleted!",
          title: "Cannot Delete Super Admin!",
        });
        return;
      }
      let res = await this.$store
        .dispatch("user/deleteUser", tr.id)
        .catch(handleFirestoreReject.bind(this));
      if (typeof res == "object" && res.color && notify) this.$vs.notify(res);
    },
    editData(tr) {
      this.$store.commit("user/setUpdateData", tr);
      this.$router.push("/dashboard/user-update");
    },
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
