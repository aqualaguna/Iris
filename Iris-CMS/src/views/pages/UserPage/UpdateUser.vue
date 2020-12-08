<template>
  <div>
    <vx-card title="Profile" no-shadow>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Name</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" v-model="user.name" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Email</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" type="email" disabled :value="user.email" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Phone Number</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" v-model="user.phone" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Role</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vSelect
            :disabled="isSuper"
            :closeOnSelect="false"
            class="bg-white m-3"
            v-model="user.role_id"
            :options="roleOptions"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
          />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
          <vs-button @click="saveUser" class="float-right mr-3 m-2" @>Submit</vs-button>
        </div>
      </div>
    </vx-card>
    <ChangePasssword v-if="this.user.id == currentUserUid" />
  </div>
</template>

<script>
import ChangePasssword from "./ChangePassword";
import vSelect from "vue-select";
import handleFirestoreReject from "@/helper/handleFirestoreReject";

export default {
  components: {
    ChangePasssword,
    vSelect,
  },
  name: "UpdateUser",
  data() {
    return {
      user: {
        name: "",
        email: "",
        phone: "",
      },
      roles: [],
      isSuper: false,
    };
  },
  methods: {
    saveUser() {
      let doc = this.app.firestore().collection('iris_user').doc(this.currentUserUid);
      let pl = {
        email: this.user.email,
        name: this.user.name,
      }
      if (this.user.role_id.value != this.$store.state.user.updateData.role_id) {
        pl.role_id = this.user.role_id.value;
      }
      doc.update(pl).then(() => {
        this.$vs.notify({
          position: "bottom-center",
          title: "User Profile Updated!",
          color: "success",
          iconPack: "feather",
        });
        this.$router.back();
      }).catch(handleFirestoreReject.bind(this));
    }
  },
  computed: {
    roleOptions() {
      return this.roles.map((t) => {
        return {
          label: t.name,
          value: t.id,
        };
      });
    },
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    currentUser() {
      return this.app.auth().currentUser;
    },
    currentUserUid() {
      return this.currentUser ? this.currentUser.uid : "";
    },
  },
  mounted() {
    // check permission
    this.user = JSON.parse(JSON.stringify(this.$store.state.user.updateData));

    if (!(this.user.id == this.currentUserUid || this.$can("user", "update"))) {
      this.$router.push("/pages/error-unauthorized");
    }
    let db = this.app.firestore();
    let col = db.collection("iris_role_permission");
    col
      .get()
      .then((snapshot) => {
        this.roles = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        let role = this.roles.find((t) => t.id == this.user.role_id);
        if (this.user.role_id == "super_admin") {
          this.isSuper = true;
        }
        if (role) {
          this.user.role_id = {
            label: role.name,
            value: role.id,
          };
        }
      })
      .catch(handleFirestoreReject.bind(this));
  },
};
</script>

<style></style>
