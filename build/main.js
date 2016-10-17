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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _viewManager = __webpack_require__(1);
	
	var _viewManager2 = _interopRequireDefault(_viewManager);
	
	var _time = __webpack_require__(4);
	
	var _time2 = _interopRequireDefault(_time);
	
	var _loader = __webpack_require__(10);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(function () {
		__webpack_require__(11); //return;
	
		window.M3 = {};
		M3.viewManager = new _viewManager2.default();
	
		// todo: webgl 检查
		// ...
	
	
		var loader = new _loader2.default();
		var progressView = M3.viewManager.getView('progress');
		progressView.activate();
		loader.load({ url: './build/presets.js', size: 100 }, function (percent) {
			progressView.setProgress(percent);
		}).then(function () {
			progressView.inactivate();
			appInit();
		});
	
		function appInit() {
			window.TIME.start();
			// 基本场景
			M3.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	
			M3.scene = new THREE.Scene();
			document.body.appendChild(M3.renderer.domElement);
			M3.renderer.setClearColor(0x2abced, 0);
	
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;
	
			M3.renderer.setSize(winWidth, winHeight);
	
			M3.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
	
			// main render tick
			var m3Time = new _time2.default();
	
			M3.tick = m3Time.addTick(function () {
				M3.renderer.render(M3.scene, M3.camera);
			});
	
			window.addEventListener('resize', function () {
				winWidth = window.innerWidth;
				winHeight = window.innerHeight;
				M3.camera.aspect = winWidth / winHeight;
				M3.camera.updateProjectionMatrix();
				M3.renderer.setSize(winWidth, winHeight);
				console.log('r');
			});
	
			/* helper */
			var axisHelper = new THREE.AxisHelper(100);
			M3.scene.add(axisHelper);
	
			var size = 400;
			var step = 10;
	
			// var gridHelperX = new THREE.GridHelper( size, step, 0xff0000 );
			// gridHelperX.rotation.z = Math.PI / 2;
			// M3.scene.add( gridHelperX );
	
			// var gridHelperY = new THREE.GridHelper( size, step, 0x00ff00 );
			// M3.scene.add( gridHelperY );
	
			// var gridHelperZ = new THREE.GridHelper( size, step, 0x0000ff );
			// gridHelperZ.rotation.x = Math.PI / 2;
			// M3.scene.add( gridHelperZ );
	
	
			// M3.viewManager.activateView('index');
			// M3.viewManager.activateView('display', {mobiles: ['pro5'/*, 'pro6', 'mx5', 'mx6'*/]});
			M3.viewManager.activateView('select');
		}
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
					value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	// import Index from './index.js';
	
	
	var _progress = __webpack_require__(2);
	
	var _progress2 = _interopRequireDefault(_progress);
	
	var _select = __webpack_require__(5);
	
	var _select2 = _interopRequireDefault(_select);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// import Display from './display.js';
	
	var _viewConstructors = {
					'progress': _progress2.default,
					// 'index': Index,
					'select': _select2.default
	};
	
	var _views = {};
	
	var ViewManager = function () {
					function ViewManager() {
									_classCallCheck(this, ViewManager);
	
									this.init();
					}
	
					_createClass(ViewManager, [{
									key: 'init',
									value: function init() {
													// 所有 view 及其管理的 stages 相应窗口变化
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _view = __webpack_require__(3);
	
	var _view2 = _interopRequireDefault(_view);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ProgressView = function (_View) {
		_inherits(ProgressView, _View);
	
		function ProgressView() {
			_classCallCheck(this, ProgressView);
	
			var _this = _possibleConstructorReturn(this, (ProgressView.__proto__ || Object.getPrototypeOf(ProgressView)).call(this));
	
			_this._$progressWrap = document.querySelector('#progressView');
			_this._$progressVal = document.querySelector('#progressVal');
			_this._$water = document.querySelector('.water');
			_this._$waterDivs = _this._$water.querySelectorAll('div');
			_this.setProgress(0);
			return _this;
		}
	
		_createClass(ProgressView, [{
			key: 'activate',
			value: function activate() {
				this._$progressWrap.style.display = 'block';
			}
		}, {
			key: 'inactivate',
			value: function inactivate() {
				setTimeout(function () {
					this._$progressWrap.style.display = 'none';
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _time = __webpack_require__(4);
	
	var _time2 = _interopRequireDefault(_time);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var View = function (_Time) {
	    _inherits(View, _Time);
	
	    function View(viewManager) {
	        _classCallCheck(this, View);
	
	        var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this));
	
	        _this.viewManager = viewManager;
	        _this.stages = []; // 3d 对象
	        _this.active = false;
	        return _this;
	    }
	
	    // 激活视图，data 为接受的参数
	
	
	    _createClass(View, [{
	        key: 'activate',
	        value: function activate(data) {}
	
	        // 冻结视图，data 为接受的参数
	
	    }, {
	        key: 'inactivate',
	        value: function inactivate(data) {}
	    }, {
	        key: 'addStage',
	        value: function addStage(stage) {}
	
	        // 窗口大小变化的操作
	
	    }, {
	        key: 'resize',
	        value: function resize() {}
	    }, {
	        key: 'distroy',
	        value: function distroy() {
	            _get(View.prototype.__proto__ || Object.getPrototypeOf(View.prototype), 'distroy', this).call(this);
	            this.viewManager.removeView(this);
	        }
	    }]);
	
	    return View;
	}(_time2.default);
	
	exports.default = View;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* 时间 */
	var TIME = {
	
		// 所有时间body对象
		bodys: []
	};
	
	stop = false;
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
		TIME.handleFrame();
	
		if (!stop) {
			requestAnimationFrame(TIME.tick);
			//setTimeout(TIME.tick, 20);
		}
	};
	
	TIME.start = function () {
		stop = false;
		this.tick();
	};
	
	TIME.stop = function () {
		stop = true;
	};
	
	TIME.handleFrame = function () {
		var now = new Date().getTime();
		var last = now;
		var delta;
		return function () {
	
			delta = now - last;
			delta = delta > 500 ? 30 : delta < 16 ? 16 : delta;
	
			//console.log(TIME.bodys);
			TIME.bodys.forEach(function (body) {
				if (!body.isStop) {
					body.ticks.forEach(function (tick) {
						tick.fn && tick.fn(delta);
					});
				}
			});
	
			TWEEN.update();
		};
	}();
	
	window.TIME = TIME;
	
	/* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
	
	var Time = function () {
		function Time() {
			_classCallCheck(this, Time);
	
			TIME.addBody(this);
			this.ticks = [];
			this.tweens = [];
			this.isStop = false;
		}
	
		/**
	  * 该物体灭亡
	  */
	
	
		_createClass(Time, [{
			key: 'destory',
			value: function destory() {
				TIME.removeBody(this);
			}
	
			/** 
	   * 帧更新
	   * @param timegap 与上一帧的时间间隔
	   */
	
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
					// remove all
					this.ticks = [];
					return;
				}
	
				var index = this.ticks.indexOf(tick);
	
				if (index !== -1) {
					this.ticks.splice(index, 1);
				}
			}
	
			/** 
	   * tween
	   */
	
		}, {
			key: 'addTween',
			value: function addTween(tween) {
				this.tweens.push(tween);
			}
	
			/*
	   * tweenObj
	   */
	
		}, {
			key: 'addTHREEObjTween',
			value: function addTHREEObjTween(threeObj, target, dur, tweenObj) {
				var that = this;
				var init = {};
				var dest = {};
	
				var attrs = ['x', 'y', 'z', 'r', 'g', 'b', 'opacity'];
				var separater = '_';
	
				function setInit(key) {
					if (key.indexOf('lookAt') === -1) {
						(function () {
							var keyArr = key.split('_');
							var subObj = threeObj;
	
							keyArr.forEach(function (subKey) {
								subObj = subObj[subKey];
							});
							init[key] = subObj;
						})();
					} else {
						init[key] = dest[key]; // lookAt
					}
				}
	
				for (var key in target) {
					var destKey = key;
					if (_typeof(target[key]) === 'object') {
						for (var cKey in target[key]) {
							destKey = key;
							if (attrs.indexOf(cKey) !== -1) {
								destKey += '_' + cKey;
								dest[destKey] = target[key][cKey];
								setInit(destKey);
							}
						}
					} else {
						dest[destKey] = target[key];
						setInit(destKey);
					}
				}
	
				// console.log(init,dest);
	
				var tween;
				tweenObj = tweenObj || {};
				tween = new TWEEN.Tween(init);
				tween.to(dest, dur).easing(tweenObj.easing || TWEEN.Easing.Cubic.InOut).onUpdate(function () {
					var current = this;
	
					var _loop = function _loop(currentKey) {
						if (currentKey.indexOf('lookAt') !== -1) {
							var lookAt = current[currentKey];
							threeObj.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
						}
						var keyArr = currentKey.split('_');
						var last = keyArr.pop();
						var subObj = threeObj;
						keyArr.forEach(function (key) {
							subObj = subObj[key];
						});
						subObj[last] = current[currentKey];
					};
	
					for (var currentKey in current) {
						_loop(currentKey);
					}
					tweenObj.onUpdate && tweenObj.onUpdate();
				}).onComplete(function () {
					that.removeTween(tween);
					tweenObj.onComplete && tweenObj.onComplete();
				});
	
				this.tweens.push(tween);
				return tween;
			}
		}, {
			key: 'removeTween',
			value: function removeTween(tween) {
				if (!tween) {
					// remove all
					this.tween = [];
					return;
				}
	
				var index = this.tweens.indexOf(tween);
	
				if (index !== -1) {
					//tween.stop();
					this.tweens.splice(index, 1);
				}
			}
	
			// stop 暂停时间
	
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
	}();
	
	exports.default = Time;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _view = __webpack_require__(3);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _selectTable = __webpack_require__(6);
	
	var _selectTable2 = _interopRequireDefault(_selectTable);
	
	var _selectCube = __webpack_require__(9);
	
	var _selectCube2 = _interopRequireDefault(_selectCube);
	
	var _selectConf = __webpack_require__(8);
	
	var _selectConf2 = _interopRequireDefault(_selectConf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SelectView = function (_View) {
		_inherits(SelectView, _View);
	
		function SelectView() {
			_classCallCheck(this, SelectView);
	
			var _this = _possibleConstructorReturn(this, (SelectView.__proto__ || Object.getPrototypeOf(SelectView)).call(this));
	
			_this._selectStage = new _selectTable2.default();
			_this._selectCubeStage = new _selectCube2.default();
			_this._products = _selectConf2.default.products;
			_this.init();
			_this.stages.push(_this._selectStage); // super
			return _this;
		}
	
		_createClass(SelectView, [{
			key: 'init',
			value: function init() {}
		}, {
			key: 'activate',
			value: function activate() {
				// stage init
				if (!this._selectStage.isInit) {
					this._selectStage.init();
				}
				if (!this._selectCubeStage.isInit) {
					this._selectCubeStage.init();
				}
	
				// select animation
				this._selectStage.entry();
				this._selectCubeStage.entry();
			}
		}, {
			key: 'inactivate',
			value: function inactivate() {}
		}]);
	
		return SelectView;
	}(_view2.default);
	
	exports.default = SelectView;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _stage = __webpack_require__(7);
	
	var _stage2 = _interopRequireDefault(_stage);
	
	var _selectConf = __webpack_require__(8);
	
	var _selectConf2 = _interopRequireDefault(_selectConf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Dependencies CONFIG.selects
	var SelectTable = function (_Stage) {
		_inherits(SelectTable, _Stage);
	
		function SelectTable() {
			_classCallCheck(this, SelectTable);
	
			var _this = _possibleConstructorReturn(this, (SelectTable.__proto__ || Object.getPrototypeOf(SelectTable)).call(this));
	
			_this.isInit = false;
			_this.objects;
	
			_this._BASECROOD = new THREE.Vector3(0, 0, 0);
			_this._CAMERACROOD = new THREE.Vector3(0, 100, 400);
	
			_this._products = {}; // {'pro5': {mesh: xx, glowMesh, selected: false}}
	
			_this._t;
			_this._controls;
	
			// shader
			_this._glowMaterial;
			return _this;
		}
	
		// this.objects
	
	
		_createClass(SelectTable, [{
			key: 'init',
			value: function init() {
				this._glowMaterial = new THREE.GlowMaterial();
	
				this._buildBase();
				this._buildProductLogo(); //set products
	
				this._controls = new THREE.OrbitControls(this.camera, M3.renderer.domElement);
	
				this.isInit = true;
			}
		}, {
			key: 'entry',
			value: function entry() {
				Object.keys(this.objects).forEach(function (o) {
					M3.scene.add(this.objects[o]);
				}.bind(this));
	
				this.camera.position.copy(this._CAMERACROOD);
				this.camera.lookAt(this._BASECROOD);
	
				this._t = this.addTick(function (delta) {
					this._controls.update(delta);
	
					var glowMesh;
	
					M3.scene.traverse(function (object) {
						if (object.material && object.material instanceof THREE.ShaderMaterial) {
							object.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(this.camera.position, object.position);
						}
					}.bind(this));
				});
	
				// shader test 
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
				// or return a promise so that can do some ani
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
	
				// TABLE 2m width
				var tableTopGemo = new THREE.CylinderGeometry(100, 100, 3, 100);
				var tableTopMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaff });
	
				tableTopMaterial.transparent = true;
				tableTopMaterial.opacity = 0.3;
				tableTopMaterial.refractionRatio = 1.3;
				// tableTopMaterial.reflectivity = 1;
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
	
				var tableGlowGemo = new THREE.CylinderGeometry(95.1, 95, 2, 100, 10);
				var tableGlow = new THREE.Mesh(tableGlowGemo, this._glowMaterial);
				tableGlow.position.set(0, 15, 0);
	
				this.objects.tableTop = tableTop;
				this.objects.tableBottom = tableBottom;
				this.objects.tableGlow = tableGlow;
	
				// MEIZU LOGO
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
	
				var svgMaterial = new THREE.MeshPhongMaterial({ color: 0x0cbbef, shininess: 100, metal: true });
				var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
				svgMesh.position.set(0, 0, 150);
				// this.objects.svgLogo = svgMesh;
	
	
				var glowSvgMesh = new THREE.Mesh(svgGemo.clone(), this._glowMaterial);
				glowSvgMesh.position.copy(svgMesh.position);
				glowSvgMesh.scale.multiplyScalar(1.1);
				this.objects.glowSvgMesh = glowSvgMesh;
	
				// PLANE & GRID & cube
	
				// PLANE 
				var planeGridCount = 30;
				var gridWidth = 100;
				var planeWidth = planeGridCount * gridWidth;
				var planeHeight = planeGridCount * gridWidth;
				var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
				// var material = new THREE.MeshPhongMaterial( {color: 0x3a5c67, side: THREE.DoubleSide} );
				var material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
				var plane = new THREE.Mesh(phaneGeom, material);
				plane.rotation.x = Math.PI * 0.5;
				this.objects.plane = plane;
	
				// GRID 
				var gridGroup = new THREE.Group();
				// var gridMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
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
	
				// CUBE corner
				var cubeGridCount = 35;
				var cubeWidth = planeWidth / cubeGridCount;
	
				// light
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
				// this.objects.directionalLight = directionalLight;
	
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
					var mesh = new THREE.Mesh(gemo, logoMaterial /*.clone()*/);
	
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
	
					// group.add(glowMesh);
					group.add(mesh);
	
					if (i === 0) {
						// mesh.material.color.set(0xffffff);
						// mesh.material.emissive.set(0xeeeeee);
	
						this.addTHREEObjTween(mesh.material, { color: new THREE.Color(0x0cbbef), emissive: new THREE.Color(0xcccccc) }, 3000).start();
	
						this.addTHREEObjTween(this.objects.glowSvgMesh.material, {
							uniforms_c_value: 0.46,
							uniforms_p_value: 0.05
						}, 4000).start();
					}
				}.bind(this));
	
				this.objects.products = group;
			}
		}]);
	
		return SelectTable;
	}(_stage2.default);
	
	exports.default = SelectTable;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _time = __webpack_require__(4);
	
	var _time2 = _interopRequireDefault(_time);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Stage = function (_Time) {
		_inherits(Stage, _Time);
	
		function Stage() {
			_classCallCheck(this, Stage);
	
			var _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this));
	
			_this.objects = {};
			_this.state; // unload, loading, setup, animate
			_this.isInit = false;
			_this.scene;
	
			// 如果不使用默认的 M3 scene 重写constructor 设置新的scene
			_this.scene = M3.scene;
			_this.camera = M3.camera;
			return _this;
		}
	
		// 加载，接受 进度回调， 成功回调
	
	
		_createClass(Stage, [{
			key: 'load',
			value: function load(onProgress, onSuccess) {}
	
			// 装载 3d 对象
	
		}, {
			key: 'init',
			value: function init(onProgress, onSuccess) {}
		}, {
			key: 'resize',
			value: function resize() {}
	
			// 从 M3.scene 中移除
	
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
				_get(Stage.prototype.__proto__ || Object.getPrototypeOf(Stage.prototype), 'destory', this).call(this); // remove tick of time
				this.remove();
				for (var name in this.objects) {
					delete this.objects[name];
				}
			}
		}]);
	
		return Stage;
	}(_time2.default);
	
	exports.default = Stage;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];
	
	var SVG = {
		logo: 'M22.8,41H3c-1.7,0-3,1.4-3,3v15.1h3.6V45.2c0-0.7,0.5-1.2,1.2-1.2h6.3v15.2h3.6V44H21c0.7,0,1.2,0.5,1.2,1.2v13.9h3.5V44C25.8,42.4,24.4,41,22.8,41zM29.6,44v12.1c0,1.7,1.3,3,3,3H48v-2.9H34.3c-0.7,0-1.2-0.5-1.2-1.2v-3.4h14.1v-3H33.1v-3.4c0-0.7,0.5-1.2,1.2-1.2H48V41H32.6C30.9,41,29.6,42.4,29.6,44zM75.3,41H59.4v2.9h13.1L59.9,55.1c-2,1.7-0.7,4,1,4H77v-2.9H63.6L76.2,45C78.3,43.1,77,41,75.3,41zM96.5,41v13.9c0,0.7-0.5,1.2-1.2,1.2l0,0H85.1l0,0c-0.7,0-1.2-0.5-1.2-1.2V41h-3.5v15.1c0,1.7,1.3,3,3,3H97c1.7,0,3-1.3,3-3V41H96.5zM51.8 41L55.5 41L55.5 59.1L51.8 59.1z',
	
		products: []
	
	};
	
	var mx6 = 'M0,66.5h1.9l0,0V37.9l15.4,28.6h1.9l15.2-28.6h0.3v28.6h1.9V34.8h-3L18.2,64L3,34.8H0V66.5zM41.4,34.8l12.9,14.1l1.6-1.4L43.6,34.8M73.1,34.8L60.2,48.9l-1.6-1.4l12.2-12.7H73.1zM41.4,66.5l12.9-14.1l1.6,1.4L43.6,66.5M73.1,66.5L60.2,52.4l-1.6,1.4l12.2,12.7H73.1zM88.7,66.5c-4.1,0-6.9-1.1-8.5-3.3c-1.4-2-2-4.8-2-9.2c0-8,1-12.4,3.3-15.1c2.5-2.8,6.7-4,14-4c0.2,0,0.5,0,1.8,0l0,0l0.1,1.3l-1.7,0c-7.8,0.2-15.1,0.4-15.7,11.7l0,0.6l0.7-0.1c2.7-0.3,6.4-0.7,8.8-0.7c6.5,0,10.5,1.5,10.5,9.2c0,3.7-1,6.2-3,7.6C95.2,65.8,92.6,66.5,88.7,66.5z M80,50.3c-0.1,1.8-0.1,3-0.1,4.3c0,5.2,1,10.5,8.7,10.5c7,0,9.7-2.3,9.7-8.3c0-3.2-0.8-5.2-2.6-6.4c-1.5-1-3.6-1.4-7.2-1.4c-1.6,0-4.3,0.2-8.1,0.8L80,49.8L80,50.3z';
	
	products.forEach(function (productName) {
		SVG.products.push({ "name": productName, svgString: mx6 });
	});
	
	exports.default = SVG;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _stage = __webpack_require__(7);
	
	var _stage2 = _interopRequireDefault(_stage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Dependencies CONFIG.selects
	var SelectCube = function (_Stage) {
		_inherits(SelectCube, _Stage);
	
		function SelectCube() {
			_classCallCheck(this, SelectCube);
	
			var _this = _possibleConstructorReturn(this, (SelectCube.__proto__ || Object.getPrototypeOf(SelectCube)).call(this));
	
			_this.objects;
			_this._BASECROOD = new THREE.Vector3();
			_this._PLANEWIDTH = 1500;
			_this._PLANEHEIGHT = 1500;
			_this._CUBESIZE = 60; // 立方体大小
			_this._GRIDXCOUNT = _this._PLANEWIDTH / _this._CUBESIZE | 0; // 横向个数
			_this._GRIDZCOUNT = _this._PLANEHEIGHT / _this._CUBESIZE | 0; // 纵向 Z(向) 个数
			_this._CUBEHEIGHT = 400;
			_this._MINSCALE = 0.1; // 最小高度缩放
			_this._MAXSCALE = 0.6; // 最大高度缩放
			_this._cubes; // 存储方块信息的二维数组		
			_this.isInit = false;
			return _this;
		}
	
		// this.objects
	
	
		_createClass(SelectCube, [{
			key: 'init',
			value: function init() {
				this.build();
				this.isInit = true;
			}
		}, {
			key: 'build',
			value: function build() {
	
				// cubes
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
							scaleV: Math.random() / 6000, // 缩放速度每一帧缩放 0.??
							scaleMin: this._MINSCALE + (this._MAXSCALE - this._MINSCALE) * Math.random() / 2,
							scaleMax: this._MAXSCALE - (this._MAXSCALE - this._MINSCALE) * Math.random() / 2 };
						// console.log(this._cubes[i][j].position);
						// 
						var cubeSize = this._CUBESIZE * (0.2 + 0.5 * Math.random());
						cubeGeom = new THREE.BoxGeometry(cubeSize, this._CUBEHEIGHT, cubeSize, 2, 2, 2);
						cubeMaterial = new THREE.MeshLambertMaterial({
							color: 0x888888
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
				Object.keys(this.objects).forEach(function (o) {
					M3.scene.add(this.objects[o]);
				}.bind(this));
				this._moveCubes();
			}
		}, {
			key: 'leave',
			value: function leave() {
				// or return a promise so that can do some ani
				this.removeTick();
			}
		}, {
			key: '_moveCube',
			value: function _moveCube(cube) {
				var that = this;
				var target = {};
				var dur;
	
				cube.scaleMin = this._MINSCALE + (this._MAXSCALE - this._MINSCALE) * Math.random() / 2;
				cube.scaleMax = this._MAXSCALE - (this._MAXSCALE - this._MINSCALE) * Math.random() / 2; // 缩放范围
	
				if (cube.cube.scale.y <= cube.scaleMin) {
					target.scale = new THREE.Vector3(1, cube.scaleMax + 0.01, 1);
				} else if (cube.cube.scale.y >= cube.scaleMax) {
					target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
				} else {
					target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
				}
				// target.scale.x = target.scale.z = target.scale.y < 0.7 ? 0.7: target.scale.y;
				// target.rotation = new THREE.Euler( 0, cube.cube.rotation.y + Math.random() * Math.PI * (1 - Math.random()), 0, 'XYZ' );
	
				dur = Math.abs(target.scale.y - cube.cube.scale.y) / cube.scaleV;
	
				cube.tween = that.addTHREEObjTween(cube.cube, target, dur, {
					onUpdate: function onUpdate() {
						cube.glowCube.scale.copy(cube.cube.scale); //.multiplyScalar(1.5);
						//cube.glowCube.scale.y = cube.cube.scale.y + 0.2;
					},
					onComplete: function onComplete() {
						// console.log(target);
						that.removeTween(cube.tween);
						that._moveCube(cube);
					}
				});
				cube.tween.start();
			}
	
			// Normal 方块移动
	
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

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// 下载缓存
	var loadedCache = {};
	
	var Loader = function () {
		function Loader() {
			_classCallCheck(this, Loader);
		}
	
		_createClass(Loader, [{
			key: 'calculateSize',
			value: function calculateSize(loadParams) {
				var totalSize = 0;
				var loadTasks = this._getLoadTasks(loadParams);
	
				for (var i = 0; i < loadTasks.length; i++) {
					totalSize += loadTasks[i].size;
				}
				return totalSize;
			}
	
			// Params 下载任务格式 {url: xx, size: xx}
	
		}, {
			key: 'load',
			value: function load(loadParams, onProgress) {
				var that = this;
				return new Promise(function (onLoad, reject) {
					var totalSize = 0; // 总大小
					var loadedSize = 0; // 已经下载大小
					var loadTasks = [];
					var loadTask;
	
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
							loadTask.loaded = loadTask.size;
							continue;
						}
	
						(function (loadTask) {
							loadMethod[loadTask.type](loadTask.url, function (res) {
								loadedCache[loadTask.url] = res;
								loadTask.loaded = loadTask.size;
	
								// 成功回调
								if (getLoadedSize() / totalSize === 1) {
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
	
			// 获取下载类型
	
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
	
			// 收集下载参数里的 url
	
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
					var type;
	
					if (Object.prototype.toString.call(params) === '[object Array]') {
						params.forEach(function (param) {
							urls = urls.concat(_getLoadTasks(param));
						});
					} else if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && !params.url) {
						for (var key in params) {
							urls = urls.concat(_getLoadTasks(params[key]));
						}
					} else if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && params.url) {
						// 符合资源格式 {url: xx, size: xx}
						type = params.url.match(urlRegx)[1];
	
						urls.push({
							'url': params.url,
							'size': params.size || sizeDefault[type] || 1,
							'type': that._getLoaderType(type)
						});
					}
					return urls;
				}
				return _getLoadTasks(_params);
			}
	
			// 遍历下载参数里的 url， 替换成下载结果缓存
	
		}, {
			key: '_getResults',
			value: function _getResults(_params) {
				var params = $.extend(true, {}, _params);
	
				function _getResults(params) {
					if (Object.prototype.toString.call(params) === '[object Array]') {
						return params.map(function (param) {
							return _getResults(param);
						});
					} else if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && !params.url) {
						for (var key in params) {
							params[key] = _getResults(params[key]);
						}
						return params;
					} else if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && params.url) {
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
	
	/*
	 * 下载 URL等配置在loadconfig.params 中
	 * loadMethod 根据不同type 应用相应策略下载资源缓存在 loaded cache 中
	 * img直接缓存 url 
	 */
	
	
	var loadMethod = {
	
		// 下载图片
		'img': function img(url, onLoad, onProgress) {
			var imgLoader = new THREE.ImageLoader();
			imgLoader.load(url, function () {
				onLoad(url);
			}, function (xhr) {
				return onProgress(xhr.loaded / xhr.total);
			});
		},
	
		// 下载 dae 模型
		'json': function json(url, onLoad, onProgress) {
			var xhrLoader = new THREE.XHRLoader();
			xhrLoader.load(url, onLoad, function (xhr) {
				return onProgress(xhr.loaded / xhr.total);
			});
		},
	
		// 下载 script 
		'js': function js(url, onload, onProgress) {
	
			var req = new XMLHttpRequest();
	
			// report progress events
			req.addEventListener("progress", function (xhr) {
				if (xhr.lengthComputable) {
					onProgress(xhr.loaded / xhr.total);
				}
			}, false);
	
			// load responseText into a new script element
			req.addEventListener("load", function (event) {
				var e = event.target;
				var s = document.createElement("script");
				s.innerHTML = e.responseText;
				// or: s[s.innerText!=undefined?"innerText":"textContent"] = e.responseText
				document.documentElement.appendChild(s);
				onload();
				/*s.addEventListener("load", function() {
	   	console.log(1);
	       
	   });*/
			}, false);
	
			req.open("GET", url);
			req.send();
		}
	};
	
	exports.default = Loader;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map