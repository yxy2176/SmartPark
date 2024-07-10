// 1.声明文件
// 2.导入
// 3.混入
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('menu', ['permission'])
  },
  methods: {
    hasPermission(btnPerms) {
      return this.permission.includes(btnPerms)
    }
  }
}
