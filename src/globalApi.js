import Vue from "./index";
import {mergeOptions} from "./utils";


export function globalApi(Vue) {
    Vue.options = {}

    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
        return this
    }
}
