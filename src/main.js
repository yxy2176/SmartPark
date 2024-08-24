// 导入Vue构造函数
import Vue from "vue";
// 类似于 reset.css 清空浏览器的默认样式
import "normalize.css/normalize.css";
// 引入element-ui 组件
import ElementUI from "element-ui";
// 引入element-ui的样式文件
import "element-ui/lib/theme-chalk/index.css";

// 引入样式文件
import "@/styles/index.scss"; // global css

//将滚动事件处理为被动事件
import 'default-passive-events'

// 引入App根组件
import App from "./App";

// 引入Vuex
import store from "./store";

// 引入Vue-Route
import router from "./router";

// 注册svg
import "@/icons";

// 导入permission.js
// import 除了导入某个成员之外 还可以执行导入的文件
import "./permission";

// 导入自定义指令
import "@/directive";

// import "./registerMicroApp.js";

// 结果： 把element-ui中导出的所有组件 注册成全局组件
Vue.use(ElementUI);

// 上线之后如果有警告 要不要展示
Vue.config.productionTip = false;
console.log("BASE_API", process.env);

// vue实例化
// 注入 router 和 store实例 方便在项目中使用 this.$router  this.$store
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
