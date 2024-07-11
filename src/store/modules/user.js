export default {
  // 命名空间，别忘了最后的d
  namespaced: true,
  // 模块内的state 写法：推荐是个函数写法。但写对象也行
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters: {

  }
}

// 使用语法：如何在组件中使用子模块的各个数据和方法
// 1.使用state中的数据
// 使用场景：如果组件中只有一处用了state中的数据，可以$store直接方法。
// 如果组件中有多处使用了state中的数据，可以使用辅助函数
// this.$store.state.user.xxx
/**
 *  import { mapState } from 'vuex'
 *  computed:{
 *   ...mapState('模块名',['属性名1','属性名2',....])
 * }
 * */

// 2.使用getters中的数据
// this.$store.getters['user/getters方法名']
/**
 * import {mapGetters} from 'vuex'
 * computed:{
 *  ...mapGetters('模块名',['getters中方法名1',.....])
 * }
 **/

// 3.使用mutations的方法
// this.$store.commit('模块名/方法名',参数) 参数只能传一个
/**
 * import {mapMutations} from 'vuex'
 * methods:{
 *  ...mapMutations('模块名',['方法名1',....])
 * }
 * */

// 4.使用actions的方法
// this.$store.dispatch('模块名/方法名',参数) 参数只能传一个
/**
 * import {mapActions} from 'vuex'
 * methods:{
 *  ...mapActions('模块名',['方法名',....])
 * }
 * */
