// mixins 的作用： 针对有复用的逻辑可以进行封装
// mixins 可以封装的逻辑跟组件中script标签里边封装的逻辑一模一样
// mixins 使用方式
// 1.声明mixins
// 2.导入mixins
// 3.混入mixins
// 混入mixins后 组件和mixins这两文件中的数据就可以互相访问了[组件可以使用mixins中数据，mixins可以使用组件内部的数据]

// mixins中的变量和组件中的变量重名的时候。会覆盖 以组件内的为准
// mixins中的方法和组件中的方法重名的时候。会覆盖 以组件内的为准
// 如果mixins中对象类型的配置项（methods、computed、...、data） 如果和组件重名会产生覆盖，以组件内部的为准
// 如果mixins中方法类型的配置项（created、mounted、updated....） 如果和组件重名不会产生覆盖，先执行mixins后执行组件内的

export default {
  data() {
    return {
      mixinsVariable: 'mixins中的变量'
    }
  },
  methods: {
    logMixins() {
      console.log('mixins内的logMixins方法')
    }
  },
  computed: {},
  watch: {},
  components: {},
  created() {
    // console.log('params', this.params)
    // console.log('permission', this.permission)
    console.log('mixins中的created')
  }
}
