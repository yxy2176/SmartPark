// 放置全局指令
import Vue from "vue";
import store from '@/store'

const adminPerms = '*:*:*'

Vue.directive('permission', {
    // el：使用自定义指令的dom元素
    // binding：对象   =====> binding.value可以接受到外部传过来的值
    inserted(el, binding) {
        // console.log(el, binding.value);
        const perms = store.state.menu.getUserPermissions
        if (perms.includes(binding.value) && perms.includes(adminPerms)) {
            el.remove()
        }
    }
})