import {getDefaultState} from './states';

export default {
  reset(state) {
    Object.assign(state, getDefaultState())
  },
  addIrisContentModel(state, val) {
    let index = state.irisContentModel.findIndex((t) => t.id == val.id);
    if (index != -1) {
      state.irisContentModel.splice(index, 1, val);
    } else {
      state.irisContentModel.push(val);
    }
  },
  updateIrisContentModel(state, data) {
    let { index, modified } = data;
    state.irisContentModel.splice(index, 1, modified);
  },
  removeIrisContentModel(state, index) {
    state.irisContentModel.splice(index, 1);
  },
  setUpdateData(state, data) {
    state.updateData = data;
  }
}