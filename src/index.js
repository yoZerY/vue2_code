import {initMixin} from "./init";
import {initLifeCycle} from "./lifeCycle";


function Vue(options) { //options为自定义选项
    this._init(options)
}

initMixin(Vue)

initLifeCycle(Vue)

export default Vue
