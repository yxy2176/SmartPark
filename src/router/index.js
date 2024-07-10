import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import asyncRoutes from './asyncRoutes'

// 静态路由： 比如登录 404 首页 都不需要加权限
// 动态路由： 需要有权限才能访问的页面叫动态路由
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
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },
  {
    path: '/addEnterprise',
    component: () => import('@/views/Park/Enterprise/AddEnterprise')
  },
  {
    path: '/enterpriseDetail/:id',
    component: () => import('@/views/Park/Enterprise/EnterpriseDetail')
  },

  {
    path: '/car/addMonthCard',
    component: () => import('@/views/Car/CarCard/addMonthCard')
  },

  {
    path: '/sys/addRole',
    component: () => import('@/views/System/Role/AddRole')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

// 通过箭头函数 创建Router实例
// 路由模式两种：history  hash
// 特点： hash #来连接地址和路由。 #后面的路径不会请求到服务端，所以不会出现404
// history /来连接地址和路由  /后面的路径会请求的服务端。但是项目打完包之后只有一个index.html和favicon.icon这俩文件
// 所以history模式下 刷新的时候 会出现404
// 总结：hash模式 在任何环境下都不会出现问题
// history模式，在开发环境不会有问题（webpack提前把404的问题给你解决了），但发布之后就有404的问题
// 怎么去解决 history模式下 线上404的问题
// 官网的解决方案：https://v3.router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90
const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...routes, ...asyncRoutes]
  routes: routes
})

// function createRouter() {
//   return new Router({
//     // mode: 'history', // require service support
//     mode: 'history',
//     scrollBehavior: () => ({ y: 0 }),
//     routes: routes
//   })
// }

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
