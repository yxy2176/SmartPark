/*
 * @Author: JennyYao 344561707@qq.com
 * @Date: 2024-08-07 16:48:23
 * @LastEditors: JennyYao 344561707@qq.com
 * @LastEditTime: 2024-09-03 19:02:11
 * @FilePath: \SmartPark\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import asyncRoutes from './asyncRoutes'

export const routes = [
    {
        path: '/login',
        component: () => import('@/views/Login/index'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/workbench'
    },
    // 1. 工作台
    {
        path: '/workbench',
        component: Layout,
        children: [{
            path: '',
            component: () => import('@/views/Workbench/index'),
            meta: { title: '工作台', icon: 'el-icon-data-board' }
        }]
    },
    // 2-2. 园区管理-企业管理 里的 添加企业
    {
        path: '/addEnterprise',
        component: () => import('@/views/Park/Enterprise/AddEnterprise.vue')
    },
    //查看企业的详细信息
    {
        path: '/enterpriseDetail/:id',
        component: () => import('@/views/Park/Enterprise/EnterpriseDetail.vue')
    },
    //添加月卡
    {
        path: '/car/addMonthCard',
        component: () => import('@/views/Car/CarCard/addMonthCard.vue')
    },

    {
        path: '/sys/addRole',
        component: () => import('@/views/System/Role/AddRole.vue')
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    }
]

// 通过箭头函数 创建Router实例
const createRouter = () => new Router({
    // mode: 'history', // require service support
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    // routes: [...routes,...asyncRoutes]
    routes
})



const router = createRouter()

// 重置路由方法
export function resetRouter() {
    // 得到一个全新的router实例对象
    const newRouter = createRouter()
    // 使用新的路由记录覆盖掉老的路由记录
    // matcher属性里面存的是：路由规则
    router.matcher = newRouter.matcher
}

export default router
