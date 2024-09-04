// 放置全局组件
import Vue from "vue";

import SvgIcon from '@/components/SvgIcon'
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requestAll = requireContext => {
    requestContext.keys().map(requireContext)
}

requestAll(req)

//最终实现的效果：<svg-icon icon-class="svg图标的名称" />   =>渲染出来一个图标   