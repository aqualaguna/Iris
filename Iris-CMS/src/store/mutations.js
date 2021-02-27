/*=========================================================================================
  File Name: mutations.js
  Description: Vuex Store - mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

const mutations = {
  addFirebaseApp(state, value) {
    state.firebaseAppList.push(value);
  },
  removeFirebaseApp(state, index) {
    state.firebaseAppList.splice(index, 1);
  },
  setFirebaseApp(state, val) {
    state.selectedApp = val;
  },

  setIrisUser(state, val) {
    state.IrisUser = val;
  },
  setIrisSettings(state, val) {
    state.IrisSettings = val;
  },

  setRole(state, val) {
    state.role = val;
  },
  setFunctionAvailable(state, val) {
    state.isFunctionAvailable = val;
  },
  setFunctionVersion(state, val) {
    state.FunctionVersion = val;
  },
  markAsInitialized(state) {
    state.selectedApp.isInitialized = true;
    let index = state.firebaseAppList.findIndex(
      (t) => t.projectId == state.selectedApp.projectId
    );
    if (index != -1) {
      state.firebaseAppList[index].isInitialized = true;
    }
  },
  setListener(state, val) {
    if (typeof state.listener[val.key] == "function") state.listener[val.key]();
    state.listener[val.key] = val.value;
  },
  reset(state) { 
    state.isFunctionAvailable = false;
    state.IrisUser = null,
    state.role = null,
    Object.keys(state.listener).forEach(key => {
      if(typeof state.listener[key] == "function")
        state.listener[key]();
    });
    state.listener = {};
  },
  

  // /////////////////////////////////////////////
  // COMPONENTS
  // /////////////////////////////////////////////

  // Vertical NavMenu

  TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE(state, value) {
    state.isVerticalNavMenuActive = value;
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val;
  },
  UPDATE_MAIN_LAYOUT_TYPE(state, val) {
    state.mainLayoutType = val;
  },
  UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN(state, val) {
    state.verticalNavMenuItemsMin = val;
  },
  UPDATE_VERTICAL_NAV_MENU_WIDTH(state, width) {
    state.verticalNavMenuWidth = width;
  },

  // VxAutoSuggest

  UPDATE_STARRED_PAGE(state, payload) {
    // find item index in search list state
    const index = state.navbarSearchAndPinList["pages"].data.findIndex(
      (item) => item.url == payload.url
    );

    // update the main list
    state.navbarSearchAndPinList["pages"].data[index].is_bookmarked =
      payload.val;

    // if val is true add it to starred else remove
    if (payload.val) {
      state.starredPages.push(
        state.navbarSearchAndPinList["pages"].data[index]
      );
    } else {
      // find item index from starred pages
      const index = state.starredPages.findIndex(
        (item) => item.url == payload.url
      );

      // remove item using index
      state.starredPages.splice(index, 1);
    }
  },

  // Navbar-Vertical

  ARRANGE_STARRED_PAGES_LIMITED(state, list) {
    const starredPagesMore = state.starredPages.slice(10);
    state.starredPages = list.concat(starredPagesMore);
  },
  ARRANGE_STARRED_PAGES_MORE(state, list) {
    let downToUp = false;
    let lastItemInStarredLimited = state.starredPages[10];
    const starredPagesLimited = state.starredPages.slice(0, 10);
    state.starredPages = starredPagesLimited.concat(list);

    state.starredPages.slice(0, 10).map((i) => {
      if (list.indexOf(i) > -1) downToUp = true;
    });

    if (!downToUp) {
      state.starredPages.splice(10, 0, lastItemInStarredLimited);
    }
  },

  // ////////////////////////////////////////////
  // UI
  // ////////////////////////////////////////////

  TOGGLE_CONTENT_OVERLAY(state, val) {
    state.bodyOverlay = val;
  },
  UPDATE_PRIMARY_COLOR(state, val) {
    state.themePrimaryColor = val;
  },
  UPDATE_THEME(state, val) {
    state.theme = val;
  },
  UPDATE_WINDOW_WIDTH(state, width) {
    state.windowWidth = width;
  },
  UPDATE_WINDOW_SCROLL_Y(state, val) {
    state.scrollY = val;
  },

  // /////////////////////////////////////////////
  // User/Account
  // /////////////////////////////////////////////

  // Updates user info in state and localstorage
  UPDATE_USER_INFO(state, payload) {
    // Get Data localStorage
    let userInfo =
      JSON.parse(localStorage.getItem("userInfo")) || state.AppActiveUser;

    for (const property of Object.keys(payload)) {
      if (payload[property] != null) {
        // If some of user property is null - user default property defined in state.AppActiveUser
        state.AppActiveUser[property] = payload[property];

        // Update key in localStorage
        userInfo[property] = payload[property];
      }
    }
    // Store data in localStorage
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  },
};

export default mutations;
