import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_IS_AUTNENTIATED: 'SET_IS_AUTNENTIATED', // 是否认证通过
  SET_USER: 'SET_USER', // 用户信息
  SET_TARGET_USER: "SET_TARGET_USER" //设备信息
}

const state = { // 需要维护的状态
  isAutnenticated: false,  // 是否认证
  user: {},   // 存储用户信息
  targetUser: {} //存储设备信息
}

const getters = {
  isAutnenticated: state => state.isAutnenticated,
  user: state => state.user,
  targetUser: state => state.targetUser
}

const mutations = {
  [types.SET_IS_AUTNENTIATED](state, isAutnenticated) {
    if (isAutnenticated)
      state.isAutnenticated = isAutnenticated
    else
      state.isAutnenticated = false
  },
  [types.SET_USER](state, user) {
    if (user)
      state.user = user
    else
      state.user = {}
  },
  [types.SET_TARGET_USER](state, targetUser) {
    if(targetUser){
        state.targetUser = targetUser;
    }else {
        state.targetUser ={};
    }
  },
}

const actions = {
  setIsAutnenticated: ({ commit }, isAutnenticated) => {
    commit(types.SET_IS_AUTNENTIATED, isAutnenticated)
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({ commit }) => {
    commit(types.SET_IS_AUTNENTIATED, false)
    commit(types.SET_USER, null)
  },
  setTargetUser: ({commit}, targetUser) => {
    commit(types.SET_TARGET_USER, targetUser);
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
