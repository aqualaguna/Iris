<template>
  <vs-popup
    class="holamundo"
    title="Add Firebase App"
    :active.sync="popupActive"
  >
    <div style="">
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <span> Config </span>
        </div>
        <div class="vx-col w-full">
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
          </div>
          <span class="text-danger text-sm" v-show="msg">{{ msg }}</span>
        </div>
      </div>
    </div>

    <div class="flex justify-end flex-wrap">
      <vs-button
        @blur="focus"
        @click="init"
        class="mt-4 mr-2 shadow-lg"
        type="gradient"
        color="primary"
      >
        Submit
      </vs-button>
    </div>
  </vs-popup>
</template>
<script>
export default {
  name: "AddFirebasePopup",
  data() {
    return {
      popupActive: false,
      
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
      firebaseConfig: ``,
      config: {},
      msg: "Required",
      reqKey: [
        "apiKey",
        "authDomain",
        "projectId",
        "storageBucket",
        "messagingSenderId",
        "appId",
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
  methods: {
    initFirebase() {
      try {
        this.$firebase.initializeApp(this.config, this.config.projectId);
        let item = this.$store.state.firebaseAppList.find(
          (t) => t.projectId == this.config.projectId
        );
        if(!item)
          this.$store.commit("addFirebaseApp", this.config);
        // this.$router.push("/dashboard").catch(() => {});
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
        this.$firebase.app(this.config.projectId);
        let item = this.$store.state.firebaseAppList.find(
          (t) => t.projectId == this.config.projectId
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
          this.$store.commit("addFirebaseApp", this.config);
        }
        this.close();
        this.reset();
      } catch (e) {
        if (e.code == "app/no-app") {
          // real init
          this.initFirebase();
          this.close();
          this.reset();
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
    focus() {
      this.$el.querySelector("textarea").focus();
    },
    open() {
      this.popupActive = true;
    },
    close() {
      this.popupActive = false;
    },
    toggle() {
      this.popupActive = !this.popupActive;
    },
    reset() {
      this.firebaseConfig =  ``;
      this.config =  {};
      this.msg =  "Required";
    },
  },
};
</script>
