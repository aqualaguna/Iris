import { getDefaultState } from "./states";

const RECENT_FOLDER_LIMIT = 5;
const FREQUENT_FOLDER_LIMIT = 5;

export default {
  reset(state) {
    Object.assign(state, getDefaultState());
  },
  setCurrentFolderPath(state, val) {
    state.currentFolderPath = val;
  },
  setCurrentFolderData(state, val) {
    state.currentFolderData = val;
  },
  addFrequentFolder(state, val) {
    let { name, path } = val;
    if (path == "/") return;
    let count_call;
    if (state.frequent_folder[path]) {
      count_call = state.frequent_folder[path].count_call + 1;
      state.frequent_folder[path] = {
        name,
        count_call,
      };
    } else {
      count_call = 1;
      // check for limit
      if (
        Object.keys(state.frequent_folder).length + 1 <=
        FREQUENT_FOLDER_LIMIT
      ) {
        state.frequent_folder[path] = {
          name,
          count_call,
        };
      } else {
        // exceed limit
        // remove least key
        delete state.frequent_folder[state.frequent_folder_least_key];
        state.frequent_folder_least_key = null;
        state.frequent_folder[path] = {
          name,
          count_call,
        };
      }
    }
    if (state.frequent_folder_least_key == null)
      state.frequent_folder_least_key = path;
    else {
      // compare current key to least key
      let lcount =
        state.frequent_folder[state.frequent_folder_least_key].count_call;
      if (lcount > count_call) {
        state.frequent_folder_least_key = path;
      }
    }
  },
  addFavoriteFolder(state, val) {
    let { name, path } = val;
    if (path == "/") return;
    // search if exists
    let item = state.favorite_folder.find((t) => t.path == path);
    if (!item) {
      state.favorite_folder.push({
        name,
        path,
      });
    }
  },
  addRecentFolder(state, val) {
    let { name, path } = val;
    if (path == "/") return;
    // search if exists
    let item = state.recent_folder.find((t) => t.path == path);
    if (!item) {
      // check limit
      if (state.recent_folder.length + 1 > RECENT_FOLDER_LIMIT) {
        state.recent_folder.pop();
      }
      state.recent_folder.unshift({
        name,
        path,
      });
    }
  },
  addNewItemToFolderData(state, val) {
    state.currentFolderData.push(val);
  },
  setClipboard(state, val) {
    state.clipboard = val;
  },
  setViewMode(state, val) {
    state.view_mode = val;
  },
  setClipboardBaseDir(state, val) {
    state.clipboard_base_dir = val;
  },

  setClipboardMode(state, val) {
    state.clipboard_mode = val;
  },
};
