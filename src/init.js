import {initState} from "./state";
import {compileToFunction} from "./compiler/index";
import {mountComponent} from "./lifeCycle";

export function initMixin(Vue) { // 给vue添加init方法(初始化方法)
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        //初始化状态
        initState(vm)

        if (options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el)

        let opts = vm.$options
        if (!opts.render) { //是否有render函数
            let template
            if (!opts.template && el) { //是否有template
                template = el.outerHTML
            } else {
                if (el) {
                    template = opts.template
                }
            }
            //有template
            if (template) {
                //template 模板编译
                const render = compileToFunction(template)
                opts.render = render
            }
        }
        mountComponent(vm, el)
    }

}

