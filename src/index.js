import {initMixin} from "./init";
import {initLifeCycle} from "./lifeCycle";
import Watcher, {nextTick} from "./observe/watcher";
import {globalApi} from "./globalApi";


function Vue(options) { //options为自定义选项
    this._init(options)
}

Vue.prototype.$nextTick = nextTick

initMixin(Vue)

initLifeCycle(Vue)

globalApi(Vue)

Vue.prototype.$watch = function (fn, cb, op = {}) {
    console.log('fn', fn);
    console.log('cb', cb);
    new Watcher(this, fn, {user: true}, cb)
}


export default Vue
