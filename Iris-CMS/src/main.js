import Vue from "vue";
import App from "./App.vue";

// Vuesax Component Framework
import Vuesax from "vuesax";
import "material-icons/iconfont/material-icons.css"; //Material Icons
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

// axios
import axios from "./axios.js";
Vue.prototype.$http = axios;

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/functions";

Vue.prototype.$firebase = firebase;

// Filters
import "./filters/filters.js";

// Theme Configurations
import "../themeConfig.js";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";

// Vue Router
import router from "./router";

// Vuex Store
import store from "./store/store";

Vue.prototype.$app = function(appName) {
  let app;
  try {
    app = firebase.app(appName);
    return app;
  } catch (e) {
    // no app
    let config = store.state.selectedApp;
    if (Object.keys(config).length == 0) throw "app not selected.";
    app = firebase.initializeApp(config, appName);
    return app;
  } finally {
    Vue.prototype.$defaultApp = app;
  }
};
Vue.prototype.$can = function(resource, action) {
  try {
    if (store.state.role) {
      return store.state.role.permission[resource][action];
    }
    return false;
  } catch (e) {
    return false;
  }
};
import { Quill } from "vue2-editor";

import { ImageDrop } from "quill-image-drop-module";
import ImageResize from "quill-image-resize-module";
import VideoResize from "quill-video-resize-module";
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/videoResize', VideoResize);
// vue shortkey
Vue.use(require("vue-shortkey"), { prevent: ["input", "textarea"] });

import Ajv from "ajv";

let ajv = new Ajv({
  useDefaults: true,
  coerceTypes: true,
  allErrors: true,
});
require("ajv-errors")(ajv /*, {singleError: true} */);

ajv.addKeyword("isNotEmpty", {
  type: ["string", "integer", "number", "null"],
  validate: function validate(schema, data) {
    validate.errors = [{keyword: 'isNotEmpty', message: 'this field is required.', params: {keyword: 'isNotEmpty'}}];
    return schema
      ? typeof data === "string"
        ? data.trim() !== ""
        : data != null
      : true;
  },
  errors: true,
});

require("ajv-keywords")(ajv);
Vue.prototype.$ajv = ajv;

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from "vue2-hammer";
Vue.use(VueHammer);

// PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// Feather font icon
require("./assets/css/iconfont.css");

// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
