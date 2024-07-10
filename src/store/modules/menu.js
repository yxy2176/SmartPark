import { getProfileAPI } from '@/api/user'
import { routes, resetRouter } from '@/router/index'
export default {
  namespaced: true,
  state: {
    // 权限标识
    permission: [],
    // 路由规则
    menuList: []
  },
  mutations: {
    // 修改权限标识
    setPermission(state, newPermission) {
      state.permission = newPermission
    },
    // 修改路由规则
    setMenuList(state, asyncRoutes) {
      state.menuList = [...routes, ...asyncRoutes]
    },
    clearMenuList(state) {
      state.menuList = []
      resetRouter()
    }
  },
  getters: {},
  actions: {
    async getUserPermission(store) {
      const res = await getProfileAPI()
      store.commit('setPermission', res.data.permissions)
      return res.data.permissions
    }
  }
}
