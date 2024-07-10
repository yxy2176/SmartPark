// 放置全局指令
import Vue from 'vue'
import store from '@/store'
const adminPerms = '*:*:*'
Vue.directive('permission', {
  // el：使用自定义指令的DOM元素
  // binding: 对象。 binding.value 可以接受到外部传过来的值
  inserted(el, binding) {
    // console.log(el)
    // console.log(binding)
    const perms = store.state.menu.permission
    // perms = [*:*:*]
    // 管理员账号单独处理
    if (perms.includes(adminPerms)) {
      return
    }
    if (!perms.includes(binding.value)) {
      // 隐藏el
      // el.style.display = 'none'
      el.remove()
    }
  }
})
