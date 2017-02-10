/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 173);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(35)('wks')
  , uid        = __webpack_require__(26)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(17)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(5)
  , IE8_DOM_DEFINE = __webpack_require__(53)
  , toPrimitive    = __webpack_require__(38)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(3) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(16)
  , hide      = __webpack_require__(9)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(72);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(4)
  , createDesc = __webpack_require__(25);
module.exports = __webpack_require__(3) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(65)
  , defined = __webpack_require__(27);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(78), __esModule: true };

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(73);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(71);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(29);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(29);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(30);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(58)
  , enumBugKeys = __webpack_require__(32);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(4).f
  , has = __webpack_require__(12)
  , TAG = __webpack_require__(1)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _wolfy87Eventemitter = __webpack_require__(109);

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TIME = {
	bodys: [],
	delta: 16
};

var stop = false;
TIME.addBody = function (timeBody) {
	this.bodys.push(timeBody);
};

TIME.removeBody = function (timeBody) {
	var index = this.bodys.indexOf(timeBody);

	if (index !== -1) {
		this.bodys.splice(index, 1);
	}
};
TIME.tick = function () {
	var now = new Date().getTime();
	var last = now;
	var delta;
	return function () {
		delta = now - last;
		delta = delta > 500 ? 30 : delta < 16 ? 16 : delta;
		TIME.delta = delta;
		last = now;

		TIME.handleFrame(delta);
		if (!stop) {
			requestAnimationFrame(TIME.tick);
		}
	};
}();

TIME.start = function () {
	stop = false;
	this.tick();
};

TIME.stop = function () {
	stop = true;
};

TIME.handleFrame = function (delta) {

	TIME.bodys.forEach(function (body) {
		if (!body.isStop) {
			body.ticks.forEach(function (tick) {
				tick.fn && tick.fn(delta);
			});
		}
	});

	TWEEN.update();
};

window.TIME = TIME;

var Time = function (_EventEmitter) {
	(0, _inherits3.default)(Time, _EventEmitter);

	function Time() {
		(0, _classCallCheck3.default)(this, Time);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Time.__proto__ || (0, _getPrototypeOf2.default)(Time)).call(this));

		_this.ticks = [];
		_this.tweens = [];
		_this.isStop = false;
		TIME.addBody(_this);
		return _this;
	}

	(0, _createClass3.default)(Time, [{
		key: 'destory',
		value: function destory() {
			TIME.removeBody(this);
		}
	}, {
		key: 'addTick',
		value: function addTick(fn) {
			var tick = { 'fn': fn.bind(this) };

			tick.isStop = false;
			this.ticks.push(tick);
			return tick;
		}
	}, {
		key: 'removeTick',
		value: function removeTick(tick) {
			if (!tick) {
				this.ticks = [];
				return;
			}

			var index = this.ticks.indexOf(tick);

			if (index !== -1) {
				this.ticks.splice(index, 1);
			}
		}
	}, {
		key: 'addTween',
		value: function addTween(tween) {
			this.tweens.push(tween);
		}
	}, {
		key: 'removeTween',
		value: function removeTween(tween) {
			if (!tween) {
				this.tween = [];
				return;
			}

			var index = this.tweens.indexOf(tween);

			if (index !== -1) {
				this.tweens.splice(index, 1);
			}
		}
	}, {
		key: 'stop',
		value: function stop() {
			this.isStop = true;
			this.tweens.forEach(function (tween) {
				tween.stop();
			});
		}
	}, {
		key: 'start',
		value: function start() {
			this.isStop = false;
			this.tweens.forEach(function (tween) {
				tween.start();
			});
		}
	}]);
	return Time;
}(_wolfy87Eventemitter2.default);

window.Time = Time;

for (var i = 0; i < 10000; i += 100) {
	window['TIME_' + i] = window.env === 'develop' ? 0 : i;
}

exports.default = Time;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(5)
  , dPs         = __webpack_require__(93)
  , enumBugKeys = __webpack_require__(32)
  , IE_PROTO    = __webpack_require__(34)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(31)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(52).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(75);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(74);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 33 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(35)('keys')
  , uid    = __webpack_require__(26);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(27);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(13);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(0)
  , LIBRARY        = __webpack_require__(24)
  , wksExt         = __webpack_require__(40)
  , defineProperty = __webpack_require__(4).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(1);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(18)
  , TAG = __webpack_require__(1)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(16)
  , call        = __webpack_require__(88)
  , isArrayIter = __webpack_require__(87)
  , anObject    = __webpack_require__(5)
  , toLength    = __webpack_require__(46)
  , getIterFn   = __webpack_require__(99)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(24)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(61)
  , hide           = __webpack_require__(9)
  , has            = __webpack_require__(12)
  , Iterators      = __webpack_require__(19)
  , $iterCreate    = __webpack_require__(89)
  , setToStringTag = __webpack_require__(21)
  , getPrototypeOf = __webpack_require__(57)
  , ITERATOR       = __webpack_require__(1)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(33)
  , createDesc     = __webpack_require__(25)
  , toIObject      = __webpack_require__(10)
  , toPrimitive    = __webpack_require__(38)
  , has            = __webpack_require__(12)
  , IE8_DOM_DEFINE = __webpack_require__(53)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(3) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(36)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 47 */
/***/ (function(module, exports) {



/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(97)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(44)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(100);
var global        = __webpack_require__(2)
  , hide          = __webpack_require__(9)
  , Iterators     = __webpack_require__(19)
  , TO_STRING_TAG = __webpack_require__(1)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(142), __esModule: true };

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(3) && !__webpack_require__(17)(function(){
  return Object.defineProperty(__webpack_require__(31)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(26)('meta')
  , isObject = __webpack_require__(13)
  , has      = __webpack_require__(12)
  , setDesc  = __webpack_require__(4).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(17)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(58)
  , hiddenKeys = __webpack_require__(32).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 56 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(12)
  , toObject    = __webpack_require__(37)
  , IE_PROTO    = __webpack_require__(34)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(12)
  , toIObject    = __webpack_require__(10)
  , arrayIndexOf = __webpack_require__(84)(false)
  , IE_PROTO     = __webpack_require__(34)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(6)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(17);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var hide = __webpack_require__(9);
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(16)
  , invoke             = __webpack_require__(86)
  , html               = __webpack_require__(52)
  , cel                = __webpack_require__(31)
  , global             = __webpack_require__(2)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(18)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = __webpack_require__(64);

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _time = __webpack_require__(23);

var _time2 = _interopRequireDefault(_time);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Stage = function (_Time) {
	(0, _inherits3.default)(Stage, _Time);

	function Stage() {
		(0, _classCallCheck3.default)(this, Stage);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Stage.__proto__ || (0, _getPrototypeOf2.default)(Stage)).call(this));

		_this.objects = {};
		_this.state;
		_this.isInit = false;
		_this.scene;

		_this.scene = M3.scene;
		_this.camera = M3.camera;
		return _this;
	}

	(0, _createClass3.default)(Stage, [{
		key: 'load',
		value: function load(onProgress, onSuccess) {}
	}, {
		key: 'init',
		value: function init(onProgress, onSuccess) {}
	}, {
		key: 'resize',
		value: function resize() {}
	}, {
		key: 'remove',
		value: function remove() {
			for (var name in this.objects) {
				this.scene.remove(this.objects[name]);
			}
		}
	}, {
		key: 'destory',
		value: function destory() {
			(0, _get3.default)(Stage.prototype.__proto__ || (0, _getPrototypeOf2.default)(Stage.prototype), 'destory', this).call(this);
			this.remove();
			for (var name in this.objects) {
				delete this.objects[name];
			}
		}
	}]);
	return Stage;
}(_time2.default);

exports.default = Stage;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = __webpack_require__(139);

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(18);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(18);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global      = __webpack_require__(2)
  , core        = __webpack_require__(0)
  , dP          = __webpack_require__(4)
  , DESCRIPTORS = __webpack_require__(3)
  , SPECIES     = __webpack_require__(1)('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var buildPath = './build/';
var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];

var selectConf = {
	logo: 'M22.8,41H3c-1.7,0-3,1.4-3,3v15.1h3.6V45.2c0-0.7,0.5-1.2,1.2-1.2h6.3v15.2h3.6V44H21c0.7,0,1.2,0.5,1.2,1.2v13.9h3.5V44C25.8,42.4,24.4,41,22.8,41zM29.6,44v12.1c0,1.7,1.3,3,3,3H48v-2.9H34.3c-0.7,0-1.2-0.5-1.2-1.2v-3.4h14.1v-3H33.1v-3.4c0-0.7,0.5-1.2,1.2-1.2H48V41H32.6C30.9,41,29.6,42.4,29.6,44zM75.3,41H59.4v2.9h13.1L59.9,55.1c-2,1.7-0.7,4,1,4H77v-2.9H63.6L76.2,45C78.3,43.1,77,41,75.3,41zM96.5,41v13.9c0,0.7-0.5,1.2-1.2,1.2l0,0H85.1l0,0c-0.7,0-1.2-0.5-1.2-1.2V41h-3.5v15.1c0,1.7,1.3,3,3,3H97c1.7,0,3-1.3,3-3V41H96.5zM51.8 41L55.5 41L55.5 59.1L51.8 59.1z',

	products: [],
	logoImg: buildPath + __webpack_require__(111),
	particleMap: buildPath + __webpack_require__(112)
};

var mx6 = 'M0,66.5h1.9l0,0V37.9l15.4,28.6h1.9l15.2-28.6h0.3v28.6h1.9V34.8h-3L18.2,64L3,34.8H0V66.5zM41.4,34.8l12.9,14.1l1.6-1.4L43.6,34.8M73.1,34.8L60.2,48.9l-1.6-1.4l12.2-12.7H73.1zM41.4,66.5l12.9-14.1l1.6,1.4L43.6,66.5M73.1,66.5L60.2,52.4l-1.6,1.4l12.2,12.7H73.1zM88.7,66.5c-4.1,0-6.9-1.1-8.5-3.3c-1.4-2-2-4.8-2-9.2c0-8,1-12.4,3.3-15.1c2.5-2.8,6.7-4,14-4c0.2,0,0.5,0,1.8,0l0,0l0.1,1.3l-1.7,0c-7.8,0.2-15.1,0.4-15.7,11.7l0,0.6l0.7-0.1c2.7-0.3,6.4-0.7,8.8-0.7c6.5,0,10.5,1.5,10.5,9.2c0,3.7-1,6.2-3,7.6C95.2,65.8,92.6,66.5,88.7,66.5z M80,50.3c-0.1,1.8-0.1,3-0.1,4.3c0,5.2,1,10.5,8.7,10.5c7,0,9.7-2.3,9.7-8.3c0-3.2-0.8-5.2-2.6-6.4c-1.5-1-3.6-1.4-7.2-1.4c-1.6,0-4.3,0.2-8.1,0.8L80,49.8L80,50.3z';

products.forEach(function (productName) {
	selectConf.products.push({ "name": productName, svgString: mx6 });
});

exports.default = selectConf;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = __webpack_require__(64);

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _time = __webpack_require__(23);

var _time2 = _interopRequireDefault(_time);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var View = function (_Time) {
    (0, _inherits3.default)(View, _Time);

    function View(viewManager) {
        (0, _classCallCheck3.default)(this, View);

        var _this = (0, _possibleConstructorReturn3.default)(this, (View.__proto__ || (0, _getPrototypeOf2.default)(View)).call(this));

        _this.viewManager = viewManager;
        _this.stages = [];
        _this.active = false;
        return _this;
    }

    (0, _createClass3.default)(View, [{
        key: 'activate',
        value: function activate(data) {}
    }, {
        key: 'inactivate',
        value: function inactivate(data) {}
    }, {
        key: 'addStage',
        value: function addStage(stage) {}
    }, {
        key: 'resize',
        value: function resize() {}
    }, {
        key: 'distroy',
        value: function distroy() {
            (0, _get3.default)(View.prototype.__proto__ || (0, _getPrototypeOf2.default)(View.prototype), 'distroy', this).call(this);
            this.viewManager.removeView(this);
        }
    }]);
    return View;
}(_time2.default);

exports.default = View;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(81), __esModule: true };

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(101);
var $Object = __webpack_require__(0).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(102);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(103);
module.exports = __webpack_require__(0).Object.getPrototypeOf;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(104);
module.exports = __webpack_require__(0).Object.setPrototypeOf;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(47);
__webpack_require__(48);
__webpack_require__(49);
__webpack_require__(105);
module.exports = __webpack_require__(0).Promise;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(106);
__webpack_require__(47);
__webpack_require__(107);
__webpack_require__(108);
module.exports = __webpack_require__(0).Symbol;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(48);
__webpack_require__(49);
module.exports = __webpack_require__(40).f('iterator');

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(10)
  , toLength  = __webpack_require__(46)
  , toIndex   = __webpack_require__(98);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(20)
  , gOPS    = __webpack_require__(56)
  , pIE     = __webpack_require__(33);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 86 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(19)
  , ITERATOR   = __webpack_require__(1)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(5);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create         = __webpack_require__(28)
  , descriptor     = __webpack_require__(25)
  , setToStringTag = __webpack_require__(21)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(9)(IteratorPrototype, __webpack_require__(1)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(1)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(20)
  , toIObject = __webpack_require__(10);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , macrotask = __webpack_require__(62).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(18)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(4)
  , anObject = __webpack_require__(5)
  , getKeys  = __webpack_require__(20);

module.exports = __webpack_require__(3) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(10)
  , gOPN      = __webpack_require__(55).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(13)
  , anObject = __webpack_require__(5);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(16)(Function.call, __webpack_require__(45).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(5)
  , aFunction = __webpack_require__(30)
  , SPECIES   = __webpack_require__(1)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(36)
  , defined   = __webpack_require__(27);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(36)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(42)
  , ITERATOR  = __webpack_require__(1)('iterator')
  , Iterators = __webpack_require__(19);
module.exports = __webpack_require__(0).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(83)
  , step             = __webpack_require__(67)
  , Iterators        = __webpack_require__(19)
  , toIObject        = __webpack_require__(10);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(44)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(28)});

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(6);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(3), 'Object', {defineProperty: __webpack_require__(4).f});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(37)
  , $getPrototypeOf = __webpack_require__(57);

__webpack_require__(59)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(6);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(95).set});

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY            = __webpack_require__(24)
  , global             = __webpack_require__(2)
  , ctx                = __webpack_require__(16)
  , classof            = __webpack_require__(42)
  , $export            = __webpack_require__(6)
  , isObject           = __webpack_require__(13)
  , aFunction          = __webpack_require__(30)
  , anInstance         = __webpack_require__(51)
  , forOf              = __webpack_require__(43)
  , speciesConstructor = __webpack_require__(96)
  , task               = __webpack_require__(62).set
  , microtask          = __webpack_require__(92)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(60)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(21)($Promise, PROMISE);
__webpack_require__(68)(PROMISE);
Wrapper = __webpack_require__(0)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(90)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(12)
  , DESCRIPTORS    = __webpack_require__(3)
  , $export        = __webpack_require__(6)
  , redefine       = __webpack_require__(61)
  , META           = __webpack_require__(54).KEY
  , $fails         = __webpack_require__(17)
  , shared         = __webpack_require__(35)
  , setToStringTag = __webpack_require__(21)
  , uid            = __webpack_require__(26)
  , wks            = __webpack_require__(1)
  , wksExt         = __webpack_require__(40)
  , wksDefine      = __webpack_require__(39)
  , keyOf          = __webpack_require__(91)
  , enumKeys       = __webpack_require__(85)
  , isArray        = __webpack_require__(66)
  , anObject       = __webpack_require__(5)
  , toIObject      = __webpack_require__(10)
  , toPrimitive    = __webpack_require__(38)
  , createDesc     = __webpack_require__(25)
  , _create        = __webpack_require__(28)
  , gOPNExt        = __webpack_require__(94)
  , $GOPD          = __webpack_require__(45)
  , $DP            = __webpack_require__(4)
  , $keys          = __webpack_require__(20)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(55).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(33).f  = $propertyIsEnumerable;
  __webpack_require__(56).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(24)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(9)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39)('asyncIterator');

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(39)('observable');

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function (exports) {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return EventEmitter;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(this || {}));


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = __webpack_require__(29);

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = __webpack_require__(41);

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadedCache = {};

var Loader = function () {
	function Loader() {
		(0, _classCallCheck3.default)(this, Loader);
	}

	(0, _createClass3.default)(Loader, [{
		key: 'calculateSize',
		value: function calculateSize(loadParams) {
			var totalSize = 0;
			var loadTasks = this._getLoadTasks(loadParams);

			for (var i = 0; i < loadTasks.length; i++) {
				totalSize += loadTasks[i].size;
			}
			return totalSize;
		}
	}, {
		key: 'load',
		value: function load(loadParams, onProgress) {
			var that = this;
			return new _promise2.default(function (onLoad, reject) {
				var loadedCount = 0;
				var totalSize = 0;
				var loadedSize = 0;
				var loadTasks = [];
				var loadTask = void 0;

				loadTasks = that._getLoadTasks(loadParams);

				function getLoadedSize() {
					var loadedSize = 0;
					loadTasks.forEach(function (_loadTask) {
						loadedSize += _loadTask.loaded;
					});
					return loadedSize;
				}
				for (var i = 0; i < loadTasks.length; i++) {
					loadTask = loadTasks[i];
					loadTask.loaded = 0;
					totalSize += loadTask.size;

					if (loadedCache[loadTask.url]) {
						loadedCount++;
						loadTask.loaded = loadTask.size;
						continue;
					}
					(function (loadTask) {
						loadMethod[loadTask.type](loadTask.url, function (res) {
							loadedCount++;
							loadedCache[loadTask.url] = res;
							loadTask.loaded = loadTask.size;

							if (getLoadedSize() / totalSize === 1 && loadedCount === loadTasks.length) {
								onLoad(that._getResults(loadParams));
							}
						}, function (progress) {
							loadTask.loaded = loadTask.size * progress;
							onProgress(getLoadedSize() / totalSize);
						});
					})(loadTask);
				}
			});
		}
	}, {
		key: '_getLoaderType',
		value: function _getLoaderType(ext) {
			var typeExtMap = {
				'img': /(jpg|jpeg|gif|png)/,
				'json': /json/,
				'js': /js/
			};

			for (var type in typeExtMap) {
				if (typeExtMap[type].test(ext)) {
					return type;
				}
			}
		}
	}, {
		key: '_getLoadTasks',
		value: function _getLoadTasks(_params) {
			var urlRegx = /.+\.(\w{1,6})$/;
			var sizeDefault = {
				'img': 100,
				'json': 100
			};
			var that = this;

			function _getLoadTasks(params) {
				var urls = [];
				var type = void 0;

				if (Object.prototype.toString.call(params) === '[object Array]') {
					params.forEach(function (param) {
						urls = urls.concat(_getLoadTasks(param));
					});
				} else if ((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) === 'object' && !params.url) {
					for (var key in params) {
						urls = urls.concat(_getLoadTasks(params[key]));
					}
				} else if ((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) === 'object' && params.url) {
					type = params.url.match(urlRegx)[1];

					urls.push({
						'url': params.url,
						'size': params.size || sizeDefault[type] || 1,
						'type': params.type || that._getLoaderType(type)
					});
				}
				return urls;
			}
			return _getLoadTasks(_params);
		}
	}, {
		key: '_getResults',
		value: function _getResults(_params) {
			var params = $.extend(true, {}, _params);

			function _getResults(params) {
				if (Object.prototype.toString.call(params) === '[object Array]') {
					return params.map(function (param) {
						return _getResults(param);
					});
				} else if ((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) === 'object' && !params.url) {
					for (var key in params) {
						params[key] = _getResults(params[key]);
					}
					return params;
				} else if ((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) === 'object' && params.url) {
					return loadedCache[params.url];
				} else {
					return params;
				}
			}
			return _getResults(params);
		}
	}]);
	return Loader;
}();

var loadMethod = {
	'img': function img(url, onload, onProgress) {
		var imgLoader = new THREE.ImageLoader();
		imgLoader.load(url, function (img) {
			var particleMap = new THREE.TextureLoader().load(url, function (texture) {
				var imgInfo = {};
				imgInfo.img = img;
				imgInfo.src = url;
				imgInfo.texture = texture;
				onload(imgInfo);
			});
		}, function (xhr) {
			return onProgress(xhr.loaded / xhr.total);
		});
	},

	'json': function json(url, onload, onProgress) {
		var xhrLoader = new THREE.XHRLoader();
		xhrLoader.load(url, onload, function (xhr) {
			return onProgress(xhr.loaded / xhr.total);
		});
	},

	'model': function model(url, onload, onProgress) {
		var xhrLoader = new THREE.XHRLoader();
		xhrLoader.load(url, function (str) {
			onload(str.replace(/module\.exports\s*=\s*/, ''));
		}, function (xhr) {
			return onProgress(xhr.loaded / xhr.total);
		});
	},

	'js': function js(url, onload, onProgress) {

		var req = new XMLHttpRequest();

		req.addEventListener("progress", function (xhr) {
			if (xhr.lengthComputable) {
				onProgress(xhr.loaded / xhr.total);
			}
		}, false);

		req.addEventListener("load", function (event) {
			var e = event.target;
			var s = document.createElement("script");
			s.innerHTML = e.responseText;

			document.documentElement.appendChild(s);
			onload();
		}, false);

		req.open("GET", url);
		req.send();
	}
};

exports.default = Loader;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/logo.png";

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/select/particle-map.png";

/***/ }),
/* 113 */,
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var CONFIG = {};
var ASSETS = {
    envPosZ: { url: __webpack_require__(158), size: 20 },
    envNegZ: { url: __webpack_require__(156), size: 20 },
    envPosX: { url: __webpack_require__(160), size: 20 },
    envNegX: { url: __webpack_require__(159), size: 20 },
    envPosY: { url: __webpack_require__(161), size: 20 },
    envNegY: { url: __webpack_require__(157), size: 20 },

    logoImg: { url: __webpack_require__(111), size: 10 },
    particleMap: { url: __webpack_require__(112), size: 10 }
};

exports.CONFIG = CONFIG;
exports.ASSETS = ASSETS;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
				value: true
});

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _progress = __webpack_require__(137);

var _progress2 = _interopRequireDefault(_progress);

var _select = __webpack_require__(138);

var _select2 = _interopRequireDefault(_select);

var _display = __webpack_require__(136);

var _display2 = _interopRequireDefault(_display);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _viewConstructors = {
				'progress': _progress2.default,

				'select': _select2.default,
				'display': _display2.default
};

var _views = {};

var ViewManager = function () {
				function ViewManager() {
								(0, _classCallCheck3.default)(this, ViewManager);

								this.init();
				}

				(0, _createClass3.default)(ViewManager, [{
								key: 'init',
								value: function init() {
												window.addEventListener('resize', function () {
																var winWidth;
																var fontSize;
																var htmlElem = document.querySelector('html');
																function resize() {
																				winWidth = window.innerWidth;
																				fontSize = winWidth / 100;
																				fontSize = fontSize > 10 ? 10 : fontSize < 5 ? 5 : fontSize;
																				htmlElem.style.fontSize = fontSize + 'px';

																				for (var name in _views) {
																								if (_views[name].active) {
																												_views[name].resize();
																												_views[name].stages && _views[name].stages.forEach(function (stage) {
																																stage.resize && stage.resize();
																												});
																								}
																				}
																}
																resize();
																return resize;
												}());
								}
				}, {
								key: 'activateView',
								value: function activateView(name, data) {
												var view = this.getView(name);
												view.activate(data);
								}
				}, {
								key: 'inactivateView',
								value: function inactivateView(name, data) {
												var view = this.getView(name);
												view.inactivate(data);
								}
				}, {
								key: 'getView',
								value: function getView(name) {
												if (!_views[name]) {
																_views[name] = new _viewConstructors[name](this);
												}
												return _views[name];
								}
				}, {
								key: 'removeView',
								value: function removeView(view) {
												delete views[view.name];
								}
				}]);
				return ViewManager;
}();

exports.default = ViewManager;

/***/ }),
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 123 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TrackballControls = function TrackballControls() {

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.domElement = document;

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };
	this.fullScreen = false;

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = true;
	this.noRoll = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.targetMesh;
	this.target = new THREE.Vector3();
	this.target0 = this.target.clone();
	this.position0;
	this.up0;

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	    _prevState = STATE.NONE,
	    _eye = new THREE.Vector3(),
	    _rotation,
	    _zoomStart = new THREE.Vector2(),
	    _zoomEnd = new THREE.Vector2(),
	    _touchZoomDistanceStart = 0,
	    _touchZoomDistanceEnd = 0,
	    _panStart = new THREE.Vector2(),
	    _panEnd = new THREE.Vector2();

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	initEvent();

	this.init = function (camera, targetMesh) {

		this.camera = camera;
		this.cameraUp = camera.up.clone();
		this.targetMesh = targetMesh;

		_rotation = new THREE.Quaternion();
		_rotation.setFromEuler(targetMesh.rotation.clone());

		this.target = this.targetMesh.position.clone();
		this.target0 = this.target.clone();
		this.position0 = this.camera.position.clone();
		this.up0 = this.camera.up.clone();
	};

	this.changeTargetMesh = function (targetMesh) {
		this.targetMesh = targetMesh;
		this.target = this.targetMesh.position.clone();
	};

	this.handleResize = function (winSize) {
		var maxDisBase = 80;
		var minDisBase = 10;

		this.screen.left = winSize.left;
		this.screen.top = winSize.top;
		this.screen.width = winSize.width;
		this.screen.height = winSize.height;

		this.maxDistance = maxDisBase;
		this.minDistance = minDisBase;
	};

	this.handleEvent = function (event) {

		if (typeof this[event.type] == 'function') {

			this[event.type](event);
		}
	};

	var getMouseOnScreen = function () {

		var vector = new THREE.Vector2();

		return function (pageX, pageY) {

			vector.set((pageX - _this.screen.left) / _this.screen.width, (pageY - _this.screen.top) / _this.screen.height);

			return vector;
		};
	}();

	var getMouseProjectionOnBall = function getMouseProjectionOnBall(offsetX, offsetY) {

		var radio = 0.5;
		var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(offsetY * (Math.PI / 180) * radio, offsetX * (Math.PI / 180) * radio, 0, 'XYZ'));

		_this.targetMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, _this.targetMesh.quaternion);
	};

	this.rotateTarget = function () {};

	this.zoomCamera = function () {

		if (_state === STATE.TOUCH_ZOOM_PAN) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar(factor);
		} else {

			var factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

			if (factor !== 1.0 && factor > 0.0) {

				_eye.multiplyScalar(factor);

				if (_this.staticMoving) {

					_zoomStart.copy(_zoomEnd);
				} else {

					_zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
				}
			}
		}
	};

	this.panCamera = function () {

		var mouseChange = new THREE.Vector2(),
		    cameraUp = new THREE.Vector3(),
		    pan = new THREE.Vector3();

		return function () {

			mouseChange.copy(_panEnd).sub(_panStart);

			if (mouseChange.lengthSq()) {

				mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

				pan.copy(_eye).cross(_this.camera.up).setLength(mouseChange.x);
				pan.add(cameraUp.copy(_this.camera.up).setLength(mouseChange.y));

				_this.camera.position.add(pan);
				_this.target.add(pan);

				if (_this.staticMoving) {

					_panStart.copy(_panEnd);
				} else {

					_panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));
				}
			}
		};
	}();

	this.checkDistances = function () {

		if (!_this.noZoom || !_this.noPan) {

			if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {

				_this.camera.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
			}

			if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {

				_this.camera.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
			}
		}
	};

	this.update = function () {
		if (!this.enabled) return;

		_eye.subVectors(_this.camera.position, _this.target);

		if (!_this.noRotate) {

			_this.rotateTarget();
		}

		if (!_this.noZoom) {

			_this.zoomCamera();
		}

		if (!_this.noPan) {

			_this.panCamera();
		}

		_this.camera.position.addVectors(_this.target, _eye);

		_this.checkDistances();

		_this.camera.lookAt(_this.target);

		if (lastPosition.distanceToSquared(_this.camera.position) > EPS) {

			lastPosition.copy(_this.camera.position);
		}
	};

	this.resize = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy(_this.target0);
		_this.camera.position.copy(_this.position0);
		_this.camera.up.copy(_this.up0);

		_eye.subVectors(_this.camera.position, _this.target);

		_this.camera.lookAt(_this.target);

		_this.dispatchEvent(changeEvent);

		lastPosition.copy(_this.camera.position);
	};

	var mousePreX = 0;
	var mousePreY = 0;

	function isInScreen(x, y) {
		if (x > _this.screen.left && x < _this.screen.left + _this.screen.width && y > _this.screen.top && y < _this.screen.top + _this.screen.height || _this.fullScreen) {
			return true;
		} else {
			return false;
		}
	}

	function mousedown(event) {

		if (_this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;

		event.preventDefault();
		event.stopPropagation();

		if (_state === STATE.NONE) {
			_state = event.button;
		}

		if (_state === STATE.ROTATE && !_this.noRotate) {
			mousePreX = event.pageX;
			mousePreY = event.pageY;
		} else if (_state === STATE.ZOOM && !_this.noZoom) {

			_zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
			_zoomEnd.copy(_zoomStart);
		} else if (_state === STATE.PAN && !_this.noPan) {

			_panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
			_panEnd.copy(_panStart);
		}

		document.addEventListener('mousemove', mousemove, false);
		document.addEventListener('mouseup', mouseup, false);
	}

	function mousemove(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		if (_state === STATE.ROTATE && !_this.noRotate) {

			getMouseProjectionOnBall(event.pageX - mousePreX, event.pageY - mousePreY);
		} else if (_state === STATE.ZOOM && !_this.noZoom) {

			_zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
		} else if (_state === STATE.PAN && !_this.noPan) {

			_panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
		}
		mousePreX = event.pageX;
		mousePreY = event.pageY;
	}

	function mouseup(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('mouseup', mouseup);
	}

	function mousewheel(event) {

		if (_this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if (event.wheelDelta) {

			delta = event.wheelDelta / 40;
		} else if (event.detail) {

			delta = -event.detail / 3;
		}

		_zoomStart.y += delta * 0.01;
	}

	function touchstart(event) {

		if (_this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;

		switch (event.touches.length) {

			case 1:
				mousePreX = event.touches[0].pageX;
				mousePreY = event.touches[0].pageY;
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[0].pageX - event.touches[1].pageX;
				var dy = event.touches[0].pageY - event.touches[1].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

				var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				_panStart.copy(getMouseOnScreen(x, y));
				_panEnd.copy(_panStart);
				break;

			default:
				_state = STATE.NONE;

		}
	}

	function touchmove(event) {

		if (_this.enabled === false) return;

		event.preventDefault();
		event.stopPropagation();

		switch (event.touches.length) {

			case 1:
				getMouseProjectionOnBall(event.touches[0].pageX - mousePreX, event.touches[0].pageY - mousePreY);
				break;

			case 2:
				var dx = event.touches[0].pageX - event.touches[1].pageX;
				var dy = event.touches[0].pageY - event.touches[1].pageY;
				_touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

				var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				_panEnd.copy(getMouseOnScreen(x, y));
				break;

			default:
				_state = STATE.NONE;

		}
		mousePreX = event.touches[0].pageX;
		mousePreY = event.touches[0].pageY;
	}

	function touchend(event) {

		if (_this.enabled === false) return;

		switch (event.touches.length) {

			case 1:
				_rotateEnd.copy(getMouseProjectionOnBall(event.touches[0].pageX, event.touches[0].pageY));
				_rotateStart.copy(_rotateEnd);
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

				var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				_panEnd.copy(getMouseOnScreen(x, y));
				_panStart.copy(_panEnd);
				break;

		}

		_state = STATE.NONE;
	}

	function initEvent() {
		_this.domElement.addEventListener('contextmenu', function (event) {
			event.preventDefault();
		}, false);

		_this.domElement.addEventListener('mousedown', mousedown, false);

		_this.domElement.addEventListener('mousewheel', mousewheel, false);
		_this.domElement.addEventListener('DOMMouseScroll', mousewheel, false);

		_this.domElement.addEventListener('touchstart', touchstart, false);
		_this.domElement.addEventListener('touchend', touchend, false);
		_this.domElement.addEventListener('touchmove', touchmove, false);
	}
};

module.exports = TrackballControls;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];

var mobile = {
	'models': { url: __webpack_require__(162), size: 300, 'type': 'model' },

	'map': {
		'default': { url: __webpack_require__(155), size: 3000 }
	}
};

var mobiles = [];

products.forEach(function (productName) {
	mobiles.push({ "name": productName, mobile: mobile });
});

exports.default = mobiles;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = __webpack_require__(50);

var _keys2 = _interopRequireDefault(_keys);

var _promise = __webpack_require__(41);

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = __webpack_require__(64);

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _stage = __webpack_require__(63);

var _stage2 = _interopRequireDefault(_stage);

var _mobile = __webpack_require__(132);

var _mobile2 = _interopRequireDefault(_mobile);

var _m3Trackballcontrol = __webpack_require__(128);

var _m3Trackballcontrol2 = _interopRequireDefault(_m3Trackballcontrol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DisplayMobile = function (_Stage) {
	(0, _inherits3.default)(DisplayMobile, _Stage);

	function DisplayMobile(mobileName, position) {
		(0, _classCallCheck3.default)(this, DisplayMobile);

		var _this = (0, _possibleConstructorReturn3.default)(this, (DisplayMobile.__proto__ || (0, _getPrototypeOf2.default)(DisplayMobile)).call(this));

		_this._windowSize;
		_this._winSizePX;
		_this._camera;
		_this._mobile;

		_this.name;
		_this.size;
		_this.isInit = false;

		_this.trackball;
		_this.objects = {};
		_this.target = position.clone();

		_this.objectSizes = {
			model: { position: null, rotation: null },
			camera: { position: null, lookAt: null }
		};

		_this.state;

		_this.color;

		_this.locked = false;
		_this.active = false;

		_this.name = mobileName;
		_this._mobile = new _mobile2.default(_this.name);
		_this.size = _this._mobile.size;
		return _this;
	}

	(0, _createClass3.default)(DisplayMobile, [{
		key: 'load',
		value: function load(onProgress) {
			return this._mobile.load(onProgress);
		}
	}, {
		key: 'init',
		value: function init(onProgress) {
			var that = this;
			return this.load(onProgress).then(function () {
				return new _promise2.default(function (resolve, reject) {
					that.objects.mesh = that._mobile.mesh;
					that._setupScene();
					that.isInit = true;
					resolve();
				});
			}).catch(function (e) {
				console.log(e.stack);
			});;
		}
	}, {
		key: 'entry',
		value: function entry(windowSize) {
			this._windowSize = windowSize;

			this.objects.mesh.position.copy(this.target);

			this.objects.mesh.rotation.copy(new THREE.Euler(-Math.PI / 6, -0.4, -0.2, 'XYZ'));
			this._camera.up.copy(M3.camera.up);
			this._camera.position.copy(M3.camera.position);
			this._camera.position.z += 40;
			this._camera.lookAt(THREE.THREEUtil.getLookAt(M3.camera));

			this.objects.spotLight.position.copy(this.target);
			this.objects.spotLight.position.y += 200;
			this.objects.spotLight.position.x += 200;
			this.objects.spotLight.position.z += 100;
			this.objects.spotLight.lookAt(this.target);

			this.objects.spotLight2.position.copy(this.target);
			this.objects.spotLight2.position.y -= 200;
			this.objects.spotLight2.position.x -= 300;
			this.objects.spotLight2.position.z -= 100;
			this.objects.spotLight2.lookAt(this.target);

			this.objectSizes = { mesh: {}, camera: {} };
			this.objectSizes.mesh.position = this.objects.mesh.position.clone();
			this.objectSizes.mesh.rotation = this.objects.mesh.rotation.clone();

			this.objectSizes.camera.position = this.objects.mesh.position.clone();
			this.objectSizes.camera.position.z += 50;
			this.objectSizes.camera.lookAt = this.objects.mesh.position.clone();

			(0, _keys2.default)(this.objects).forEach(function (o) {
				M3.scene.add(this.objects[o]);
			}.bind(this));

			this.resize();

			this._changeColor();
			this.addTick(this._render.bind(this));

			return this._playEntryAnimation();
		}
	}, {
		key: 'leave',
		value: function leave() {
			console.log((0, _keys2.default)(this.objects));
			(0, _keys2.default)(this.objects).forEach(function (o) {
				M3.scene.remove(that.objects[o]);
			});

			this.$domElem.remove();
			this.getView('display-manager').removeWindow(this);
			this.removeTween();
			this.removeTick();
			this.active = false;
		}
	}, {
		key: 'resize',
		value: function resize() {
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;

			this._winSizePX = {};
			this._winSizePX['left'] = parseInt(winWidth * this._windowSize['left']);
			this._winSizePX['width'] = parseInt(winWidth * this._windowSize['width']);
			this._winSizePX['top'] = parseInt(winHeight * this._windowSize['top']);
			this._winSizePX['height'] = parseInt(winHeight * this._windowSize['height']);

			this._winSizePX['bottom'] = winHeight - this._winSizePX['height'] - this._winSizePX['top'];

			this._camera.aspect = this._winSizePX['width'] / this._winSizePX['height'];
			this._camera.updateProjectionMatrix();

			this.trackball.handleResize(this._winSizePX);
		}
	}, {
		key: 'resizeWindow',
		value: function resizeWindow(windowSize) {
			var that = this;
			var initSize = this._windowSize;
			var finalSize = windowSize;

			this.setState('animate');
			var resizeTween = new TWEEN.Tween(initSize).easing(TWEEN.Easing.Cubic.InOut).to(finalSize, 1000).onUpdate(function () {
				that._windowSize = this;
				that.resize();
			}).onComplete(function () {
				that.removeTween(resizeTween);
				that.setState('handle');
			}).start();
		}
	}, {
		key: 'setState',
		value: function setState(state) {
			this.state = state;
			if (state === 'handle') {
				this.trackball.init(this._camera, this.objects.mesh);
				this.resize();
				!this.locked && this.trackball && (this.trackball.enabled = true);
			} else {
				!this.locked && this.trackball && (this.trackball.enabled = false);
			}
		}
	}, {
		key: 'getSize',
		value: function getSize() {
			var size = {};

			size.modelRotation = this.objects.mesh.rotation.clone();
			size.cameraRotation = this._camera.rotation.clone();
			size.cameraUp = this._camera.up.clone();
			size.eye = new THREE.Vector3().subVectors(this._camera.position, this.objects.mesh.position);

			return size;
		}
	}, {
		key: 'setSize',
		value: function setSize(size) {
			this.objects.mesh.rotation.copy(size.modelRotation);

			this._camera.position.addVectors(this.objects.mesh.position, size.eye);
			this._camera.lookAt(this.objects.mesh);
		}
	}, {
		key: 'lock',
		value: function lock(isMain) {
			this.locked = true;
			if (isMain) {
				this.trackball.enabled = true;
				this.trackball.fullScreen = true;
			} else {
				this.trackball.enabled = false;
			}
			this.reset();
		}
	}, {
		key: 'unlock',
		value: function unlock() {
			this.locked = false;

			this.trackball.enabled = true;
			this.trackball.fullScreen = false;
			this.reset();
		}
	}, {
		key: 'getColors',
		value: function getColors() {
			if (this._mobile) {
				return this._mobile.getColors();
			}
		}
	}, {
		key: 'remove',
		value: function remove() {
			(0, _get3.default)(DisplayMobile.prototype.__proto__ || (0, _getPrototypeOf2.default)(DisplayMobile.prototype), 'remove', this).call(this);
			this.removeTick();
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.setState('animate');

			var initModelRotation = this.objectSizes.mesh.rotation;
			var initCameraPosition = this.objectSizes.camera.position;
			var initCameraLookAtPosition = this.objectSizes.camera.position;

			this.objects.mesh.animate({
				rotation: initModelRotation
			}, 1000);

			this._camera.animate({
				position: initCameraPosition,
				lookAt: initCameraLookAtPosition
			}, 1000, 0, {
				onComplete: function () {
					this.setState('handle');
				}.bind(this)
			});
		}
	}, {
		key: '_setupScene',
		value: function _setupScene() {
			this.objects.spotLight = new THREE.SpotLight(0xeeeeee);
			this.objects.spotLight.intensity = 1.5;

			this.objects.spotLight2 = new THREE.SpotLight(0xeeeeee);
			this.objects.spotLight2.intensity = 1.0;

			this._camera = new THREE.PerspectiveCamera(53, window.innerWidth / window.innerHeight, 0.1, 1000);

			this.trackball = new _m3Trackballcontrol2.default(this._camera);
		}
	}, {
		key: '_changeColor',
		value: function _changeColor(color) {
			this._mobile.changeColor(color);
		}
	}, {
		key: '_playEntryAnimation',
		value: function _playEntryAnimation() {
			var that = this;
			return new _promise2.default(function (resolve, reject) {
				that.setState('animate');

				var initModelRotation = that.objectSizes.mesh.rotation;
				var initCameraPosition = that.objectSizes.camera.position;

				that.objects.mesh.rotation.copy(initModelRotation);
				that.objects.mesh.rotation.x -= Math.PI * 0.5;
				that.objects.mesh.rotation.z += Math.PI * 1.2;
				that.objects.mesh.animate({
					rotation: initModelRotation
				}, 2000);

				that._camera.animate({
					position: initCameraPosition
				}, 2000, 0, {
					onComplete: function onComplete() {
						that.setState('handle');
						resolve();
					}
				});
			});
		}
	}, {
		key: '_render',
		value: function _render() {

			M3.renderer.setViewport(this._winSizePX['left'], this._winSizePX['bottom'], this._winSizePX['width'], this._winSizePX['height']);
			M3.renderer.setScissor(this._winSizePX['left'], this._winSizePX['bottom'], this._winSizePX['width'], this._winSizePX['height']);
			M3.renderer.setScissorTest(true);
			this._camera.aspect = this._winSizePX['width'] / this._winSizePX['height'];
			this._camera.updateProjectionMatrix();
			M3.renderer.render(M3.scene, this._camera);
			this.trackball.update();
		}
	}]);
	return DisplayMobile;
}(_stage2.default);

exports.default = DisplayMobile;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = __webpack_require__(41);

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _time = __webpack_require__(23);

var _time2 = _interopRequireDefault(_time);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExplodeParticles = function (_Time) {
    (0, _inherits3.default)(ExplodeParticles, _Time);

    function ExplodeParticles() {
        (0, _classCallCheck3.default)(this, ExplodeParticles);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ExplodeParticles.__proto__ || (0, _getPrototypeOf2.default)(ExplodeParticles)).call(this));

        _this.particleSystem;
        _this.initPos = new THREE.Vector3(0, 0, 0);
        _this.finalPos = new THREE.Vector3(0, 0, 0);
        return _this;
    }

    (0, _createClass3.default)(ExplodeParticles, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'build',
        value: function build() {
            var that = this;
            var logoImg = M3.assets.logoImg.img;

            var particleMap = M3.assets.particleMap.texture;


            var imgData = getImageData(logoImg, 0, 0, 0);
            var zRandom = 200;
            var yOffset = 0;
            var geom = new THREE.Geometry();
            var material = new THREE.PointsMaterial({
                map: particleMap,
                size: 3,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true,
                color: 0xffffff,
                blending: THREE.AdditiveBlending
            });

            imgData.forEach(function (pixel) {
                var v3 = new THREE.Vector3(pixel.size.x * 1, pixel.size.y * 1 + yOffset, 0);
                v3.initV = v3.clone();
                v3.lightupZ = (Math.random() - 0.5) * 5 * zRandom;
                v3.z = v3.lightupZ;

                v3.exAngle = Math.random() * Math.PI * 2;
                v3.exAngleY = (Math.random() - 0.5) * Math.PI * 1;
                v3.rPercent = Math.random() * 2 + 1;
                geom.vertices.push(v3);
            });
            that.particleSystem = new THREE.ParticleSystem(geom, material);
        }
    }, {
        key: 'lightUp',
        value: function lightUp() {
            var dur = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TIME_4000;

            var that = this;
            var cameraTween = void 0;

            return new _promise2.default(function (resolve) {
                var particleTween = new TWEEN.Tween({ z: 1 }).to({ z: 0 }, dur * 1.2);
                particleTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                    var z = this.z;
                    that.particleSystem.geometry.verticesNeedUpdate = true;
                    that.particleSystem.geometry.vertices.forEach(function (v3) {
                        v3.z = v3.lightupZ * z;
                    });
                }).onComplete(function () {
                    return resolve();
                }).start();
                that.addTween(particleTween);
            });
        }
    }, {
        key: 'gather',
        value: function gather() {
            var dur = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TIME_2000;

            var that = this;
            var gatherTween = new TWEEN.Tween({ p: 1 }).to({ p: -1 }, dur);

            this.addTween(gatherTween);
            return new _promise2.default(function (resolve) {
                gatherTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                    var p = this.p > 0 ? this.p : 0;
                    that.particleSystem.geometry.verticesNeedUpdate = true;
                    that.particleSystem.geometry.vertices.forEach(function (v3) {
                        v3.setLength(v3.initV.length() * p);
                    });
                }).onComplete(resolve).start();
            });
        }
    }, {
        key: 'explode',
        value: function explode() {
            var dur = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TIME_4000;

            var that = this;
            var explodeTween = new TWEEN.Tween({ r: 0, size: 3 }).to({ r: 1000, size: 20 }, dur);

            this.addTween(explodeTween);
            return new _promise2.default(function (resolve) {
                explodeTween.easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
                    var r = this.r;
                    var planeR = void 0;
                    that.particleSystem.material.size = this.size;
                    that.particleSystem.material.needsUpdate = true;

                    that.particleSystem.geometry.verticesNeedUpdate = true;
                    that.particleSystem.geometry.vertices.forEach(function (v3) {
                        planeR = r * v3.rPercent * Math.cos(v3.exAngleY);
                        v3.y = r * v3.rPercent * Math.sin(v3.exAngleY);
                        v3.x = planeR * Math.cos(v3.exAngle);
                        v3.z = planeR * Math.sin(v3.exAngle);
                    });
                }).onComplete(resolve).start();
            });
        }
    }]);
    return ExplodeParticles;
}(_time2.default);

exports.default = ExplodeParticles;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = __webpack_require__(41);

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _time = __webpack_require__(23);

var _time2 = _interopRequireDefault(_time);

var _loader = __webpack_require__(110);

var _loader2 = _interopRequireDefault(_loader);

var _mobileConf = __webpack_require__(129);

var _mobileConf2 = _interopRequireDefault(_mobileConf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loader = new _loader2.default();
var mobileEnvMap;
var JSONLoader = new THREE.JSONLoader();

var Mobile = function (_Time) {
	(0, _inherits3.default)(Mobile, _Time);

	function Mobile(mobileName) {
		(0, _classCallCheck3.default)(this, Mobile);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Mobile.__proto__ || (0, _getPrototypeOf2.default)(Mobile)).call(this));

		_this.mesh;
		_this.size;

		_this.config;
		_this._materials;
		_this._colors = [];
		_this._currentColor;
		_this._uuidMaterialNameMap = {};
		_this._texturePath = './assets/texture/';

		_mobileConf2.default.forEach(function (mobile) {
			if (mobile.name === mobileName) {
				this.config = mobile;
			}
		}.bind(_this));
		_this.size = loader.calculateSize(_this.config);
		return _this;
	}

	(0, _createClass3.default)(Mobile, [{
		key: 'getColors',
		value: function getColors() {
			return this._colors;
		}
	}, {
		key: 'changeColor',
		value: function changeColor(color) {
			if (this._currentColor === color) return;
			if (this._colors.indexOf(color) < 0) {
				console.log('No this color');
				return;
			}

			this.mesh.children.forEach(function (child) {
				var materialName = this._uuidMaterialNameMap[uuid];

				this._materials[color].forEach(function (material) {
					if (material.name.replace(/\d*$/, '') === materialName.replace(/\d*$/, '')) {
						child.material = material;
						child.material.needsUpdate = true;
					}
				});
			});
		}
	}, {
		key: 'load',
		value: function load(onProgress) {
			var that = this;
			var models;
			var materials;
			var group = new THREE.Group();
			var loadPromise = loader.load(this.config, onProgress);

			return loadPromise.then(function (modelRes) {
				models = JSON.parse(modelRes.mobile.models);
				return new _promise2.default(function (resolve) {
					that._materials = models.materials;
					for (var color in that._materials) {
						that._colors.push(color);
						that._currentColor = that._colors[0];
						that._materials[color] = that._JSONLoaderParse(that._materials[color]).materials;
					}
					for (var modelName in models.models) {

						var mParse = that._JSONLoaderParse(models.models[modelName]);
						var geometry = mParse.geometry;
						var material = mParse.materials[0];
						var model;

						if (material.name.match('glass')) {
							material.envMap = M3.assets.envMap;
						}


						material.side = THREE.DoubleSide;
						material.transparent = material.opacity === 1 ? false : true;
						model = new THREE.Mesh(geometry, material);

						that._uuidMaterialNameMap[model.uuid] = mParse.materials[0].name;
						group.add(model);
					}
					that.mesh = group;
					resolve();
				});
			}).catch(function (e) {
				console.error(e.stack);
			});
		}
	}, {
		key: '_JSONLoaderParse',
		value: function _JSONLoaderParse(json) {

			if (typeof json === 'string') {
				json = JSON.parse(json);
			}

			if (json.materials && typeof json.materials !== 'string') {
				json.materials.forEach(function (material) {
					if (material.mapDiffuse) {
						material.mapDiffuse = '';
					}
				});
			}
			return JSONLoader.parse(json, location.pathname.replace(/[^\/]+$/, ''));
		}
	}]);
	return Mobile;
}(_time2.default);

exports.default = Mobile;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = __webpack_require__(50);

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _stage = __webpack_require__(63);

var _stage2 = _interopRequireDefault(_stage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectCube = function (_Stage) {
	(0, _inherits3.default)(SelectCube, _Stage);

	function SelectCube() {
		(0, _classCallCheck3.default)(this, SelectCube);

		var _this = (0, _possibleConstructorReturn3.default)(this, (SelectCube.__proto__ || (0, _getPrototypeOf2.default)(SelectCube)).call(this));

		_this.objects;
		_this._BASECROOD = new THREE.Vector3();
		_this._PLANEWIDTH = 1500;
		_this._PLANEHEIGHT = 1500;
		_this._CUBESIZE = 60;
		_this._GRIDXCOUNT = _this._PLANEWIDTH / _this._CUBESIZE | 0;
		_this._GRIDZCOUNT = _this._PLANEHEIGHT / _this._CUBESIZE | 0;
		_this._CUBEHEIGHT = 400;
		_this._MINSCALE = 0.1;
		_this._MAXSCALE = 0.6;
		_this._cubes;
		_this.isInit = false;
		return _this;
	}

	(0, _createClass3.default)(SelectCube, [{
		key: 'init',
		value: function init() {
			this.build();
			this.isInit = true;
		}
	}, {
		key: 'build',
		value: function build() {
			this._cubes = [];

			var emptySpace = 0.3;
			var cubeGroup = new THREE.Group();
			var cubeMaterial;
			var cubeGeom;
			var cube;
			var glowCube;

			for (var i = 0; i < this._GRIDXCOUNT; i++) {

				for (var j = 0; j < this._GRIDZCOUNT; j++) {

					var x = this._BASECROOD.x - this._GRIDXCOUNT / 2 + i;
					var z = this._BASECROOD.z - this._GRIDZCOUNT / 2 + j;
					if (x * x + z * z < this._GRIDXCOUNT * emptySpace * this._GRIDXCOUNT * emptySpace || Math.random() + 0.5 | 0) {
						continue;
					}

					this._cubes[i] = this._cubes[i] || [];
					this._cubes[i][j] = {
						position: { x: x, y: 0, z: z },
						scaleV: Math.random() / 6000,
						scaleMin: this._MINSCALE + (this._MAXSCALE - this._MINSCALE) * Math.random() / 2,
						scaleMax: this._MAXSCALE - (this._MAXSCALE - this._MINSCALE) * Math.random() / 2 };

					var cubeSize = this._CUBESIZE * (0.2 + 0.5 * Math.random());
					cubeGeom = new THREE.BoxGeometry(cubeSize, this._CUBEHEIGHT, cubeSize, 2, 2, 2);
					cubeMaterial = new THREE.MeshLambertMaterial({
						color: 0xffffff
					});
					cube = new THREE.Mesh(cubeGeom, cubeMaterial);
					cube.position.set((this._cubes[i][j].position.x + Math.random() - 0.5) * this._CUBESIZE, 0, (this._cubes[i][j].position.z + Math.random() - 0.5) * this._CUBESIZE);
					cube.scale.set(1, 0.01, 1);
					this._cubes[i][j].cube = cube;

					var glowCubeGeom = new THREE.BoxGeometry(cubeSize * 1.4, this._CUBEHEIGHT * 1.1, cubeSize * 1.4, 3, 8, 3);
					var modifier = new THREE.SubdivisionModifier(1);
					modifier.modify(glowCubeGeom);
					glowCube = new THREE.Mesh(glowCubeGeom, new THREE.GlowMaterial({
						c: 0.34,
						p: 2.8,
						o: 0.3,
						color: new THREE.Color(0xffffff),
						transparent: true
					}));

					glowCube.position.copy(cube.position);
					glowCube.scale.copy(cube.scale);
					this._cubes[i][j].glowCube = glowCube;

					cubeGroup.add(cube);
					cubeGroup.add(glowCube);
				}
			}

			this.objects.cubeGroup = cubeGroup;
		}
	}, {
		key: 'entry',
		value: function entry() {
			(0, _keys2.default)(this.objects).forEach(function (o) {
				M3.scene.add(this.objects[o]);
			}.bind(this));
			this._moveCubes();
		}
	}, {
		key: 'leave',
		value: function leave() {
			this.removeTick();
		}
	}, {
		key: '_moveCube',
		value: function _moveCube(cube) {
			var that = this;
			var target = {};
			var dur;

			cube.scaleMin = this._MINSCALE + (this._MAXSCALE - this._MINSCALE) * Math.random() / 2;
			cube.scaleMax = this._MAXSCALE - (this._MAXSCALE - this._MINSCALE) * Math.random() / 2;

			if (cube.cube.scale.y <= cube.scaleMin) {
				target.scale = new THREE.Vector3(1, cube.scaleMax + 0.01, 1);
			} else if (cube.cube.scale.y >= cube.scaleMax) {
				target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
			} else {
				target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
			}


			dur = Math.abs(target.scale.y - cube.cube.scale.y) / cube.scaleV;

			cube.tween = that.addTHREEObjTween(cube.cube, target, dur, {
				onUpdate: function onUpdate() {
					cube.glowCube.scale.copy(cube.cube.scale);
				},
				onComplete: function onComplete() {
					that.removeTween(cube.tween);
					that._moveCube(cube);
				}
			});
			cube.tween.start();
		}
	}, {
		key: '_moveCubes',
		value: function _moveCubes() {
			for (var cube, i = this._cubes.length - 1; i >= 0; i--) {
				if (!this._cubes[i]) {
					continue;
				}
				for (var j = this._cubes[i].length - 1; j >= 0; j--) {
					if (!this._cubes[i][j]) {
						continue;
					}
					cube = this._cubes[i][j];
					this._moveCube(cube);
				};
			};
		}
	}]);
	return SelectCube;
}(_stage2.default);

exports.default = SelectCube;

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = __webpack_require__(50);

var _keys2 = _interopRequireDefault(_keys);

var _set = __webpack_require__(140);

var _set2 = _interopRequireDefault(_set);

var _get2 = __webpack_require__(64);

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _time = __webpack_require__(23);

var _time2 = _interopRequireDefault(_time);

var _selectConf = __webpack_require__(69);

var _selectConf2 = _interopRequireDefault(_selectConf);

var _stage = __webpack_require__(63);

var _stage2 = _interopRequireDefault(_stage);

var _explodeParticles = __webpack_require__(131);

var _explodeParticles2 = _interopRequireDefault(_explodeParticles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Star = function (_Time) {
	(0, _inherits3.default)(Star, _Time);

	function Star(initCrood) {
		(0, _classCallCheck3.default)(this, Star);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Star.__proto__ || (0, _getPrototypeOf2.default)(Star)).call(this));

		_this.startLines = [];
		_this.endLines = [];
		_this.box;
		_this.mesh;
		_this.connectStars = [];
		_this.initCrood = initCrood;
		_this.autoMoveTween;
		_this.rotateT;
		return _this;
	}

	(0, _createClass3.default)(Star, [{
		key: 'init',
		value: function init() {
			this.build();
			this.mesh.position.set(0, 0, 0);

			this.rotateT = this.addTick(function () {
				this.box.rotation.x += 0.002;
				this.box.rotation.y += 0.006;

				this.box.rotation.z += 0.002;
			}.bind(this));

			var that = this;
		}
	}, {
		key: 'build',
		value: function build() {
			var geom = new THREE.SphereGeometry(10 + Math.random() * 3, 6, 4);


			var material1 = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, opacity: 0.2 });

			var material2 = new THREE.MeshLambertMaterial();
			material2.envMap = M3.assets.envMap;
			material2.side = THREE.DoubleSide;
			material2.transparent = true;
			material2.opacity = 0.1;
			material2.refractionRatio = 1.4;

			var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [material1, material2]);

			mesh.rotation.set(Math.random(), Math.random(), Math.random());
			this.mesh = mesh;
			this.box = mesh;
			this.box.name = 'starbox';
		}
	}, {
		key: 'setCrood',
		value: function setCrood(crood) {
			crood && this.mesh.position.copy(crood);
			this.startLines.forEach(function (line) {
				return line.update();
			});
			this.endLines.forEach(function (line) {
				return line.update();
			});
		}
	}, {
		key: 'autoMove',
		value: function autoMove() {
			function move() {
				var newCrood = that.initCrood.clone().add(new THREE.Vector3(Math.random() * 20, Math.random() * 20, Math.random() * 20));
				that.moveTo(newCrood, move);
			}
			move();
		}
	}, {
		key: 'moveTo',
		value: function moveTo(crood, callback) {
			autoMoveTween = this.addTHREEObjTween(this.mesh, { position: crood }, 2000 + Math.random() * 3000 | 0, {
				onUpdate: function () {
					this.setCrood(this.mesh.position);
				}.bind(this),
				onComplete: callback
			}).start();
		}
	}]);
	return Star;
}(_time2.default);

var ProductStar = function (_Star) {
	(0, _inherits3.default)(ProductStar, _Star);

	function ProductStar(crood, svgString) {
		(0, _classCallCheck3.default)(this, ProductStar);

		var _this2 = (0, _possibleConstructorReturn3.default)(this, (ProductStar.__proto__ || (0, _getPrototypeOf2.default)(ProductStar)).call(this, crood));

		_this2.name;
		_this2.selected = false;
		_this2._svgString = svgString;

		_this2._svgMesh;
		_this2._glowSprite;

		_this2._selectTween;

		_this2.updateT;
		return _this2;
	}

	(0, _createClass3.default)(ProductStar, [{
		key: 'init',
		value: function init() {
			var _this3 = this;

			(0, _get3.default)(ProductStar.prototype.__proto__ || (0, _getPrototypeOf2.default)(ProductStar.prototype), 'init', this).call(this);
			this.updateT = this.addTween(function () {
				_this3._glowSprite.material.needUpdate = true;
				_this3._svgMesh.material.needUpdate = true;
			});
		}
	}, {
		key: 'build',
		value: function build() {
			(0, _get3.default)(ProductStar.prototype.__proto__ || (0, _getPrototypeOf2.default)(ProductStar.prototype), 'build', this).call(this);
			var group = new THREE.Group();
			var svgGemo = new THREE.SVGGemetry(this._svgString, {});

			var material = new THREE.MeshBasicMaterial({ color: 0x095c75 });

			var svgMaterial = new THREE.MeshPhongMaterial({
				color: 0x095c75,
				emissive: 0xffffff
			});
			var svgMesh = new THREE.Mesh(svgGemo, material);
			svgMesh.scale.set(0.1, 0.1, 0.1);

			var initV = new THREE.Vector3(0, 0, 1);
			var finalV = this.initCrood.clone().normalize();

			initV.y = finalV.y = 0;
			var axis = new THREE.Vector3();
			axis.crossVectors(initV, finalV).normalize();
			var angle = Math.acos(initV.dot(finalV) / initV.length() / initV.length());
			var quaternion = new THREE.Quaternion();

			quaternion.setFromAxisAngle(axis, angle);
			svgMesh.rotation.setFromQuaternion(quaternion);
			this._svgMesh = svgMesh;

			var spriteMap = M3.assets.particleMap.texture;

			var spriteMaterial = new THREE.SpriteMaterial({
				map: spriteMap,
				blending: THREE.AdditiveBlending,
				transparent: true,
				opacity: 0
			});
			var glowSprite = new THREE.Sprite(spriteMaterial);
			glowSprite.scale.set(60, 60, 60);
			this._glowSprite = glowSprite;

			group.add(glowSprite);
			group.add(svgMesh);
			group.add(this.mesh);
			this.mesh = group;
		}
	}, {
		key: 'select',
		value: function select() {
			var _this4 = this;

			var that = this;
			this.selected = true;
			this._glowSprite.visible = true;
			this._svgMesh.material.stopAnimate().animate({ color: 0xffffff }, 300);
			this._glowSprite.material.stopAnimate().animate({ opacity: 1 }, 300, 0, {
				onComplete: function onComplete() {
					return _this4._glowSprite.visible = true;
				}
			});
		}
	}, {
		key: 'unSelect',
		value: function unSelect() {
			var _this5 = this;

			this.selected = false;
			this._glowSprite.visible = true;
			this._svgMesh.material.stopAnimate().animate({ color: 0x095c75 }, 300);
			this._glowSprite.material.stopAnimate().animate({ opacity: 0 }, 300, 0, {
				onComplete: function onComplete() {
					return _this5._glowSprite.visible = false;
				}
			});
		}
	}]);
	return ProductStar;
}(Star);

var Line = function (_Time2) {
	(0, _inherits3.default)(Line, _Time2);

	function Line(startStar, endStar) {
		(0, _classCallCheck3.default)(this, Line);

		var _this6 = (0, _possibleConstructorReturn3.default)(this, (Line.__proto__ || (0, _getPrototypeOf2.default)(Line)).call(this));

		_this6.startStar = startStar;
		_this6.endStar = endStar;

		_this6.start = new THREE.Vector3();
		_this6.end = new THREE.Vector3();

		_this6.mesh;
		_this6.line;
		_this6.startPointLight;
		_this6.endPointLight;

		_this6.ray = new THREE.Raycaster();
		_this6.connected = false;
		_this6.init();
		return _this6;
	}

	(0, _createClass3.default)(Line, [{
		key: 'init',
		value: function init() {
			var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0, linewidth: 1, transparent: true });

			var lineGeom = new THREE.Geometry();
			lineGeom.vertices.push(this.start, this.end);
			this.line = new THREE.Line(lineGeom, lineMaterial);

			var pointLightMap = M3.assets.particleMap.texture;

			var spriteMaterial = new THREE.SpriteMaterial({
				map: pointLightMap,
				blending: THREE.AdditiveBlending,
				transparent: true,
				opacity: 0
			});
			this.startPointLight = new THREE.Sprite(spriteMaterial);
			this.endPointLight = new THREE.Sprite(spriteMaterial);
			this.startPointLight.scale.set(10, 10, 10);
			this.endPointLight.scale.set(10, 10, 10);

			this.mesh = new THREE.Group();
			this.mesh.add(this.line);
			this.mesh.add(this.startPointLight);
			this.mesh.add(this.endPointLight);
			this.mesh.visible = false;
		}
	}, {
		key: 'connect',
		value: function connect() {
			var dur = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TIME_1000;
			var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			var that = this;
			var moveIndex = Math.random() * 2 | 0;
			var staticIndex = (moveIndex + 1) % 2;

			this.mesh.visible = true;
			function update() {
				that.line.geometry.verticesNeedUpdate = true;
				that.line.material.needUpdate = true;
			}

			var pointTween = new TWEEN.Tween({ p: 0 }).to({ p: 1 }, dur).easing(TWEEN.Easing.Cubic.In).onUpdate(function () {
				var curCroods = that.calCrood();
				var sub = new THREE.Vector3().subVectors(curCroods[moveIndex], curCroods[staticIndex]);
				sub.setLength(sub.length() * this.p);
				curCroods[moveIndex] = curCroods[staticIndex].clone().add(sub);
				that.setCrood(curCroods);
			}).onComplete(function () {
				that.removeTween(pointTween);
				that.connected = true;
			});
			setTimeout(function () {
				return pointTween.start();
			}, delay);
			this.line.material.animate({ opacity: 0.4 }, dur, delay, { onUpdate: update });
			this.startPointLight.animate({ scale: new THREE.Vector3(1, 1, 1) }, dur, delay);
			this.startPointLight.material.animate({ opacity: 0.5 }, dur, delay);
		}
	}, {
		key: 'calCrood',
		value: function calCrood() {
			var startV = this.startStar.box.getWorldPosition();
			var endV = this.endStar.box.getWorldPosition();

			this.ray.set(startV, new THREE.Vector3().subVectors(endV, startV).normalize());
			var intersects = this.ray.intersectObjects([this.startStar.box, this.endStar.box], true);
			var pointStart = void 0,
			    pointEnd = void 0;

			intersects.forEach(function (intersect) {
				if (!pointStart && (this.startStar.box === intersect.object || this.startStar.box.children.indexOf(intersect.object) !== -1)) {
					pointStart = intersect.point;
				}
				if (!pointEnd && (this.endStar.box === intersect.object || this.endStar.box.children.indexOf(intersect.object) !== -1)) {
					pointEnd = intersect.point;
				}
			}.bind(this));

			return [pointStart, pointEnd];
		}
	}, {
		key: 'setCrood',
		value: function setCrood(croods) {
			this.start.copy(croods[0]);
			this.end.copy(croods[1]);

			this.startPointLight.position.copy(this.start);
			this.endPointLight.position.copy(this.end);

			this.line.geometry.verticesNeedUpdate = true;
		}
	}, {
		key: 'update',
		value: function update() {
			if (!this.connected) return;
			var vecs = this.calCrood();
			this.setCrood(vecs);
		}
	}]);
	return Line;
}(_time2.default);

var SelectStars = function (_Stage) {
	(0, _inherits3.default)(SelectStars, _Stage);

	function SelectStars() {
		(0, _classCallCheck3.default)(this, SelectStars);

		var _this7 = (0, _possibleConstructorReturn3.default)(this, (SelectStars.__proto__ || (0, _getPrototypeOf2.default)(SelectStars)).call(this));

		_this7.isInit = false;
		_this7.interacted = false;

		_this7._gridSize = 30;
		_this7._starCount = 60;
		_this7._rangeX = 20;
		_this7._rangeY = 10;
		_this7._rangeZ = 20;

		_this7._minDistant = _this7._gridSize * 3;
		_this7._maxConnectDistant = _this7._gridSize * 4;

		_this7._productCfgs;
		_this7._stars = [];
		_this7._lines = [];
		_this7._pStars = [];
		_this7._selectedPStars = [];
		_this7._maxSelected = 2;

		_this7.explodeParticles = new _explodeParticles2.default();
		return _this7;
	}

	(0, _createClass3.default)(SelectStars, [{
		key: 'init',
		value: function init() {
			this._productCfgs = $.extend(true, [], _selectConf2.default.products);
			this.isInit = true;
			this._initEvent();
			this._build();

			this._controls = new THREE.TrackballControls(this.camera, M3.renderer.domElement);
			this._controls.enabled = false;
		}
	}, {
		key: '_initEvent',
		value: function _initEvent() {
			var that = this;
			var raycaster = new THREE.Raycaster();
			var intersects = void 0;
			var mouse = new THREE.Vector2();
			var hit = void 0;
			var hitStar = void 0;

			function mousedown(event) {
				if (!that.interacted) return;

				hit = null;
				mouse.x = event.clientX / window.innerWidth * 2 - 1;
				mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				raycaster.setFromCamera(mouse, M3.camera);
				intersects = raycaster.intersectObjects(that._pStars.map(function (pStar) {
					return pStar.box;
				}), true);

				if (intersects.some(function (intersect) {
					if (intersect.object.name === 'starbox') {
						hit = intersect.object;
						return true;
					} else if (intersect.object.parent && intersect.object.parent.name === 'starbox') {
						hit = intersect.object.parent;
						return true;
					}
				})) {
					hitStar = that._pStars.filter(function (pStar) {
						return pStar.box === hit;
					})[0];
					that._toggle(hitStar);
				}
			}

			document.addEventListener('click', mousedown);
		}
	}, {
		key: '_build',
		value: function _build() {
			var _this8 = this;

			var that = this;
			var starCroods = [];
			var starCrood = void 0;
			var isValidCrood = false;
			var starGroup = new THREE.Group();

			var toBaseVec = new THREE.Vector3(-this._gridSize * this._rangeX / 2, -this._gridSize * this._rangeY / 2, -this._gridSize * this._rangeZ / 2);

			var _loop = function _loop() {

				starCrood = new THREE.Vector3(parseInt(_this8._rangeX * Math.random()) * _this8._gridSize, parseInt(_this8._rangeY * Math.random()) * _this8._gridSize, parseInt(_this8._rangeZ * Math.random()) * _this8._gridSize);
				starCrood.add(toBaseVec);

				var hasConnect = false;
				var distantVec = new THREE.Vector3();
				var distant = void 0;
				isValidCrood = starCroods.every(function (crood) {
					distant = distantVec.subVectors(starCrood, crood).length();
					hasConnect = hasConnect || distant < that._maxConnectDistant;
					return distant > that._minDistant;
				}) && hasConnect;

				if (!starCroods.length || isValidCrood) {
					starCroods.push(starCrood);
				}
			};

			while (starCroods.length < this._starCount) {
				_loop();
			}

			var productIndexes = new _set2.default();
			while (productIndexes.size < this._productCfgs.length) {
				productIndexes.add(Math.random() * this._starCount | 0);
			}

			var productCfgIndex = 0;
			starCroods.forEach(function (starCrood, index) {
				var star = void 0;
				if (productIndexes.has(index)) {
					star = new ProductStar(starCrood, that._productCfgs[productCfgIndex].svgString);
					star.init();
					star.name = that._productCfgs[productCfgIndex].name;
					that._pStars.push(star);
					productCfgIndex++;
				} else {
					star = new Star(starCrood);star.init();
				}

				star.setCrood(new THREE.Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2));

				that._stars.push(star);
				starGroup.add(star.mesh);
			});
			this.objects.starGroup = starGroup;
			this.objects.starGroup.scale.setScalar(0.0001);

			var line = void 0;
			var lineGroup = new THREE.Group();
			this._stars.forEach(function (iStar, i) {
				that._stars.forEach(function (jStar, j) {
					if (i === j || iStar.connectStars.indexOf(jStar) !== -1 || jStar.connectStars.indexOf(iStar) !== -1 || new THREE.Vector3().subVectors(iStar.initCrood, jStar.initCrood).length() > that._maxConnectDistant) return;

					line = new Line(iStar, jStar);
					iStar.connectStars.push(jStar);
					jStar.connectStars.push(iStar);
					iStar.startLines.push(line);
					jStar.endLines.push(line);
					lineGroup.add(line.mesh);
					that._lines.push(line);
				});
			});
			this.objects.lineGroup = lineGroup;

			this.explodeParticles.build();
			this.objects.particleSystem = this.explodeParticles.particleSystem;
		}
	}, {
		key: 'entry',
		value: function entry() {
			var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			(0, _keys2.default)(this.objects).forEach(function (o) {
				M3.scene.add(this.objects[o]);
			}.bind(this));
			this._pStars.forEach(function (pStar) {
				return pStar.mesh.visible = true;
			});

			var that = this;
			var lightUpDur = !animate ? 0 : TIME_4000;
			var starGroupScaleDelay = !animate ? 0 : TIME_800;
			var starGroupScaleDur = !animate ? 0 : TIME_800;

			var starMoveDelay = !animate ? 0 : TIME_400;
			var starMoveDur = !animate ? 0 : TIME_300;

			var gatherDur = !animate ? 0 : TIME_2200;
			var exploreDur = !animate ? 0 : TIME_4000;

			var cameraRotateDur = !animate ? 0 : gatherDur + exploreDur + TIME_1000;

			var lineConnectDelay = !animate ? 0 : TIME_2000;
			var lineConnectDur = !animate ? 0 : TIME_3000;

			if (animate) {
				this.camera.position.set(100, 0, -500);
				this.camera.lookAt(that.explodeParticles.initPos);
				this.camera.up.set(1, 0, 0);
				this.camera.animate({
					position: new THREE.Vector3(0, 0, 300),
					up: new THREE.Vector3(0, 1, 0)
				}, lightUpDur, 0, {
					onUpdate: function onUpdate() {
						that.camera.lookAt(that.explodeParticles.initPos);
					}
				});
			}

			this.explodeParticles.lightUp(lightUpDur).then(function () {
				that.objects.starGroup.rotation.x = Math.PI * 20;
				that.objects.starGroup.animate({
					scale: new THREE.Vector3(1, 1, 1),
					rotation_x: 0
				}, starGroupScaleDur, starGroupScaleDelay, {
					onComplete: function onComplete() {
						that._stars.forEach(function (star) {
							star.mesh.animate({ position: star.initCrood }, starMoveDur, starMoveDelay);
						});
					}
				});

				if (animate) {
					that.addTween(new TWEEN.Tween({ a: Math.PI * 0.5 }).to({ a: Math.PI * 2.5 }, cameraRotateDur).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
						var a = this.a;
						M3.camera.position.x = Math.cos(a) * 300;
						M3.camera.position.z = Math.sin(a) * 300;
						M3.camera.position.y = Math.cos(a) * 200;
						M3.camera.lookAt(that.explodeParticles.initPos);
					}).start());
				}

				return that.explodeParticles.gather(gatherDur);
			}).then(function () {
				return that.explodeParticles.explode(exploreDur);
			}).then(function () {
				that._lines.forEach(function (line) {
					line.connect(lineConnectDur, Math.random() * lineConnectDelay);
				});

				that._controls = new THREE.TrackballControls(that.camera, M3.renderer.domElement);

				that._controls.enabled = true;
				that._controls.travel = true;
				that.interacted = true;

				that._t = that.addTick(function (delta) {
					that._controls.update(delta);
				});
			});
		}
	}, {
		key: 'leave',
		value: function leave() {
			this.interacted = false;
			this._controls.travel = false;
			this._controls.enabled = false;
			this.removeTick(this._t);
			this._pStars.filter(function (pStar) {
				return pStar.selected;
			}).forEach(function (pStar) {
				pStar.mesh.visible = false;
			});

			this.objects.lineGroup.visible = false;
		}
	}, {
		key: '_select',
		value: function _select(star) {
			var that = this;
			if (this._selectedPStars.length === this._maxSelected) {
				this._selectedPStars.shift().unSelect();
			}
			star.select();

			this._controls.travel = false;

			var cameraPosition = star.mesh.position.clone();
			cameraPosition.setLength(cameraPosition.length() + this._minDistant * 0.8);
			this.camera.userData.lookAt = new THREE.Vector3();
			this.camera.stopAnimate().animate({ position: cameraPosition, lookAt: new THREE.Vector3() }, 2000, 0, {
				onComplete: function onComplete() {
					setTimeout(function () {
						that._controls.travel = true;
					}, 1000);
				}
			});

			this._selectedPStars.push(star);
			this.emitEvent('selected-change', [this._selectedPStars]);
		}
	}, {
		key: '_unSelect',
		value: function _unSelect(star) {
			star.unSelect();
			this._selectedPStars = this._selectedPStars.filter(function (pStar) {
				return star !== pStar;
			});
			this.emitEvent('selected-change', [this._selectedPStars]);
		}
	}, {
		key: '_toggle',
		value: function _toggle(star) {
			star.selected ? this._unSelect(star) : this._select(star);
		}
	}, {
		key: 'selectMul',
		value: function selectMul(arr) {}
	}, {
		key: 'toggle',
		value: function toggle(name) {
			var star = this._pStars.filter(function (pStar) {
				return pStar.name === name;
			})[0];
			this._toggle(star);
		}
	}, {
		key: 'getSelected',
		value: function getSelected() {
			return this._pStars.filter(function (pStar) {
				return pStar.selected;
			});
		}
	}]);
	return SelectStars;
}(_stage2.default);

exports.default = SelectStars;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = __webpack_require__(50);

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _stage = __webpack_require__(63);

var _stage2 = _interopRequireDefault(_stage);

var _selectConf = __webpack_require__(69);

var _selectConf2 = _interopRequireDefault(_selectConf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectTable = function (_Stage) {
	(0, _inherits3.default)(SelectTable, _Stage);

	function SelectTable() {
		(0, _classCallCheck3.default)(this, SelectTable);

		var _this = (0, _possibleConstructorReturn3.default)(this, (SelectTable.__proto__ || (0, _getPrototypeOf2.default)(SelectTable)).call(this));

		_this.isInit = false;
		_this.objects;

		_this._BASECROOD = new THREE.Vector3(0, 0, 0);
		_this._CAMERACROOD = new THREE.Vector3(0, 100, 400);

		_this._products = {};

		_this._t;
		_this._controls;

		_this._glowMaterial;
		return _this;
	}

	(0, _createClass3.default)(SelectTable, [{
		key: 'init',
		value: function init() {
			this._glowMaterial = new THREE.GlowMaterial();

			this._buildBase();
			this._buildProductLogo();

			this.isInit = true;
		}
	}, {
		key: 'entry',
		value: function entry() {

			(0, _keys2.default)(this.objects).forEach(function (o) {
				M3.scene.add(this.objects[o]);
			}.bind(this));

			this.camera.position.copy(this._CAMERACROOD);
			this.camera.lookAt(this._BASECROOD);
			this._controls = new THREE.TrackballControls(this.camera, M3.renderer.domElement);
			this._controls.staticMoving = true;

			this.addTHREEObjTween(this.objects.glowSvgMesh.material, {
				uniforms_p_value: 0.05,
				uniforms_glowColor_value: 0xffffff
			}, 4000).start();

			var glowTable = function () {
				var uniforms_p_value = this.objects.tableGlow.material.uniforms.p.value === 1.5 ? 5.7 : 1.5;
				var tableGlowTween = this.addTHREEObjTween(this.objects.tableGlow.material, {
					uniforms_p_value: uniforms_p_value
				}, 4000, {
					onComplete: function onComplete() {
						glowTable();
					}
				}).start();
			}.bind(this);

			glowTable();

			this._t = this.addTick(function (delta) {
				this._controls.update(delta);

				var glowMesh = void 0;

				M3.scene.traverse(function (object) {
					if (object.material && object.material instanceof THREE.ShaderMaterial) {
						object.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(this.camera.position, object.position);
					}
				}.bind(this));
			});

			var gui = new dat.GUI();
			var parameters = { c: 0.5, p: 4.0 };
			var cGUI = gui.add(parameters, 'c').min(0.0).max(1.0).step(0.01).name("c").listen();
			cGUI.onChange(function (value) {
				setPandC(parameters.p, parameters.c);
			});

			var pGUI = gui.add(parameters, 'p').min(0.0).max(6.0).step(0.01).name("p").listen();
			pGUI.onChange(function (value) {
				setPandC(parameters.p, parameters.c);
			});

			function setPandC(p, c) {
				M3.scene.traverse(function (object) {
					if (object.material && object.material instanceof THREE.ShaderMaterial) {
						object.material.uniforms["p"].value = p;
						object.material.uniforms["c"].value = c;
					}
				});
			}
		}
	}, {
		key: 'selectProduct',
		value: function selectProduct(productNames) {
			this._products.forEach(function (_product) {});
		}
	}, {
		key: 'leave',
		value: function leave() {
			this.removeTick();
		}
	}, {
		key: '_createSVGGemo',
		value: function _createSVGGemo(svgString, options) {
			var shape = transformSVGPathExposed(svgString);
			var defaultOptions = {
				amount: 5,
				bevelThickness: 0,
				bevelSize: 0,
				bevelSegments: 12,
				bevelEnabled: false,
				curveSegments: 80,
				steps: 1
			};
			var svgGemo;

			options = $.extend({}, defaultOptions, options);
			svgGemo = new THREE.ExtrudeGeometry(shape, options);
			svgGemo.center();
			return svgGemo;
		}
	}, {
		key: '_buildBase',
		value: function _buildBase() {
			var tableTopGemo = new THREE.CylinderGeometry(100, 100, 3, 100);
			var tableTopMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaff });

			tableTopMaterial.transparent = true;
			tableTopMaterial.opacity = 0.3;
			tableTopMaterial.refractionRatio = 1.3;

			tableTopMaterial.shininess = 37.46;
			tableTopMaterial.specular = new THREE.Color("rgb(0.54, 0.54, 0.54)");

			var tableTop = new THREE.Mesh(tableTopGemo, tableTopMaterial);
			tableTop.position.set(0, 33, 0);

			var tableBottomGemo = new THREE.CylinderGeometry(100, 90, 30, 100, 10);
			var tableBottomMaterial = new THREE.MeshLambertMaterial({ color: 0x3a5c67, 'side': THREE.DoubleSide, 'emissive': 0x888888 });
			var tableBottom = new THREE.Mesh(tableBottomGemo, tableBottomMaterial);
			tableBottom.position.set(0, 15, 0);

			this.objects.tableTop = tableTop;
			this.objects.tableBottom = tableBottom;

			var tableGlowMaterial = new THREE.GlowMaterial({ c: 0.12, p: 6, color: new THREE.Color(0x0cbbef) });
			var tableGlowGemo = new THREE.CylinderGeometry(100, 99.5, 2, 100, 10);
			var tableGlow = new THREE.Mesh(tableGlowGemo, tableGlowMaterial);
			tableGlow.position.set(0, 31, 0);

			this.objects.tableTop = tableTop;
			this.objects.tableBottom = tableBottom;
			this.objects.tableGlow = tableGlow;

			var svgString = _selectConf2.default.logo;
			var options = {
				amount: 5,
				bevelThickness: 0.5,
				bevelSize: 0.5,
				bevelSegments: 12,
				bevelEnabled: true,
				curveSegments: 80,
				steps: 1
			};
			var svgGemo = this._createSVGGemo(svgString, options);
			svgGemo.computeBoundingBox();
			svgGemo.translate(0, -svgGemo.boundingBox.max.y, 0);
			svgGemo.rotateX(Math.PI);

			var svgMaterial = new THREE.MeshPhongMaterial({ color: 0x0cbbef, shininess: 100, metal: true, wireframe: true });
			var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
			svgMesh.position.set(0, 0, 150);
			this.objects.svgLogo = svgMesh;

			var glowMaterial = new THREE.GlowMaterial({ c: 0.12, p: 5, color: 0x0cbbef });
			var glowSvgMesh = new THREE.Mesh(svgGemo.clone(), glowMaterial);
			glowSvgMesh.position.copy(svgMesh.position);
			glowSvgMesh.scale.multiplyScalar(1.1);

			var planeGridCount = 30;
			var gridWidth = 100;
			var planeWidth = planeGridCount * gridWidth;
			var planeHeight = planeGridCount * gridWidth;
			var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
			var material = new THREE.MeshPhongMaterial({ color: 0x3a5c67, side: THREE.DoubleSide });

			var plane = new THREE.Mesh(phaneGeom, material);
			plane.rotation.x = Math.PI * 0.5;
			plane.position.y -= 1;
			this.objects.plane = plane;

			var gridGroup = new THREE.Group();
			var gridMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
			var gridMaterial = this._glowMaterial.clone();
			var gridMesh;

			for (var i = 0; i < planeGridCount; i++) {
				for (var j = 0; j < planeGridCount; j++) {
					if (i % 2 && !(j % 2) || !(i % 2) && j % 2) {
						gridMesh = new THREE.Mesh(new THREE.PlaneGeometry(gridWidth, gridWidth, 1, 1), gridMaterial);
						gridMesh.userData.crood = { x: i, y: j };
						gridMesh.rotation.x = -Math.PI * 0.5;
						gridMesh.position.set(i * gridWidth - planeWidth / 2, 0.1, j * gridWidth - planeHeight / 2);
						gridGroup.add(gridMesh);
					}
				}
			}
			this.objects.gridGroup = gridGroup;

			var cubeGridCount = 35;
			var cubeWidth = planeWidth / cubeGridCount;

			var directionalLightColor = "#ffffff";
			var directionalLight = new THREE.DirectionalLight(directionalLightColor);
			directionalLight.name = this.name + ' directionalLight';
			directionalLight.position.set(-100, 50, 50);
			directionalLight.castShadow = true;
			directionalLight.shadowCameraNear = 0;
			directionalLight.shadowCameraFar = 300;
			directionalLight.shadowCameraLeft = -200;
			directionalLight.shadowCameraRight = 200;
			directionalLight.shadowCameraTop = 200;
			directionalLight.shadowCameraBottom = -200;

			directionalLight.distance = 0;
			directionalLight.intensity = 0.5;
			directionalLight.shadowMapHeight = 1024;
			directionalLight.shadowMapWidth = 1024;
			directionalLight.target.lookAt(this._BASECROOD);


			this.objects.spotLight = new THREE.SpotLight(0xffffff);
			this.objects.spotLight.intensity = 0.8;
			this.objects.spotLight.position.set(-300, 200, 100);
			this.objects.spotLight.lookAt(this._BASECROOD);

			this.objects.spotLight2 = new THREE.SpotLight(0xffffff);
			this.objects.spotLight2.intensity = 0.5;
			this.objects.spotLight2.position.set(100, 200, -100);
			this.objects.spotLight2.lookAt(this._BASECROOD);
		}
	}, {
		key: '_buildProductLogo',
		value: function _buildProductLogo() {
			var logoMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
			var group = new THREE.Group();
			var len = _selectConf2.default.products.length;
			var angelStep = Math.PI * 2 / len;
			var Radius = 90;
			var y = 32;
			var x;
			var z;

			var svgOption = {
				amount: 1,
				bevelThickness: 0.1,
				bevelSize: 0.1,
				bevelSegments: 12,
				bevelEnabled: false,
				curveSegments: 80,
				steps: 1
			};

			_selectConf2.default.products.forEach(function (product, i) {
				var gemo = this._createSVGGemo(product.svgString, svgOption);
				var mesh = new THREE.Mesh(gemo, logoMaterial);

				var glowMesh = new THREE.Mesh(gemo.clone(), this._glowMaterial.clone());

				x = Radius * Math.cos(angelStep * i);
				z = Radius * Math.sin(angelStep * i);

				this._products[product.name] = { 'mesh': mesh, 'glowMesh': glowMesh, 'selected': false };

				mesh.scale.set(0.15, 0.15, 0.15);
				mesh.position.set(x, y, z);
				mesh.rotation.x = Math.PI / 2;
				mesh.rotation.z = Math.PI / 2 + angelStep * i;

				glowMesh.scale.set(0.15, 0.15, 0.15).multiplyScalar(1.2);;
				glowMesh.position.set(x, y, z);
				glowMesh.rotation.x = Math.PI / 2;
				glowMesh.rotation.z = Math.PI / 2 + angelStep * i;

				group.add(mesh);
			}.bind(this));

			this.objects.products = group;
		}
	}]);
	return SelectTable;
}(_stage2.default);

exports.default = SelectTable;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = __webpack_require__(50);

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _view = __webpack_require__(70);

var _view2 = _interopRequireDefault(_view);

var _displayMobile = __webpack_require__(130);

var _displayMobile2 = _interopRequireDefault(_displayMobile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Display = function (_View) {
	(0, _inherits3.default)(Display, _View);

	function Display() {
		(0, _classCallCheck3.default)(this, Display);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Display.__proto__ || (0, _getPrototypeOf2.default)(Display)).call(this));

		_this._lockTick;

		_this._progressView;

		_this.name = 'display';
		_this.isInit = false;
		_this.active = false;

		_this._mobileStages = {};
		_this._currentMobileStages = [];
		_this.stages = [];

		_this._$domWrap = $('#displayView');
		_this._$domManager = $('.display-manager');

		_this._$windowWrap = $('#displayWindowWrap');

		_this._windowDoms = [];
		_this._currentWindowDoms = [];

		_this._progressView = M3.viewManager.getView('progress');
		return _this;
	}

	(0, _createClass3.default)(Display, [{
		key: 'activate',
		value: function activate(data) {
			var that = this;

			if (!this.isInit) {
				this.init();
			}

			if (data) {
				var mobiles = $.extend(true, [], data.mobiles);
				this._currentMobileStages = [];
				mobiles.forEach(function (mobile, i) {
					if (!this._mobileStages[mobile.name]) {
						var mobileStage = new _displayMobile2.default(mobile.name, mobile.position);
						this._mobileStages[mobile.name] = mobileStage;
						this._currentMobileStages.push(mobileStage);
					}
				}.bind(this));

				if (!this._isLoad.bind(this)(this.activate.bind(this))) return;
			}

			M3.time.stop();

			var sizePos = calculateSubWindowSize(this._currentMobileStages.length);
			var x = 0;
			var entryCount = 0;

			this._currentMobileStages.forEach(function (mobileStage, i, all) {
				var meshPos = new THREE.Vector3(x + (i - all.length / 2) * 100, 0, 0);

				mobileStage.entry(sizePos[i]).then(function () {
					entryCount++;
					if (entryCount === all.length) {}
				});
				that.stages.push(mobileStage);
			});
			this._createWindowUI();this._resizeWindows();

			this._$domWrap.removeClass('none');

			this.active = true;
		}
	}, {
		key: 'inActivate',
		value: function inActivate() {
			(0, _keys2.default)(this.scene).forEach(function (o) {
				M3.scene.remove(that.scene[o]);
			});
			this.removeTick(sphereTick);

			this._$domWrap.addClass('none');
			this.activeWindows.forEach(function (activeWindow) {
				setTimeout(function () {
					activeWindow.inActivate();
				}, 0);
			});
			this.activeWindows.length = 0;

			this.stages = [];
			this.active = false;
		}
	}, {
		key: 'resize',
		value: function resize() {
			this._resizeWindows();
		}
	}, {
		key: 'init',
		value: function init() {
			var that = this;
			var $lockBtn = this._$domManager.find('.lock-btn');
			var $unlockBtn = this._$domManager.find('.unlock-btn');
			var $backBtn = this._$domManager.find('.back-btn');

			that.isInit = true;

			this._$domManager.on('click', '.setting-btn', function () {
				that._$domManager.addClass('show');
			});

			this._$domManager.on('click', '.lock-btn', function () {
				$lockBtn.addClass('none');
				$unlockBtn.removeClass('none');
				that._$domManager.removeClass('show');
				that._lock();
			});

			this._$domManager.on('click', '.unlock-btn', function () {
				$unlockBtn.addClass('none');
				$lockBtn.removeClass('none');
				that._$domManager.removeClass('show');
				that._unlock();
			});

			this._$domManager.on('click', '.back-btn', function () {
				that.inActivate();
				that.activateView('product-preview');
				that._$domManager.removeClass('show');
			});

			this._$domWrap.on('click', '.reset-btn', function () {
				var index = $(this).parents('.display-window').index();
				that.resetWindow(index);
			});

			this._$domWrap.on('click', '.close-btn', function () {
				var index = $(this).parents('.display-window').index();
				that._closeWindow(index);
			});

			this._$domWrap.on('click', '.color', function () {
				var index = $(this).parents('.display-window').index();
				var color = $(this).data('color');
				that._currentMobileStages[index].changeColor(color);
				$(this).addClass('selected').silbings().removeClass('selected');
			});
		}
	}, {
		key: '_isLoad',
		value: function _isLoad(callback) {
			var that = this;
			var unloadedCount = 0;
			var loaded = true;
			var loadingInfos = {};

			function loading() {
				var totalSize = 0;
				var loadedSize = 0;
				var progress;
				var loadingInfo;

				for (var name in loadingInfos) {
					loadingInfo = loadingInfos[name];
					totalSize += loadingInfo.size;
					loadedSize += loadingInfo.progress * loadingInfo.size;
				}

				progress = loadedSize / totalSize;
				that._showProgress(progress);
				if (unloadedCount === 0) {
					callback();that._progressView.inactivate();
				}
			}

			for (var name in this._mobileStages) {
				if (!this._mobileStages[name].isInit) {
					loaded = false;
					unloadedCount++;
					loadingInfos[name] = {
						size: this._mobileStages[name].size,
						progress: 0
					};
					(function (_name) {
						that._mobileStages[_name].init(function (progress) {
							loadingInfos[_name].progress = progress;
							loading();
						}).then(function () {
							unloadedCount--;
							loadingInfos[_name].progress = 1;
							loading();
						}).catch(function (e) {
							console.error(e.stack);
						});
					})(name);
				}
			}
			if (!loaded) {
				this._progressView.activate();
			}

			return loaded;
		}
	}, {
		key: '_showProgress',
		value: function _showProgress(progress) {
			this._progressView.setProgress(progress);
		}
	}, {
		key: '_createWindowUI',
		value: function _createWindowUI() {
			var windowTemplate = '<div class="display-window">' + '<div class="window-control">' + '<i class="btn reset-btn icon ion-ios-reload"></i>' + '<i class="btn close-btn icon ion-ios-close-empty"></i>' + '</div>' + '<div class="colors-control"></div>' + '</div>';
			var colorTemplate = '<i class="color @color" data-color="@color"></i>';
			var colorHTML = '';

			this._$windowWrap.html('');
			this._currentWindowDoms = [];
			this._currentMobileStages.forEach(function (mobileStage, i) {
				if (!this._windowDoms[i]) {
					this._windowDoms[i] = $(windowTemplate);
				}
				this._currentWindowDoms[i] = this._windowDoms[i];
				this._$windowWrap.append(this._currentWindowDoms[i]);

				colorHTML = '';
				mobileStage.getColors().forEach(function (color) {
					colorHTML += colorTemplate.replace(/\@color/g, color);
				});
				this._currentWindowDoms[i].find('.colors-control').empty().html(colorHTML);
			}.bind(this));
		}
	}, {
		key: 'resetWindow',
		value: function resetWindow(index) {
			if (this._lockTick) {
				this._currentMobileStages[0].reset();
			} else {
				this._currentMobileStages[index].reset();
			}
		}
	}, {
		key: '_closeWindow',
		value: function _closeWindow(index) {
			this._currentMobileStages[index].remove();
			this._currentMobileStages.splice(index, 1);

			this._currentWindowDoms[index].remove();
			this._currentWindowDoms.splice(index, 1);
			this._resizeWindows();
		}
	}, {
		key: '_resizeWindows',
		value: function _resizeWindows() {
			var sizePos = calculateSubWindowSize(this._currentMobileStages.length);

			this._currentMobileStages.forEach(function (mobileStage, i) {
				mobileStage.resizeWindow(sizePos[i]);
			});

			sizePos = $.extend(true, [], sizePos);
			sizePos.forEach(function (item) {
				for (var pos in item) {
					item[pos] *= 100;item[pos] += '%';
				}
			});

			this._currentWindowDoms.forEach(function ($windowDom, i) {
				$windowDom.css(sizePos[i]);
			});
		}
	}, {
		key: '_lock',
		value: function _lock() {
			this._currentMobileStages.forEach(function (mobileStage, i) {
				mobileStage.lock(i === 0);
			});

			this._lockTick = this.addTick(function () {
				var sizeInfo = this._currentMobileStages[0].getSize();
				this._currentMobileStages.forEach(function (mobileStage, i) {
					if (i > 0) mobileStage.setSize(sizeInfo);
				});
			}.bind(this));
		}
	}, {
		key: '_unlock',
		value: function _unlock() {
			this._currentMobileStages.forEach(function (mobileStage, i) {
				mobileStage.unlock();
			});
			this.removeTick(this._lockTick);this._lockTick = null;
		}
	}]);
	return Display;
}(_view2.default);

exports.default = Display;

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _view = __webpack_require__(70);

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProgressView = function (_View) {
	(0, _inherits3.default)(ProgressView, _View);

	function ProgressView() {
		(0, _classCallCheck3.default)(this, ProgressView);

		var _this = (0, _possibleConstructorReturn3.default)(this, (ProgressView.__proto__ || (0, _getPrototypeOf2.default)(ProgressView)).call(this));

		_this._$progressWrap = document.querySelector('#progressView');
		_this._$progressVal = document.querySelector('#progressVal');
		_this._$water = document.querySelector('.water');
		_this._$waterDivs = _this._$water.querySelectorAll('div');
		_this.setProgress(0);
		return _this;
	}

	(0, _createClass3.default)(ProgressView, [{
		key: 'activate',
		value: function activate() {
			this._$progressWrap.style.display = 'block';
		}
	}, {
		key: 'inactivate',
		value: function inactivate() {
			setTimeout(function () {
				this._$progressWrap.style.display = 'none';
				this.setProgress(0);
			}.bind(this), 1000);
		}
	}, {
		key: 'setProgress',
		value: function setProgress(percent) {
			var initColor = [246, 11, 55];
			var finalColor = [16, 121, 125];
			var opacity = 0.3;
			var currentColor;

			currentColor = finalColor.map(function (colorVal, i) {
				return initColor[i] + (colorVal - initColor[i]) * percent | 0;
			});

			this._$waterDivs.forEach(function ($waterDiv) {
				$waterDiv.style.backgroundColor = 'rgba(' + currentColor.join(',') + ',' + opacity + ')';
			});

			this._$progressVal.innerHTML = (percent * 100 | 0) + '%';
			percent *= 0.999;
			this._$water.style.transform = 'scaleY(' + percent.toFixed(2) + ')';
		}
	}]);
	return ProgressView;
}(_view2.default);

exports.default = ProgressView;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = __webpack_require__(11);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(7);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(8);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(15);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(14);

var _inherits3 = _interopRequireDefault(_inherits2);

var _view = __webpack_require__(70);

var _view2 = _interopRequireDefault(_view);

var _selectTable = __webpack_require__(135);

var _selectTable2 = _interopRequireDefault(_selectTable);

var _selectCube = __webpack_require__(133);

var _selectCube2 = _interopRequireDefault(_selectCube);

var _selectStars = __webpack_require__(134);

var _selectStars2 = _interopRequireDefault(_selectStars);

var _selectConf = __webpack_require__(69);

var _selectConf2 = _interopRequireDefault(_selectConf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectView = function (_View) {
	(0, _inherits3.default)(SelectView, _View);

	function SelectView() {
		(0, _classCallCheck3.default)(this, SelectView);

		var _this = (0, _possibleConstructorReturn3.default)(this, (SelectView.__proto__ || (0, _getPrototypeOf2.default)(SelectView)).call(this));

		_this._selectStarsStage = new _selectStars2.default();

		_this._products = _selectConf2.default.products;
		_this.init();

		return _this;
	}

	(0, _createClass3.default)(SelectView, [{
		key: 'init',
		value: function init() {
			var $selectProducts = $('.select-products');
			var selectHTML = '';
			_selectConf2.default.products.forEach(function (product) {
				selectHTML += '<li data-product-name="' + product.name + '">' + product.name + '</li>';
			});
			$selectProducts.html(selectHTML);
			this._initEvent();
		}
	}, {
		key: '_initEvent',
		value: function _initEvent() {
			var that = this;
			var $selectView = $('#selectView');
			var $ok = $('.select-confirm');
			var $productItems = $('#selectView .select-products li');
			$('#selectView').on('click', '.select-products li', function () {
				if (!that.activate) return;
				var productName = $(this).data('productName');

				that._selectStarsStage.toggle(productName);
			});

			that._selectStarsStage.addListener('selected-change', function (_selecteds) {
				$productItems.removeClass('selected');
				_selecteds.forEach(function (selected) {
					return $productItems.filter('[data-product-name=' + selected.name + ']').addClass('selected');
				});
				$productItems.filter('.selected').length ? $ok.addClass('selected') : $ok.removeClass('selected');
			});
			$('#selectView').on('click', '.select-confirm.selected', function () {

				var selectedData = that._selectStarsStage.getSelected().map(function (pStar) {
					return { 'name': pStar.name, 'position': pStar.mesh.position.clone() };
				});

				M3.viewManager.activateView('display', { mobiles: selectedData });
				that.inactivate();
			});
		}
	}, {
		key: 'activate',
		value: function activate() {

			if (!this._selectStarsStage.isInit) {
				this._selectStarsStage.init();
			}
			this._selectStarsStage.entry();
		}
	}, {
		key: 'inactivate',
		value: function inactivate() {
			this._selectStarsStage.leave();

			$('#selectView').addClass('inactivate');
		}
	}]);
	return SelectView;
}(_view2.default);

exports.default = SelectView;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(141), __esModule: true };

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(143), __esModule: true };

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(151);
var $Object = __webpack_require__(0).Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(152);
module.exports = __webpack_require__(0).Object.keys;

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(47);
__webpack_require__(48);
__webpack_require__(49);
__webpack_require__(153);
__webpack_require__(154);
module.exports = __webpack_require__(0).Set;

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(43);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(16)
  , IObject  = __webpack_require__(65)
  , toObject = __webpack_require__(37)
  , toLength = __webpack_require__(46)
  , asc      = __webpack_require__(147);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(13)
  , isArray  = __webpack_require__(66)
  , SPECIES  = __webpack_require__(1)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(146);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var dP          = __webpack_require__(4).f
  , create      = __webpack_require__(28)
  , redefineAll = __webpack_require__(60)
  , ctx         = __webpack_require__(16)
  , anInstance  = __webpack_require__(51)
  , defined     = __webpack_require__(27)
  , forOf       = __webpack_require__(43)
  , $iterDefine = __webpack_require__(44)
  , step        = __webpack_require__(67)
  , setSpecies  = __webpack_require__(68)
  , DESCRIPTORS = __webpack_require__(3)
  , fastKey     = __webpack_require__(54).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(42)
  , from    = __webpack_require__(144);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global         = __webpack_require__(2)
  , $export        = __webpack_require__(6)
  , meta           = __webpack_require__(54)
  , fails          = __webpack_require__(17)
  , hide           = __webpack_require__(9)
  , redefineAll    = __webpack_require__(60)
  , forOf          = __webpack_require__(43)
  , anInstance     = __webpack_require__(51)
  , isObject       = __webpack_require__(13)
  , setToStringTag = __webpack_require__(21)
  , dP             = __webpack_require__(4).f
  , each           = __webpack_require__(145)(0)
  , DESCRIPTORS    = __webpack_require__(3);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function(target, iterable){
      anInstance(target, C, NAME, '_c');
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        anInstance(this, C, KEY);
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)dP(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(10)
  , $getOwnPropertyDescriptor = __webpack_require__(45).f;

__webpack_require__(59)('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(37)
  , $keys    = __webpack_require__(20);

__webpack_require__(59)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(148);

// 23.2 Set Objects
module.exports = __webpack_require__(150)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(6);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(149)('Set')});

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/mobiles/pro5/pro5uv.png";

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/texture/back.jpg";

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/texture/bottom.jpg";

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/texture/front.jpg";

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/texture/left.jpg";

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/texture/right.jpg";

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/texture/top.jpg";

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "assets/mobiles/pro5/pro5.js";

/***/ }),
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _viewManager = __webpack_require__(115);

var _viewManager2 = _interopRequireDefault(_viewManager);

var _time = __webpack_require__(23);

var _time2 = _interopRequireDefault(_time);

var _loader = __webpack_require__(110);

var _loader2 = _interopRequireDefault(_loader);

var _config = __webpack_require__(114);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(122);
__webpack_require__(123);


(function () {

	window.M3 = {};
	M3.viewManager = new _viewManager2.default();

	var loader = new _loader2.default();
	var progressView = M3.viewManager.getView('progress');
	progressView.activate();

	loader.load(_config.ASSETS, function (percent) {
		progressView.setProgress(percent);
	}).then(function (assets) {
		M3.assets = assets;
		progressView.inactivate();

		M3.assets.envMap = new THREE.CubeTexture([M3.assets.envPosX.texture, M3.assets.envNegX.texture, M3.assets.envPosY.texture, M3.assets.envNegY.texture, M3.assets.envPosZ.texture, M3.assets.envNegZ.texture], THREE.CubeReflectionMapping);

		var urls = [_config.ASSETS.envPosX.url, _config.ASSETS.envNegX.url, _config.ASSETS.envPosY.url, _config.ASSETS.envNegY.url, _config.ASSETS.envPosZ.url, _config.ASSETS.envNegZ.url];
		var textureCube = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeReflectionMapping);
		M3.assets.envMap = textureCube;


		appInit();
	});

	function appInit() {
		window.TIME.start();

		M3.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		M3.scene = new THREE.Scene();
		document.body.appendChild(M3.renderer.domElement);
		M3.renderer.setClearColor(0x2abced, 0);

		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		M3.renderer.setSize(winWidth, winHeight);

		M3.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);

		var fog = new THREE.Fog(0x666666, 0, 2000);


		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.intensity = 0.8;
		spotLight.position.set(-100, 500, 200);
		spotLight.lookAt(new THREE.Vector3());
		M3.scene.add(spotLight);

		var light = new THREE.AmbientLight(0x666666);
		M3.scene.add(light);

		window.addEventListener('resize', function () {
			winWidth = window.innerWidth;
			winHeight = window.innerHeight;
			M3.camera.aspect = winWidth / winHeight;
			M3.camera.updateProjectionMatrix();
			M3.renderer.setSize(winWidth, winHeight);
		});

		function initStats() {

			var stats = new Stats();

			stats.setMode(0);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.zIndex = 100000;
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			return stats;
		}
		var stats = initStats();

		var m3Time = new _time2.default();

		M3.time = new _time2.default();
		M3.time.addTick(function () {
			stats.update();
			M3.renderer.render(M3.scene, M3.camera);
		});

		M3.viewManager.activateView('select');
	}
})();

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map