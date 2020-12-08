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
                    List Firebase CMS
                  </h4>
                </div>

                <div>
                  <vs-list>
                    <vs-list-item
                      v-for="(app, index) in listFirebaseApp"
                      :key="app.projectId"
                      :title="app.projectId"
                      class="firebase-list-item"
                      @click.native="openApp(app)"
                    >
                      <template slot="avatar">
                        <img
                          width="30"
                          height="30"
                          alt="Google, firebase Free Icon of Google IO 2016"
                          class="m-4"
                          src="data:image/png;base64,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"
                        />
                      </template>
                      <vs-button
                        @click.prevent.stop="removeApp(index)"
                        color="danger"
                        icon-pack="feather"
                        icon="icon-trash"
                        type="border"
                      />
                    </vs-list-item>
                    <vs-button
                      @click="$refs.fbPopup.open()"
                      color="primary"
                      icon-pack="feather"
                      icon="icon-plus"
                      type="border"
                      class="w-full my-base"
                      >Add New Firebase App</vs-button
                    >
                  </vs-list>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
    <AddFirebasePopup ref="fbPopup" />
  </div>
</template>

<script>
import AddFirebasePopup from "./addFirebasePopup";

export default {
  name: "FirstPage",
  components: {
    AddFirebasePopup,
  },
  computed: {
    listFirebaseApp() {
      return this.$store.state.firebaseAppList;
    },
  },
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
    removeApp(index) {
      this.$store.commit("removeFirebaseApp", index);
    },
    openApp(app) {
      this.$store.commit("setFirebaseApp", app);
      if (app.isInitialized) {
        // check if user exists
        let apptemp = this.$app(app.projectId);
        let user = apptemp.auth().currentUser;
        if (!user) {
          this.$router.push('/pages/login');
        } else {
          this.$router.push('/dashboard');
        }
        
      } else {
        // try to read previous settings first before init
        let tempapp = this.$app(app.projectId);
        let doc = tempapp.firestore().collection('iris_global').doc('iris_settings');
        doc.get().then((snapshot) => {
          if (!snapshot.data().initialized) {
            this.$router.push('/init');
          } else {
            this.$router.push('/dashboard');
          }
        }).catch((e) => {
          // error no document or not initialized
          console.log(e);
          this.$router.push('/init');
        })
      }
      
    }
  },
  mounted() {
    // get init script from host if available
    this.$http.get(location.origin+ '/__/firebase/init.js').then((res) => {
      let config = /(?<config>\{.*?\})/ms.exec(res.data)
      console.log(config)
      config = JSON.parse(config.groups.config);
      // config get
      let item = this.$store.state.firebaseAppList.find(
          (t) => t.projectId == config.projectId
        );
        if (item) {
          this.$vs.notify({
            position: "bottom-center",
            time: 2500,
            title: "Already Initialized!",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "warning",
          });
        } else {
          this.$store.commit("addFirebaseApp", config);
        }
        this.$firebase.initializeApp(config, config.projectId);
        this.$store.commit("setFirebaseApp", config);
        // try to read previous settings first before init
        let tempapp = this.$app(config.projectId);
        let doc = tempapp.firestore().collection('iris_global').doc('iris_settings');
        doc.get().then((snapshot) => {
          if (!snapshot.data().initialized) {
            this.$router.push('/init');
          } else {
            this.$router.push('/dashboard');
          }
        }).catch((e) => {
          // error no document or not initialized
          console.log(e);
          this.$router.push('/init');
        })
    })
  }
};
</script>

<style lang="scss">
.firebase-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
  
}
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
