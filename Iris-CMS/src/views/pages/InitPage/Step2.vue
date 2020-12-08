<template>
  <div>
    <h2 class="text-center mb-base">Create Firebase User Account</h2>
    <!-- tab 1 content -->
    <div class="flex flex-direction-col flex-wrap">
      <p class="w-full flex-initial">
        1. Please Make Sure you are already turned on firebase authentication email method.<br><br>
      </p>
      <div class="flex-1">
        <vs-input label="Email" v-model="email" class="w-full" />
        <vs-input
          label="Password"
          v-model="password"
          class="w-full"
          type="password"
        />
        <span class="text-danger text-sm" v-show="err_msg">{{ err_msg }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    projectId() {
      let app = this.$store.state.selectedApp;
      return app ? app.projectId : null;
    },
  },
  data() {
    return {
      email: '',
      password: '',
      err_msg: '',
    }
  },
  methods: {
    validateLogin() {
      return new Promise((resolve, reject) => {
        // create user
        let auth = this.$firebase.auth(this.$app(this.projectId));
        auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            this.err_msg = e.message;
            console.log(e);
            if (e.code == "auth/email-already-in-use") {
              // sign in
              auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
                resolve(true);
              }).catch(e => {
                this.err_msg = e.message;
                reject(false);
              })
            } else {
              reject(false);
            }
            
          });
      });
    },
  }
};
</script>

<style></style>
