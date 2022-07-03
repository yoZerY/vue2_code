import {initMixin} from "./init";
import {initLifeCycle} from "./lifeCycle";
import {nextTick} from "./observe/watcher";
import {gloablApi} from "./gloablApi";


function Vue(options) { //options为自定义选项
    this._init(options)
}

Vue.prototype.$nextTick = nextTick

initMixin(Vue)

initLifeCycle(Vue)


gloablApi(Vue)

export default Vue
