import {observe} from "./observe/index";
import Watcher from "./observe/watcher";
import Dep from "./observe/dep";

export function initState(vm) {
    const opts = vm.$options //获取所有选项
    if (opts.data) {
        initData(vm)
    }

    if (opts.computed) {
        initComputed(vm)
    }

    if (opts.watch) {
        initWatch(vm)
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

function initComputed(vm) {
    const {computed} = vm.$options
    const watchers = vm._computedWatchers = {}
    for (const computedKey in computed) {
        let userDef = computed[computedKey]
        const fn = typeof userDef === 'function' ? userDef : userDef.get
        watchers[computedKey] = new Watcher(vm, fn, {lazy: true})
        defineComputed(vm, computedKey, userDef)
    }
}

function defineComputed(vm, key, userDef) {
    const setter = userDef.set || (() => {
    })
    Object.defineProperty(vm, key, {
        get: createComputedGetter(key),
        set: setter
    })
}

function createComputedGetter(key) {
    return function () {
        const watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            watcher.evaluate()
        }
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
}


function initWatch(vm) {
    let watch = vm.$options.watch
    console.log(watch);
    for (const watchKey in watch) {
        const w = watch[watchKey]
        if (Array.isArray(w)) {
            for (let i = 0; i < w.length; i++) {
                createWatch(vm, watchKey, w[i])
            }
        } else {
            createWatch(vm, watchKey, w)
        }
    }
}

function createWatch(vm, key, fn) {
    if (typeof fn === 'string') {
        fn = vm[fn]
    }
    return vm.$watch(key, fn)
}
