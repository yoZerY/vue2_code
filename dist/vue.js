(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  //重写数组部分方法
  var oldArrayProto = Array.prototype; //数组原型

  var newArrayProto = Object.create(oldArrayProto); //会改变原数组的方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

      var ob = this.__ob__; //对新增的值检测

      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      }

      if (inserted) {
        //inserted type Array
        //this 指的是 谁调得方法就是谁
        ob.obServerArray(inserted);
      }

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // Object.defineProperty() 只能劫持已存在得属性 （$set $delete）
      Object.defineProperty(data, '__ob__', {
        //__ob__属性不可枚举
        value: this,
        enumerable: false
      });

      if (Array.isArray(data)) {
        //重写数组方法 7个编译方法 可修改数组本身
        data.__proto__ = newArrayProto;
        this.obServerArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //循环对象劫持属性
        //重新定义属性
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "obServerArray",
      value: function obServerArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(target, key, value) {
    //属性劫持
    observe(value); //递归劫持数据

    Object.defineProperty(target, key, {
      get: function get() {
        //取值get
        console.log("\u53D6\u503Cget:".concat(value));
        return value;
      },
      set: function set(newValue) {
        //设置值set
        console.log("\u8BBE\u7F6E\u503Cset:".concat(newValue));
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data === null) {
      //只对对象进行劫持
      return;
    }

    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    } //如果一个对象已经被劫持 那就不需要再劫持了（添加一个实例 来判断是否劫持过）


    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; //获取所有选项

    if (opts.data) {
      initData(vm);
    }
  }

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key]; //vm._data.xxx
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data; //data 可能是函数 可能是对象

    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; //数据劫持

    observe(data); //把vm.data 用vm代理

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initMixin(Vue) {
    // 给vue添加init方法(初始化方法)
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm);
    };
  }

  function Vue(options) {
    //options为自定义选项
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
