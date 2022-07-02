//重写数组部分方法

let oldArrayProto = Array.prototype //数组原型
export let newArrayProto = Object.create(oldArrayProto)
//会改变原数组的方法
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach(method => {
    newArrayProto[method] = function (...args) {
        const result = oldArrayProto[method].call(this, ...args)
        let ob = this.__ob__
        //对新增的值检测
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)
            default:
                break
        }
        if (inserted) { //inserted type Array
            //this 指的是 谁调得方法就是谁
            ob.obServerArray(inserted)
        }

        return result
    }
})
