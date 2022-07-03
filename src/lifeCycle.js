import {createElementVNode, createTextVNode} from "./vdom";
import Watcher from "./observe/watcher";

function createElm(vNode) {
    const {tag, data, children, text} = vNode
    if (typeof tag === 'string') {
        vNode.el = document.createElement(tag)
        patchProps(vNode.el, data)
        children && children.length && children.forEach(child => {
            vNode.el.appendChild(createElm(child))
        })
    } else {
        vNode.el = document.createTextNode(text)
    }
    return vNode.el
}

function patchProps(el, data) {
    for (const key in data) {
        if (key === 'style') {
            for (const styleKey in data.style) {
                el.style[styleKey] = data.style[styleKey]
            }
        } else {
            el.setAttribute(key, data[key])
        }
    }
}

function patch(oldVNode, vNode) {
    const isRealElement = oldVNode.nodeType
    if (isRealElement) {
        const elm = oldVNode
        const parentEl = elm.parentNode
        let newEle = createElm(vNode)
        parentEl.insertBefore(newEle, elm.nextSibling)
        parentEl.removeChild(elm)

        return newEle
    } else {

    }
}

export function initLifeCycle(Vue) {
    Vue.prototype._update = function (vNode) { // vNode转化为真实DOM
        const vm = this
        const el = vm.$el
        vm.$el = patch(el, vNode)
    }
    Vue.prototype._c = function () {
        return createElementVNode(this, ...arguments)
    }
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments)
    }
    Vue.prototype._s = function (value) {
        if (typeof value === 'object') return value
        return value
    }
    Vue.prototype._render = function () {
        return this.$options.render.call(this)
    }
}

export function mountComponent(vm, el) {
    vm.$el = el
    const updateComponent = () => {
        //更新组件
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent, true)
}

export function  callHook(vm,hook){
    const hookArr = vm.$options[hook]
    if(hookArr){
        hookArr.forEach(e => e.call(vm))
    }
}

// 1.生成相应数据  2.模板转换成AST语法树   3.ast转换成render函数
// render 生成虚拟节点
// 虚拟节点创造真实DOM
