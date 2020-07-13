import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    oldTotal: 0,
    oldPublished: 0,
    oldTPublishing: 0,
    oldTopublish: 0,
    channelTab: []
  },
  mutations: {
    SET_oldTotal: (state, active) => {
      state.oldTotal = active
    },
    SET_oldPublished: (state, active) => {
      state.oldPublished = active
    },
    SET_oldTPublishing: (state, active) => {
      state.oldTPublishing = active
    },
    SET_oldTopublish: (state, active) => {
      state.oldTopublish = active
    },
    SET_channelTab: (state, active) => {
      state.channelTab = active
    }
  },
  getters: {

  },
  actions: {

  }
})
