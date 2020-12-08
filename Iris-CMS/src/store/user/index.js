/*=========================================================================================
  File Name: index.js
  Description: Product Module
  ----------------------------------------------------------------------------------------
  Crud operation for Product
==========================================================================================*/


import state from './states'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default {
	namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
}
