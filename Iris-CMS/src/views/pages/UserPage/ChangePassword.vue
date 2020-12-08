<template>
  <div>
    <vx-card title="Change Password" no-shadow>
      <vs-input
        class="w-full mb-base"
        type="password"
        label-placeholder="New Password"
        v-model="email.new_password"
      />
      <vs-input
        class="w-full mb-base"
        type="password"
        label-placeholder="Confirm Password"
        v-model="email.confirm_new_password"
      />

      <!-- Save & Reset Button -->
      <div class="flex flex-wrap items-center justify-end">
        <vs-button
          type="border"
          color="warning"
          class="ml-auto mt-2"
          @click="
            email = {
              new_password: '',
              confirm_new_password: '',
            }
          "
          >Reset</vs-button
        >
        <vs-button @click="changePassword" class="ml-4 mt-2" color="primary"
          >Save Changes</vs-button
        >
      </div>
    </vx-card>
  </div>
</template>

<script>
import handleReject from "@/helper/handleFirestoreReject";
export default {
  data() {
    return {
      email: {
        new_password: "",
        confirm_new_password: "",
      },

      user: {},
    };
  },
  methods: {
    changePassword() {
      if (this.email.new_password != this.email.confirm_new_password) {
        this.$vs.notify({
          position: "bottom-center",
          title: "password does not match",
          text: "check your input again.",
          color: "warning",
          iconPack: "feather",
          icon: "icon-alert-circle",
        });
      } else {
        this.firebaseUser
          .updatePassword(this.email.new_password)
          .then(() => {
            console.log("test");
            this.$vs.notify({
              position: "bottom-center",
              title: "password Updated!",
              text:
                "yout password has been updated. please remember your new password.",
              color: "success",
              iconPack: "feather",
              icon: "icon-check",
            });
          })
          .catch(handleReject.bind(this));
      }
    },
  },
  computed: {
    app() {
      let config = this.$store.state.selectedApp;
      return (config ? this.$app(config.projectId) : null) || null;
    },
    firebaseUser() {
      return this.app.auth().currentUser;
    },
  },
};
</script>
