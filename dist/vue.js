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

  //????????????????????????
  var oldArrayProto = Array.prototype; //????????????

  var newArrayProto = Object.create(oldArrayProto); //???????????????????????????

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

      var ob = this.__ob__; //?????????????????????

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
        //this ????????? ????????????????????????
        ob.obServerArray(inserted);
      }

      return result;
    };
  });

  var id$1 = 0; //?????????dep??????Watcher

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; //???????????????????????????Watcher
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this); // watcher?????????DEP
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    stack.push(watcher);
    Dep.target = watcher;
  }
  function popTarget(watcher) {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // Object.defineProperty() ?????????????????????????????? ???$set $delete???
      Object.defineProperty(data, '__ob__', {
        //__ob__??????????????????
        value: this,
        enumerable: false
      });

      if (Array.isArray(data)) {
        //?????????????????? 7??????????????? ?????????????????????
        data.__proto__ = newArrayProto;
        this.obServerArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        //????????????????????????
        //??????????????????
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "obServerArray",
      value: function obServerArray(data) {
        data.forEach(function (item) {
          return observe$1(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(target, key, value) {
    //????????????
    observe$1(value); //??????????????????

    var dep = new Dep();
    Object.defineProperty(target, key, {
      get: function get() {
        //??????get
        // console.log(`??????get:${value}`);
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function set(newValue) {
        //?????????set
        // console.log(`?????????set:${newValue}`);
        if (newValue === value) return;
        observe$1(newValue);
        value = newValue;
        dep.notify(); //??????Dep??????
      }
    });
  }
  function observe$1(data) {
    if (_typeof(data) !== 'object' || data === null) {
      //????????????????????????
      return;
    }

    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    } //????????????????????????????????? ???????????????????????????????????????????????? ???????????????????????????


    return new Observer(data);
  }

  var id = 0; //???????????????Dep??????????????????????????? watcher?????????????????????????????????????????? watcher???  ???????????????
  // ???????????????????????????watcher

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, options, cb) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.renderWatcher = options; //?????? Watcher

      if (typeof fn === 'string') {
        this.getter = function () {
          return vm[fn];
        };
      } else {
        this.getter = fn;
      }

      this.deps = []; //???????????????????????????????????????

      this.depsId = new Set();
      this.lazy = options.lazy;
      this.dirty = this.lazy;
      this.user = options.user; // ???????????????watch

      this.cb = cb;
      this.vm = vm;
      this.value = this.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this); //dep????????? watcher
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); //????????????watcher???????????????????????????watcher??????Dep.target???

        var value = this.getter.call(this.vm);
        popTarget();
        return value;
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatcher(this); //?????????watcher?????????
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newVal = this.get();

        if (this.user) {
          this.cb.call(this.vm, newVal, oldValue);
        } else {
          this.get();
        }
      }
    }]);

    return Watcher;
  }(); //========================queueWatcher====================


  var queue = [];
  var has = {};
  var pending = false;

  function flashQueue() {
    var copyQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    copyQueue.forEach(function (watcher) {
      return watcher.run();
    });
  }

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true; //?????????????????????????????????

      if (!pending) {
        nextTick(flashQueue);
        pending = true;
      }
    }
  } //========================nextTick=========================


  var callbacks = [];
  var waiting = false;

  function flushCallbacks() {
    waiting = false;
    var cbs = callbacks.slice(0);
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }

  var timeFunc;

  if (Promise) {
    timeFunc = function timeFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observe = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observe.observe(textNode, {
      characterData: true
    });

    timeFunc = function timeFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timeFunc = function timeFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timeFunc = function timeFunc() {
      setTimeout(flushCallbacks);
    };
  }

  function nextTick(cb) {
    callbacks.push(cb);

    if (!waiting) {
      timeFunc();
      waiting = true;
    }
  }
   // ???????????????????????????dep ???????????????watcher

  function initState(vm) {
    var opts = vm.$options; //??????????????????

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
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
    var data = vm.$options.data; //data ??????????????? ???????????????

    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; //????????????

    observe$1(data); //???vm.data ???vm??????

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {};

    for (var computedKey in computed) {
      var userDef = computed[computedKey];
      var fn = typeof userDef === 'function' ? userDef : userDef.get;
      watchers[computedKey] = new Watcher(vm, fn, {
        lazy: true
      });
      defineComputed(vm, computedKey, userDef);
    }
  }

  function defineComputed(vm, key, userDef) {
    var setter = userDef.set || function () {};

    Object.defineProperty(vm, key, {
      get: createComputedGetter(key),
      set: setter
    });
  }

  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key];

      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  }

  function initWatch(vm) {
    var watch = vm.$options.watch;
    console.log(watch);

    for (var watchKey in watch) {
      var w = watch[watchKey];

      if (Array.isArray(w)) {
        for (var i = 0; i < w.length; i++) {
          createWatch(vm, watchKey, w[i]);
        }
      } else {
        createWatch(vm, watchKey, w);
      }
    }
  }

  function createWatch(vm, key, fn) {
    if (typeof fn === 'string') {
      fn = vm[fn];
    }

    return vm.$watch(key, fn);
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
          //?????????
          attrs: []
        };
        advance(start[0].length);
        var attr;

        var _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //????????????????????????
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
        var text = html.substring(0, textEnd); //????????????

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
    //template ??????ast?????????
    var ast = parseHTML(template); //??????render ??????  ??????DOM

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
      // vNode???????????????DOM
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
      return value;
    };

    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;

    var updateComponent = function updateComponent() {
      //????????????
      vm._update(vm._render());
    };

    new Watcher(vm, updateComponent, true);
  }
  function callHook(vm, hook) {
    var hookArr = vm.$options[hook];

    if (hookArr) {
      hookArr.forEach(function (e) {
        return e.call(vm);
      });
    }
  } // 1.??????????????????  2.???????????????AST?????????   3.ast?????????render??????
  // render ??????????????????
  // ????????????????????????DOM

  var strats = {};
  var LIFECYCLE = ['beforeCreate', 'created'];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (parent, child) {
      if (child) {
        if (parent) {
          return parent.concat(child);
        } else {
          return [child];
        }
      } else {
        return parent;
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};

    for (var parentKey in parent) {
      mergeField(parentKey);
    }

    for (var childKey in child) {
      if (!parent.hasOwnProperty(childKey)) {
        mergeField(childKey);
      }
    }

    function mergeField(key) {
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }

    return options;
  }

  function initMixin(Vue) {
    // ???vue??????init??????(???????????????)
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(this.constructor.options, options);
      callHook(vm, 'beforeCreate'); //???????????????

      initState(vm);
      callHook(vm, 'created');

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var opts = vm.$options;

      if (!opts.render) {
        //?????????render??????
        var template;

        if (!opts.template && el) {
          //?????????template
          template = el.outerHTML;
        } else {
          if (el) {
            template = opts.template;
          }
        } //???template


        if (template) {
          //template ????????????
          var render = compileToFunction(template);
          opts.render = render;
        }
      }

      mountComponent(vm, el);
    };
  }

  function globalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function Vue(options) {
    //options??????????????????
    this._init(options);
  }

  Vue.prototype.$nextTick = nextTick;
  initMixin(Vue);
  initLifeCycle(Vue);
  globalApi(Vue);

  Vue.prototype.$watch = function (fn, cb) {
    console.log('fn', fn);
    console.log('cb', cb);
    new Watcher(this, fn, {
      user: true
    }, cb);
  };

  return Vue;

}));
//# sourceMappingURL=vue.js.map
