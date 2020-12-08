/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import firebase from "firebase/app";
import "firebase/firestore";

const actions = {
  listenUser({ commit }, app) {
    if (!app) return false;
    let db = firebase.firestore(app);
    let currentUser = app.auth().currentUser;
    if (!currentUser) return false;
    let doc = db.collection("iris_user").doc(currentUser.uid);
    let cancelFunc = doc.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        let data = {
          id: snapshot.id,
          ...snapshot.data()
        };
        commit("setIrisUser", data);
        let roledoc = db.collection("iris_role_permission").doc(data.role_id);
        if (data.role_id != null) {
          let roleListner = roledoc.onSnapshot((ss) => {
            if (ss.exists) {
              commit("setRole", ss.data());
            }
          });
          commit("setListener", { key: "roleListener", value: roleListner });
        }

        // listen to role
      }
    });
    commit("setListener", { key: "userListener", value: cancelFunc });
    return true;
  },

  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit("UPDATE_VERTICAL_NAV_MENU_WIDTH", width);
  },

  // VxAutoSuggest
  updateStarredPage({ commit }, payload) {
    commit("UPDATE_STARRED_PAGE", payload);
  },

  // The Navbar
  arrangeStarredPagesLimited({ commit }, list) {
    commit("ARRANGE_STARRED_PAGES_LIMITED", list);
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit("ARRANGE_STARRED_PAGES_MORE", list);
  },

  // /////////////////////////////////////////////
  // UI
  // /////////////////////////////////////////////

  toggleContentOverlay({ commit }) {
    commit("TOGGLE_CONTENT_OVERLAY");
  },
  updateTheme({ commit }, val) {
    commit("UPDATE_THEME", val);
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  updateUserInfo({ commit }, payload) {
    commit("UPDATE_USER_INFO", payload);
  },
};

export default actions;
