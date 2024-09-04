<!--
 * @Author: JennyYao 344561707@qq.com
 * @Date: 2023-08-14 15:29:03
 * @LastEditors: JennyYao 344561707@qq.com
 * @LastEditTime: 2024-09-03 20:30:48
 * @FilePath: \SmartPark\src\layout\components\Sidebar\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="has-logo">
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 左侧菜单组件 -->
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        :collapse-transition="false"
        :unique-opened="true"
      >
        <!-- 菜单中的每一项 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Logo },
  computed: {
    routes() {
      // this.$router.options.routes 获取的是创建路由对象时传入的路由规则
          // console.log(this.$router.options.routes)
          //   导航栏左侧菜单是通过 this.$router.options.routes 来进行渲染的
          // =>权限标识 跟它对比就行
    // this.$router.options.routes 就是 创建路由对象的时候传入的路由规则
    //   return this.$router.options.routes
    return this.$store.state.menu.menuList
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>

