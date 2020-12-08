<template>
  <div>
    <h4 class="text-center">Welcome {{ email }}👋! What's going on today?</h4>
  </div>
</template>

<script>
export default {
  computed: {
    app() {
      return this.$defaultApp;
    },
    user() {
      return this.$firebase.auth(this.app).currentUser;
    },
    email() {
      return this.user ? this.user.email : "";
    },
  },
};
</script>

<style></style>
