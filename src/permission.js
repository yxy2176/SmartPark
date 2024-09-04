/*
 * @Author: JennyYao 344561707@qq.com
 * @Date: 2024-07-16 16:14:02
 * @LastEditors: JennyYao 344561707@qq.com
 * @LastEditTime: 2024-09-03 20:49:57
 * @FilePath: \SmartPark\src\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import router from "@/router";
import store from "@/store";
import asyncRoutes from "./router/asyncRoutes";

// 路由的白名单
const whiteList = ["/login", "/404"];

// 获取一级路由权限标识
function getFirstRoutePermission(permissions) {
    const permissionArr = permissions.map(item => {
        return item.split(':')[0]
    })
    // 去重后再返回
    // Set不能存重复的数据,可以达到去重的目的(但是,不是一个真实的数组)
    // 或者return Array.from(new Set(permissionArr))
    return [...new Set(permissionArr)]

}

// 获取二级路由权限标识
function getSecondRoutePermission(permissions) {
    const permissionArr = permissions.map(item => {
        const arr = item.split(':')
        return `${arr[0]}:${arr[1]}`
    })
    // console.log(permissionArr);

    return [...new Set(permissionArr)]
}

function getRoutes(firstPermission, secondPermission, asyncRoutes) {
    // 当为管理员时：
    if (firstPermission.includes('*')) return asyncRoutes
    // 首先筛选一级
    const firstRoute = asyncRoutes.filter(route => {
        firstPermission.includes(route.permission)
    })
    // 在筛选：在满足一级的条件下，二级满足的
    const filteredRoutes = firstRoute.map(item => {
        return {
            ...item,
            children: item.children.filter(childRoute => {
                secondPermission.includes(childRoute.permission)
            })

        }
    })
    return filteredRoutes
}

router.beforeEach(async (to, from, next) => {
    // console.log('to', to)
    // console.log('from',from)
    // to：跳转的路由对象
    // from：从哪里来
    // next: 放行next()  重定向next(路径)
    // console.log('to', to)
    // console.log('from', from)
    const token = store.state.user.token;
    // 有token
    if (token) {
        if (to.path === "/login") {
            next("/");
        } else {
            next();
            // 1.拿到用户的权限信息
            const permissions = await store.dispatch('menu/getUserPermissions')
            console.log(permissions);
            // 2.根据权限标识,筛选出对应的一级路由标识
            const firstPermission = getFirstRoutePermission(permissions)
            console.log("一级路由标识:", firstPermission);

            // 3.  根据权限标识,筛选出二级的路由标识
            const secondPermission = getSecondRoutePermission(permissions)
            console.log("二级路由标识:", secondPermission);

            // console.log(asyncRoutes);
            const filteredRoutes = getRoutes(firstPermission, secondPermission, asyncRoutes)

            //4.addRoute动态添加  ---> 4.1:先把筛选后的可以的每个路由都添加到路由对象中
            filteredRoutes.forEach(route => router.addRoute(route))
            // 4.2 再把筛选之后的路由添加到vuex中（用于之后随时渲染）
            store.commit('menu/setMenuList', filteredRoutes)
        }
        // 没有token
    } else {
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next("/login");
        }
    }
});
