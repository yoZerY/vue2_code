import {initMixin} from "./init";


function Vue(options) { //options为自定义选项
    this._init(options)
}

initMixin(Vue)


export default Vue
