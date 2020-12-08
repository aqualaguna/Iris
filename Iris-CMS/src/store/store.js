/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import VuexPersistence from "vuex-persist";
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});
Vue.use(Vuex);
import moduleContentModule from "./content_model";
import moduleStorage from "./storage";
import moduleRole from "./role";
import moduleUser from "./user";

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  strict: process.env.NODE_ENV !== "production",
  plugins: [vuexLocal.plugin],
  modules: {
    content_model: moduleContentModule,
    storage: moduleStorage,
    role: moduleRole,
    user: moduleUser,
  },
});
