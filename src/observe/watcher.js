import Dep from "./dep";

let id = 0

//每个属性有Dep（属性石被观察者） watcher就是观察者（属性变化就会通知 watcher）  观察者模式

// 每个组件都有单独的watcher
class Watcher {
    constructor(vm, fn, options) {
        this.id = id++
        this.renderWatcher = options //渲染 Watcher
        this.getter = fn
        this.deps = [] //后续实现计算属性和清理工作
        this.depsId = new Set()
        this.get()
    }

    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this) //dep内存储 watcher
        }
    }

    get() {
        Dep.target = this  //创建渲染watcher的时候把当前的渲染watcher放在Dep.target上
        this.getter()
        Dep.target = null
    }

    update() {
        queueWatcher(this) //把当前watcher存起来
    }

    run() {
        this.get()
    }
}

//========================queueWatcher====================
let queue = []
let has = {}
let pending = false

function flashQueue() {
    let copyQueue = queue.slice(0)
    queue = []
    has = {}
    pending = false
    copyQueue.forEach(watcher => watcher.run())
}

function queueWatcher(watcher) {
    const {id} = watcher
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true

        //多次更新最终只更新一次
        if (!pending) {
            nextTick(flashQueue, 0)
            pending = true
        }
    }
}

//========================nextTick=========================
let callbacks = []
let waiting = false

function flushCallbacks() {
    waiting = false
    let cbs = callbacks.slice(0)
    callbacks = []
    cbs.forEach(cb => cb())
}

let timeFunc
if (Promise) {
    timeFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    let observe = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, {
        characterData: true
    })
    timeFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) {
    timeFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timeFunc = () => {
        setTimeout(flushCallbacks)
    }
}

export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        timeFunc()
        waiting = true
    }
}

export default Watcher

// 给每个属性增加一个dep 目的是收集watcher
