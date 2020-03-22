import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门来放置需要共享的状态
    // {token： '', refreshtoken: ''}现在还没有设置 预设
    // user: auth.getUser()就是我们的token信息的对象 如果你要持久化 如果缓存有token 读取缓存的token
    user: auth.getUser()
  },
  // 要改token 只能通过 mutations
  mutations: {
    // 修改token
    updateUser (state, payload) {
      // 定义载荷(payload)中的user数据给state
      state.user = payload.user
      // 更新vuex的时候 他应该将最新的数据存入本地缓存中
      // auth.setUser(payload.user)相当于保持vuex和本地存储的同步
      auth.setUser(payload.user)
    },
    // 删除token
    deluser (state) {
      // 将vuex中的token设置为空对象
      state.user = {}
      // 缓存数据也需要更新
      // 删除本地缓存的token
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
