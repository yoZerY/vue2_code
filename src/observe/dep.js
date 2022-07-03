let id = 0

//属性的dep收集Watcher
class Dep {
    constructor() {
        this.id = id++
        this.subs = [] //存放当前属性对应的Watcher
    }

    depend() {
        Dep.target.addDep(this) // watcher内添加DEP
    }

    addSub(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null

let stack = []
export function pushTarget(watcher){
    stack.push(watcher)
    Dep.target = watcher
}
export  function  popTarget(watcher){
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep
