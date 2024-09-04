import { getProfileAPI } from "@/api/user"
import { routes,resetRouter } from "@/router"

export default {
    namespaced: true,
    state: {
        // 权限标识
        getUserPermissions: [],
        // 路由规则
        menuList:[],
    },
    mutations: {
        // 修改权限标识
        setPermissions(state,newPermissions) {
            state.permissions=newPermissions
        },
        // 修改路由规则
        setMenuList(state,filteredRoutes) {
            state.menuList = [...routes, ...filteredRoutes]
        },
        clearMenuList(state) {
            state.menuList = []  //清空vuex中的数据
            resetRouter() //清空route中的数据
        }
    },
    getters: {},
    actions: {
        async getUserPermissions(store) {
            const res = await getProfileAPI()
            // console.log(res);

            store.commit('setPermissions', res.data.permissions)
            return res.data.permissions
        }
    },
}