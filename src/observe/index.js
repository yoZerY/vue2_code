import {newArrayProto} from "./array";

class Observer {
    constructor(data) {
        // Object.defineProperty() 只能劫持已存在得属性 （$set $delete）

        Object.defineProperty(data, '__ob__', { //__ob__属性不可枚举
            value: this,
            enumerable: false
        })

        if (Array.isArray(data)) {
            //重写数组方法 7个编译方法 可修改数组本身
            data.__proto__ = newArrayProto
            this.obServerArray(data)
        } else {
            this.walk(data)
        }
    }

    walk(data) { //循环对象劫持属性
        //重新定义属性
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }

    obServerArray(data) {
        data.forEach(item => observe(item))
    }
}

export function defineReactive(target, key, value) { //属性劫持
    observe(value) //递归劫持数据
    Object.defineProperty(target, key, {
        get() { //取值get
            console.log(`取值get:${value}`);
            return value
        },
        set(newValue) { //设置值set
            console.log(`设置值set:${newValue}`);
            if (newValue === value) return
            observe(newValue)
            value = newValue
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) { //只对对象进行劫持
        return
    }
    if (data.__ob__ instanceof Observer) {
        return data.__ob__
    }
    //如果一个对象已经被劫持 那就不需要再劫持了（添加一个实例 来判断是否劫持过）
    return new Observer(data)
}
