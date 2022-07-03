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
export default Dep
