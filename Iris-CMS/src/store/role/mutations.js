import { getDefaultState } from "./states";

export default {
  reset(state) {
    Object.assign(state, getDefaultState());
  },
  setUpdateData(state, val) {
    state.updateData = val;
  },
};
