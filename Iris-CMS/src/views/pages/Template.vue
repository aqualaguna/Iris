<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col">
              <img
                src="@/assets/images/logo/logo.png"
                alt="login"
                class="mx-auto"
              />
            </div>

            <div class="vx-col w-full d-theme-dark-bg">
              <div class="p-8 login-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">
                    Initialize IRIS Content Management System
                  </h4>
                  <p>First Input your firebase settings from .</p>
                </div>

                <div>
                  <div
                    class="vs-component vs-con-textarea vs-textarea-primary"
                    style="border: 1px solid rgba(0, 0, 0, 0.08); height: 300px;"
                  >
                    <textarea
                      v-model="firebaseConfig"
                      @input="validateJson"
                      class="vs-textarea"
                      :placeholder="placeholder"
                      style="margin: 0px; height: 300px;"
                    ></textarea>
                    <vs-button
                      @click="init"
                      class="float-right m-3"
                      :disabled="msg != ''"
                      >Initialize</vs-button
                    >
                  </div>

                  <span v-if="msg" class="text-danger">{{ msg }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "FirstPage",
  data() {
    return {
      firebaseConfig: ``,
      placeholder: `Example:
{
  "apiKey":"AIzaSyAfgMxxxxxxxxxxxxxxxxx530dCnE",
  "authDomain":"xxxxxxx.firebaseapp.com",
  "databaseURL":"https://xxxxx.firebaseio.com",
  "projectId":"xxxxx",
  "storageBucket":"xxxx.appspot.com",
  "messagingSenderId":"xxxxxx",
  "appId":"xxxxxxx"
}`,
      config: {},
      msg: "Required",
      reqKey: [
        "apiKey",
        "authDomain",
        "databaseURL",
        "projectId",
        "storageBucket",
        "messagingSenderId",
        "appId",
      ],
    };
  },
  methods: {
    validateJson() {
      try {
        this.config = JSON.parse(this.firebaseConfig);
        // check if firebase config format
        let keys = Object.keys(this.config);
        for (const key of this.reqKey) {
          if (!keys.includes(key)) {
            throw "Not a firebase config!";
          }
        }
        this.msg = "";
      } catch (e) {
        this.msg = typeof e == "string" ? e : "Not a Valid JSON";
      }
    },
    initFirebase() {
      try {
        this.$firebase.initializeApp(this.config);
        this.$router.push("/dashboard").catch(() => {});
      } catch (e) {
        this.$vs.notify({
          position: "bottom-center",
          time: 2500,
          title: "Error",
          text: `${e.message} ${e.code}`,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
      }
    },
    init() {
      // assuming the data is right
      try {
        this.$firebase.app();
        this.$vs.notify({
          position: "bottom-center",
          time: 2500,
          title: "Already Initialized!",
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });
      } catch (e) {
        console.log(e.code);
        if (e.code == "app/no-app") {
          // real init
          this.initFirebase();
        } else {
          this.$vs.notify({
            position: "bottom-center",
            time: 2500,
            title: "Error",
            text: `${e.message} ${e.code}`,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook {
      background-color: #1551b1;
    }
    .bg-twitter {
      background-color: #00aaff;
    }
    .bg-google {
      background-color: #4285f4;
    }
    .bg-github {
      background-color: #333;
    }
  }
}
</style>
