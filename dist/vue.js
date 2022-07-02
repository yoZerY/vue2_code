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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent;
    var root;

    function createAstElement(tag, attrs) {
      return {
        tag: tag,
        attrs: attrs,
        type: ELEMENT_TYPE,
        children: [],
        parent: null
      };
    }

    function start(tag, attrs) {
      var node = createAstElement(tag, attrs);

      if (!root) {
        root = node;
      }

      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }

      stack.push(node);
      currentParent = node;
    }

    function charts(text) {
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }

    function end(tag) {
      stack.pop();
      currentParent = stack[stack.length - 1];
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          //标签名
          attrs: []
        };
        advance(start[0].length);
        var attr;

        var _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //非开始标签得结束
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false;
    }

    while (html) {
      var textEnd = html.indexOf("<");

      if (textEnd === 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      if (textEnd > 0) {
        var text = html.substring(0, textEnd); //文本内容

        if (text) {
          advance(text.length);
          charts(text);
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (e) {
            var _e$split = e.split(':'),
                _e$split2 = _slicedToArray(_e$split, 2),
                key = _e$split2[0],
                value = _e$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    var text = node.text;

    if (node.type === 1) {
      return codeGen(node);
    } else {
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          var index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(children) {
    return children && children.map(function (child) {
      return gen(child);
    }).join(',');
  }

  function codeGen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "', \n    ").concat(ast.attrs.length ? genProps(ast.attrs) : 'null', "\n    ").concat(ast.children.length ? ", ".concat(children) : '', ")");
    return code;
  }

  function compileToFunction(template) {
    //template 转为ast语法树
    var ast = parseHTML(template); //生成render 方法  虚拟DOM

    var code = codeGen(ast);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code);
    return render;
  }

  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }

    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vNode(vm, tag, key, data, children);
  }
  function createTextVNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vNode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function createElm(vNode) {
    var tag = vNode.tag,
        data = vNode.data,
        children = vNode.children,
        text = vNode.text;

    if (typeof tag === 'string') {
      vNode.el = document.createElement(tag);
      patchProps(vNode.el, data);
      children && children.length && children.forEach(function (child) {
        vNode.el.appendChild(createElm(child));
      });
    } else {
      vNode.el = document.createTextNode(text);
    }

    return vNode.el;
  }

  function patchProps(el, data) {
    for (var key in data) {
      if (key === 'style') {
        for (var styleKey in data.style) {
          el.style[styleKey] = data.style[styleKey];
        }
      } else {
        el.setAttribute(key, data[key]);
      }
    }
  }

  function patch(oldVNode, vNode) {
    var isRealElement = oldVNode.nodeType;

    if (isRealElement) {
      var elm = oldVNode;
      var parentEl = elm.parentNode;
      var newEle = createElm(vNode);
      parentEl.insertBefore(newEle, elm.nextSibling);
      parentEl.removeChild(elm);
      return newEle;
    }
  }

  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vNode) {
      // vNode转化为真实DOM
      var vm = this;
      var el = vm.$el;
      vm.$el = patch(el, vNode);
    };

    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (value) {
      if (_typeof(value) === 'object') return value;
      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;

    vm._update(vm._render());
  } // 1.生成相应数据  2.模板转换成AST语法树   3.ast转换成render函数
  // render 生成虚拟节点
  // 虚拟节点创造真实DOM

  function initMixin(Vue) {
    // 给vue添加init方法(初始化方法)
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; //初始化状态

      initState(vm);

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var opts = vm.$options;

      if (!opts.render) {
        //是否有render函数
        var template;

        if (!opts.template && el) {
          //是否有template
          template = el.outerHTML;
        } else {
          if (el) {
            template = opts.template;
          }
        } //有template


        if (template) {
          //template 模板编译
          var render = compileToFunction(template);
          opts.render = render;
        }
      }

      mountComponent(vm, el);
    };
  }

  function Vue(options) {
    //options为自定义选项
    this._init(options);
  }

  initMixin(Vue);
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
