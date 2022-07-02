import {initState} from "./state";

export function initMixin(Vue) { // 给vue添加init方法(初始化方法)
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        //初始化状态
        initState(vm)
    }

}

