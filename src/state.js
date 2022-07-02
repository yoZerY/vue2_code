import {observe} from "./observe/index";

export function initState(vm) {
    const opts = vm.$options //获取所有选项
    if (opts.data) {
        initData(vm)
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key] //vm._data.xxx
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}

function initData(vm) {
    let data = vm.$options.data //data 可能是函数 可能是对象
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data
    //数据劫持
    observe(data)

    //把vm.data 用vm代理
    for (const key in data) {
        proxy(vm, '_data', key)
    }

}
