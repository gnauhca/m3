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
	
	var _loader = __webpack_require__(17);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(19);
	
	(function () {
		__webpack_require__(22); //return;
	
		window.M3 = {};
		M3.viewManager = new _viewManager2.default();
	
		// todo: webgl 检查
		// ...
	
	
		/*var loader = new Loader();
	 var progressView = M3.viewManager.getView('progress');
	 progressView.activate();
	 loader.load({url: './build/presets.js', size: 100}, function(percent) {
	 	progressView.setProgress(percent);
	 }).then(function() {
	 	progressView.inactivate();
	 	appInit();
	 });*/
	
		appInit();
	
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
			});
	
			/* fog */
			var fog = new THREE.Fog(0x000000, 0, 2000);
			// M3.scene.fog = fog;
	
			var size = 400;
			var step = 10;
	
			var spotLight = new THREE.SpotLight(0xffffff);
			spotLight.intensity = 0.8;
			spotLight.position.set(-300, 500, 200);
			spotLight.lookAt(new THREE.Vector3());
			M3.scene.add(spotLight);
	
			/* helper */
			var axisHelper = new THREE.AxisHelper(100);
			M3.scene.add(axisHelper);
			/* grid helper */
			/*	var gridHelperX = new THREE.GridHelper( size, step, 0xff0000 );
	  	gridHelperX.rotation.z = Math.PI / 2;
	  	M3.scene.add( gridHelperX );
	  
	  	var gridHelperY = new THREE.GridHelper( size, step, 0x00ff00 );
	  	M3.scene.add( gridHelperY );
	  
	  	var gridHelperZ = new THREE.GridHelper( size, step, 0x0000ff );
	  	gridHelperZ.rotation.x = Math.PI / 2;
	  	M3.scene.add( gridHelperZ );*/
	
			// M3.viewManager.activateView('index');
			// M3.viewManager.activateView('display', {mobiles: ['pro5', 'pro6'/*, 'mx5', 'mx6'*/]});
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
	
	var _display = __webpack_require__(14);
	
	var _display2 = _interopRequireDefault(_display);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _viewConstructors = {
					'progress': _progress2.default,
					// 'index': Index,
					'select': _select2.default,
					'display': _display2.default
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
		bodys: [],
		delta: 16
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
				// setTimeout(TIME.tick, 1000);
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
					var keyArr = key.split('_');
					var subObj = threeObj;
	
					keyArr.forEach(function (subKey) {
						subObj = subObj[subKey];
					});
					init[key] = subObj;
				}
	
				if (threeObj instanceof THREE.Vector3 && target instanceof THREE.Vector3) {
					// 向量
					['x', 'y', 'z'].forEach(function (pos) {
						init[pos] = threeObj[pos];
						dest[pos] = target[pos];
					});
				} else {
					// object3d or material
					for (var key in target) {
						var destKey = key;
	
						if (key === 'lookAt') {
							(function () {
								var initLookAt = THREE.THREEUtil.getLookAt(threeObj);
								['x', 'y', 'z'].forEach(function (lookAtKey) {
									init['lookAt_' + lookAtKey] = initLookAt[lookAtKey];
									dest['lookAt_' + lookAtKey] = target['lookAt'][lookAtKey];
								});
							})();
						} else {
							if (/color/i.test(key) > 0 && !(target[key] instanceof THREE.Color)) {
								target[key] = new THREE.Color(target[key]);
							}
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
					}
				}
	
				// console.log(init,dest);
				var tween;
				tweenObj = tweenObj || {};
				tween = new TWEEN.Tween(init);
				tween.to(dest, dur).easing(tweenObj.easing || TWEEN.Easing.Cubic.InOut).onUpdate(function () {
					var current = this;
					for (var currentKey in current) {
						if (currentKey.indexOf('lookAt') === -1) {
							(function () {
								var keyArr = currentKey.split('_');
								var last = keyArr.pop();
								var subObj = threeObj;
								keyArr.forEach(function (key) {
									subObj = subObj[key];
								});
								subObj[last] = current[currentKey];
							})();
						}
					}
	
					if (current.lookAt_x) {
						threeObj.lookAt(new THREE.Vector3(current.lookAt_x, current.lookAt_y, current.lookAt_z));
					}
					tweenObj.onUpdate && tweenObj.onUpdate.call(this);
				}).onComplete(function () {
					var completeRemove = true;
					if (tweenObj.onComplete) {
						if (tweenObj.onComplete() === false) completeRemove = false;
					}
	
					completeRemove && that.removeTween(tween);
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
	
	var _selectCube = __webpack_require__(11);
	
	var _selectCube2 = _interopRequireDefault(_selectCube);
	
	var _selectStars = __webpack_require__(12);
	
	var _selectStars2 = _interopRequireDefault(_selectStars);
	
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
	
			// this._selectTable = new SelectTable();
			// this._selectCubeStage = new SelectCube();
	
			var _this = _possibleConstructorReturn(this, (SelectView.__proto__ || Object.getPrototypeOf(SelectView)).call(this));
	
			_this._selectStarsStage = new _selectStars2.default();
	
			_this._products = _selectConf2.default.products;
			_this.init();
	
			// this.stages.push(this._selectTable); // super
			return _this;
		}
	
		_createClass(SelectView, [{
			key: 'init',
			value: function init() {}
		}, {
			key: 'activate',
			value: function activate() {
				var _this2 = this;
	
				// stage init
				// if (!this._selectTable.isInit) {
				// 	this._selectTable.init();
				// }
				// this._selectTable.entry()
	
				// if (!this._selectCubeStage.isInit) {
				// 	this._selectCubeStage.init();
				// }
				// this._selectCubeStage.entry()
	
	
				if (!this._selectStarsStage.isInit) {
					this._selectStarsStage.init().then(function () {
						return _this2._selectStarsStage.entry();
					});
				}
	
				// select animation
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
				this._controls = new THREE.TrackballControls(this.camera, M3.renderer.domElement);
				this._controls.staticMoving = true;
	
				// this.addTHREEObjTween(mesh.material, {color: new THREE.Color(0x0cbbef), emissive: new THREE.Color(0xcccccc)}, 3000).start();
	
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
	
				// glow vertor
				this._t = this.addTick(function (delta) {
					this._controls.update(delta);
	
					var glowMesh = void 0;
	
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
	
				var tableGlowMaterial = new THREE.GlowMaterial({ c: 0.12, p: 6, color: new THREE.Color(0x0cbbef) });
				var tableGlowGemo = new THREE.CylinderGeometry(100, 99.5, 2, 100, 10);
				var tableGlow = new THREE.Mesh(tableGlowGemo, tableGlowMaterial);
				tableGlow.position.set(0, 31, 0);
	
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
	
				var svgMaterial = new THREE.MeshPhongMaterial({ color: 0x0cbbef, shininess: 100, metal: true, wireframe: true });
				var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
				svgMesh.position.set(0, 0, 150);
				this.objects.svgLogo = svgMesh;
	
				var glowMaterial = new THREE.GlowMaterial({ c: 0.12, p: 5, color: 0x0cbbef });
				var glowSvgMesh = new THREE.Mesh(svgGemo.clone(), glowMaterial);
				glowSvgMesh.position.copy(svgMesh.position);
				glowSvgMesh.scale.multiplyScalar(1.1);
				// this.objects.glowSvgMesh = glowSvgMesh;
	
				// PLANE & GRID & cube
	
				// PLANE 
				var planeGridCount = 30;
				var gridWidth = 100;
				var planeWidth = planeGridCount * gridWidth;
				var planeHeight = planeGridCount * gridWidth;
				var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
				var material = new THREE.MeshPhongMaterial({ color: 0x3a5c67, side: THREE.DoubleSide });
				// var material = new THREE.MeshBasicMaterial( {color: 0x333333, side: THREE.DoubleSide} );
				var plane = new THREE.Mesh(phaneGeom, material);
				plane.rotation.x = Math.PI * 0.5;
				plane.position.y -= 1;
				this.objects.plane = plane;
	
				// GRID 
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var buildPath = './build/';
	var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];
	
	var selectConf = {
		logo: 'M22.8,41H3c-1.7,0-3,1.4-3,3v15.1h3.6V45.2c0-0.7,0.5-1.2,1.2-1.2h6.3v15.2h3.6V44H21c0.7,0,1.2,0.5,1.2,1.2v13.9h3.5V44C25.8,42.4,24.4,41,22.8,41zM29.6,44v12.1c0,1.7,1.3,3,3,3H48v-2.9H34.3c-0.7,0-1.2-0.5-1.2-1.2v-3.4h14.1v-3H33.1v-3.4c0-0.7,0.5-1.2,1.2-1.2H48V41H32.6C30.9,41,29.6,42.4,29.6,44zM75.3,41H59.4v2.9h13.1L59.9,55.1c-2,1.7-0.7,4,1,4H77v-2.9H63.6L76.2,45C78.3,43.1,77,41,75.3,41zM96.5,41v13.9c0,0.7-0.5,1.2-1.2,1.2l0,0H85.1l0,0c-0.7,0-1.2-0.5-1.2-1.2V41h-3.5v15.1c0,1.7,1.3,3,3,3H97c1.7,0,3-1.3,3-3V41H96.5zM51.8 41L55.5 41L55.5 59.1L51.8 59.1z',
	
		products: [],
		logoImg: buildPath + __webpack_require__(9),
		particleMap: buildPath + __webpack_require__(10)
	};
	
	var mx6 = 'M0,66.5h1.9l0,0V37.9l15.4,28.6h1.9l15.2-28.6h0.3v28.6h1.9V34.8h-3L18.2,64L3,34.8H0V66.5zM41.4,34.8l12.9,14.1l1.6-1.4L43.6,34.8M73.1,34.8L60.2,48.9l-1.6-1.4l12.2-12.7H73.1zM41.4,66.5l12.9-14.1l1.6,1.4L43.6,66.5M73.1,66.5L60.2,52.4l-1.6,1.4l12.2,12.7H73.1zM88.7,66.5c-4.1,0-6.9-1.1-8.5-3.3c-1.4-2-2-4.8-2-9.2c0-8,1-12.4,3.3-15.1c2.5-2.8,6.7-4,14-4c0.2,0,0.5,0,1.8,0l0,0l0.1,1.3l-1.7,0c-7.8,0.2-15.1,0.4-15.7,11.7l0,0.6l0.7-0.1c2.7-0.3,6.4-0.7,8.8-0.7c6.5,0,10.5,1.5,10.5,9.2c0,3.7-1,6.2-3,7.6C95.2,65.8,92.6,66.5,88.7,66.5z M80,50.3c-0.1,1.8-0.1,3-0.1,4.3c0,5.2,1,10.5,8.7,10.5c7,0,9.7-2.3,9.7-8.3c0-3.2-0.8-5.2-2.6-6.4c-1.5-1-3.6-1.4-7.2-1.4c-1.6,0-4.3,0.2-8.1,0.8L80,49.8L80,50.3z';
	
	products.forEach(function (productName) {
		selectConf.products.push({ "name": productName, svgString: mx6 });
	});
	
	exports.default = selectConf;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/logo.png";

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/select/particle-map.png";

/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _time = __webpack_require__(4);
	
	var _time2 = _interopRequireDefault(_time);
	
	var _stage = __webpack_require__(7);
	
	var _stage2 = _interopRequireDefault(_stage);
	
	var _selectConf = __webpack_require__(8);
	
	var _selectConf2 = _interopRequireDefault(_selectConf);
	
	var _explodeParticles = __webpack_require__(13);
	
	var _explodeParticles2 = _interopRequireDefault(_explodeParticles);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Star = function (_Time) {
		_inherits(Star, _Time);
	
		function Star(initCrood) {
			_classCallCheck(this, Star);
	
			var _this = _possibleConstructorReturn(this, (Star.__proto__ || Object.getPrototypeOf(Star)).call(this));
	
			_this.startLines = []; // 以此星星为起点的 Line
			_this.endLines = []; // 以此星星为终点的 Line
			_this.mesh;
			_this.connectStars = [];
			_this.initCrood = initCrood;
			_this.autoMoveTween;
			return _this;
		}
	
		_createClass(Star, [{
			key: 'init',
			value: function init() {
				this.build();
				this.mesh.position.set(0, 0, 0);
				// this.mesh.scale.set(0, 0, 0);
	
				this.t = this.addTick(function () {
					// this.mesh.rotation.x += 0.02;
					this.mesh.rotation.y += 0.006;
					// this.mesh.rotation.z += 0.02;
				}.bind(this));
	
				var that = this;
			}
		}, {
			key: 'build',
			value: function build() {
				// create mesh
				var gemo = new THREE.SphereGeometry(10, 10, 10);
				gemo = new THREE.TetrahedronGeometry(15, 0);
				if (Math.random() > 0) {
					gemo = new THREE.BoxGeometry(15, 15, 15);
				}
				var material1 = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
				var material2 = THREE.CustomMaterial.glass.clone();
				// material1.opacity = 0.2
				// var material2 = new THREE.MeshPhongMaterial({color: 0xabcdef, transparent: true, opacity: 0.7});
				var mulMaterial = new THREE.MultiMaterial([/*material1, */material2]);
				var mesh = new THREE.Mesh(gemo, mulMaterial);
	
				var mesh = THREE.SceneUtils.createMultiMaterialObject(gemo, [/*material1, */material2]);
	
				mesh.rotation.set(Math.random(), Math.random(), Math.random());
	
				this.mesh = mesh;
			}
		}, {
			key: 'setCrood',
			value: function setCrood(crood) {
				this.mesh.position.copy(crood);
				this.startLines.forEach(function (line) {
					line.setStart(crood);
				});
				this.endLines.forEach(function (line) {
					line.setEnd(crood);
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
		_inherits(ProductStar, _Star);
	
		function ProductStar(crood, svgString) {
			_classCallCheck(this, ProductStar);
	
			var _this2 = _possibleConstructorReturn(this, (ProductStar.__proto__ || Object.getPrototypeOf(ProductStar)).call(this, crood));
	
			_this2.name;
			_this2.svgString = svgString;
			return _this2;
		}
	
		_createClass(ProductStar, [{
			key: 'init',
			value: function init() {
				_get(ProductStar.prototype.__proto__ || Object.getPrototypeOf(ProductStar.prototype), 'init', this).call(this);
				this.removeTick(this.t);
			}
		}, {
			key: 'build',
			value: function build() {
				_get(ProductStar.prototype.__proto__ || Object.getPrototypeOf(ProductStar.prototype), 'build', this).call(this);
				var group = new THREE.Group();
				var svgGemo = new THREE.SVGGemetry(this.svgString, {});
				var material = new THREE.MeshBasicMaterial({ color: 0x0cbbef });
				// var material = new THREE.MeshPhongMaterial({color: 0x0a4fdc});
				var mesh = new THREE.Mesh(svgGemo, material);
				mesh.scale.set(0.1, 0.1, 0.1);
				this.svgMesh = mesh;
	
				group.add(mesh);
				group.add(this.mesh);
				this.mesh = group;
			}
		}, {
			key: 'lightUp',
			value: function lightUp() {}
		}]);
	
		return ProductStar;
	}(Star);
	
	var Line = function (_Time2) {
		_inherits(Line, _Time2);
	
		function Line(croodStart, croodEnd) {
			_classCallCheck(this, Line);
	
			var _this3 = _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));
	
			_this3.start = croodStart.clone();
			_this3.end = croodEnd.clone();
	
			_this3.init();
			_this3.setStart(croodStart);
			_this3.setEnd(croodEnd);
			return _this3;
		}
	
		_createClass(Line, [{
			key: 'init',
			value: function init() {
				var material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 });
				var gemo = new THREE.Geometry();
				gemo.vertices.push(this.start, this.end);
				var line = new THREE.Line(gemo, material);
				this.mesh = line;
				this.mesh.visible = false;
			}
		}, {
			key: 'connect',
			value: function connect() {
				var random = Math.random() * 2 | 0;
				var movePoint = ['start', 'end'][random];
				var staticPoint = ['start', 'end'][(random + 1) % 2];
				var dest = this[movePoint].clone();
	
				this.mesh.visible = true;
				this[movePoint].copy(this[staticPoint]);
				this.addTHREEObjTween(this[movePoint], dest, 2000).start();
				this.addTHREEObjTween(this.mesh.material, { opacity: 0.2 }, 2000).start();
			}
		}, {
			key: 'setStart',
			value: function setStart(crood) {
				this.start.copy(crood);
				this.mesh.geometry.verticesNeedUpdate = true;
			}
		}, {
			key: 'setEnd',
			value: function setEnd(crood) {
				this.end.copy(crood);
				this.mesh.geometry.verticesNeedUpdate = true;
			}
		}]);
	
		return Line;
	}(_time2.default);
	
	var SelectStars = function (_Stage) {
		_inherits(SelectStars, _Stage);
	
		function SelectStars() {
			_classCallCheck(this, SelectStars);
	
			var _this4 = _possibleConstructorReturn(this, (SelectStars.__proto__ || Object.getPrototypeOf(SelectStars)).call(this));
	
			_this4.isInit = false;
	
			_this4._gridSize = 30;
			_this4._starCount = 60;
			_this4._rangeX = 20; // 边长
			_this4._rangeY = 10; // 边长
			_this4._rangeZ = 20; // 边长
	
			_this4._minDistant = _this4._gridSize * 3; // 两个点之间最小间隔
			_this4._maxConnectDistant = _this4._gridSize * 4; // 两个点的距离小于多少被连在一起
	
			_this4._stars = [];
			_this4._products;
	
			_this4.explodeParticle = new _explodeParticles2.default();
			return _this4;
		}
	
		_createClass(SelectStars, [{
			key: 'init',
			value: function init() {
				this._products = $.extend(true, [], _selectConf2.default.products);
				this.isInit = true;
				return this._build();
			}
		}, {
			key: '_build',
			value: function _build() {
				var _this5 = this;
	
				var that = this;
				var starCroods = [];
				var starCrood = void 0;
				var isValidCrood = false;
				var starGroup = new THREE.Group();
	
				var toBaseVec = new THREE.Vector3(-this._gridSize * this._rangeX / 2, -this._gridSize * this._rangeY / 2, -this._gridSize * this._rangeZ / 2);
	
				var _loop = function _loop() {
	
					starCrood = new THREE.Vector3(parseInt(_this5._rangeX * Math.random()) * _this5._gridSize, parseInt(_this5._rangeY * Math.random()) * _this5._gridSize, parseInt(_this5._rangeZ * Math.random()) * _this5._gridSize);
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
	
				// 在生成的 stars 点中，随机选择作为产品 star
				var productIndexes = new Set();
				while (productIndexes.size < this._products.length) {
					productIndexes.add(Math.random() * this._starCount | 0);
				}
				// console.log(starCroods, productIndexes);
				var productCfgIndex = 0; // selectCfg.products 的 index
				starCroods.forEach(function (starCrood, index) {
					var star;
					if (productIndexes.has(index)) {
						star = new ProductStar(starCrood, that._products[productCfgIndex].svgString);
						star.init();
						star.name = that._products[productCfgIndex].name;
						that._products[productCfgIndex].star = star;
						productCfgIndex++;
					} else {
						star = new Star(starCrood);star.init();
					}
					star.setCrood(starCrood);
					that._stars.push(star);
					starGroup.add(star.mesh);
				});
				this.objects.starGroup = starGroup;
				this.objects.starGroup.scale.set(0.0001, 0.0001, 0.0001);
	
				// line
				var line = void 0;
				var lineGroup = new THREE.Group();
				this._stars.forEach(function (iStar, i) {
					that._stars.forEach(function (jStar, j) {
						if (i === j || iStar.connectStars.indexOf(jStar) !== -1 && jStar.connectStars.indexOf(iStar) !== -1 || new THREE.Vector3().subVectors(iStar.mesh.position, jStar.mesh.position).length() > that._maxConnectDistant) return;
	
						line = new Line(iStar.mesh.position, jStar.mesh.position);
						iStar.connectStars.push(jStar);
						jStar.connectStars.push(iStar);
						iStar.startLines.push(line);
						jStar.endLines.push(line);
						lineGroup.add(line.mesh);
					});
				});
				this.objects.lineGroup = lineGroup;
	
				// import build
				return new Promise(function (resolve) {
					that.explodeParticle.build().then(function () {
						that.objects.particleSystem = that.explodeParticle.particleSystem;
						resolve();
					}.bind(that));
				}).catch(function (e) {
					return console.error(e.stack);
				});
			}
		}, {
			key: 'entry',
			value: function entry() {
				var that = this;
				Object.keys(this.objects).forEach(function (o) {
					M3.scene.add(this.objects[o]);
				}.bind(this));
	
				// lightUp
				// this.camera.lookAt(this.objects.particleSystem.position);
				// console.log(this.explodeParticle.initPos);
	
	
				this.explodeParticle.lightUp().then(function () {
					that.explodeParticle.explode();
	
					setTimeout(function () {
						that.addTHREEObjTween(that.objects.starGroup, {
							scale: new THREE.Vector3(1, 1, 1)
						}, 3000).start();
					}, 1500);
				});
	
				// line connect
	
				// control travel
	
				/*this._controls = new THREE.TrackballControls(this.camera, M3.renderer.domElement);
	   this._controls.staticMoving = true;
	   this._controls.travel = false;
	   this._t = this.addTick(function(delta) {
	   	this._controls.update(delta);
	   });*/
			}
		}]);
	
		return SelectStars;
	}(_stage2.default);
	
	exports.default = SelectStars;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _time = __webpack_require__(4);
	
	var _time2 = _interopRequireDefault(_time);
	
	var _selectConf = __webpack_require__(8);
	
	var _selectConf2 = _interopRequireDefault(_selectConf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ExplodeParticles = function (_Time) {
	    _inherits(ExplodeParticles, _Time);
	
	    function ExplodeParticles() {
	        _classCallCheck(this, ExplodeParticles);
	
	        var _this = _possibleConstructorReturn(this, (ExplodeParticles.__proto__ || Object.getPrototypeOf(ExplodeParticles)).call(this));
	
	        _this.particleSystem;
	        _this.initPos = new THREE.Vector3(0, 0, 0);
	        _this.finalPos = new THREE.Vector3(0, 0, 0);
	        return _this;
	    }
	
	    _createClass(ExplodeParticles, [{
	        key: 'init',
	        value: function init() {}
	    }, {
	        key: 'build',
	        value: function build() {
	            var that = this;
	            var logoImg;
	            var particleMap;
	
	            return new Promise(function (loaded) {
	                logoImg = new Image();
	                logoImg.src = _selectConf2.default.logoImg;
	                logoImg.onload = function () {
	                    new THREE.TextureLoader().load(_selectConf2.default.particleMap, function (texture) {
	                        particleMap = texture;
	                        loaded();
	                    });
	                };
	            }).then(function () {
	                var imgData = getImageData(logoImg, 0, 0, 0);
	                var zRandom = 200;
	                var yOffset = 0; //-500;
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
	                    v3.initV = v3.clone(); // for lightUp
	                    v3.lightupZ = (Math.random() - 0.5) * 5 * zRandom;
	                    v3.z = v3.lightupZ;
	
	                    v3.exAngle = Math.random() * Math.PI * 2; // for explode
	                    v3.exAngleY = (Math.random() - 0.5) * Math.PI * 1; // for explode
	                    v3.rPercent = Math.random() * 2 + 1;
	                    geom.vertices.push(v3);
	                    // geom.vertices.push(v3);
	                });
	                that.particleSystem = new THREE.ParticleSystem(geom, material);
	                // M3.scene.add(that.particleSystem);
	                // console.log(that.particleSystem);
	            }).catch(function (e) {
	                return console.error(e.stack);
	            });
	            //M3.scene.add(that.particleSystem);
	        }
	    }, {
	        key: 'lightUp',
	        value: function lightUp() {
	            var that = this;
	            var dur = 4000;
	            var cameraTween = void 0;
	
	            return new Promise(function (resolve) {
	                // camera ani
	                M3.camera.position.set(100, 0, -500);
	                M3.camera.lookAt(that.initPos);
	                M3.camera.up.set(1, 0, 0);
	                cameraTween = that.addTHREEObjTween(M3.camera, {
	                    position: new THREE.Vector3(0, 0, 500),
	                    up: new THREE.Vector3(0, 1, 0)
	                }, dur, {
	                    onUpdate: function onUpdate() {
	                        M3.camera.lookAt(that.initPos);
	                    },
	                    onComplete: function onComplete() {
	                        that.removeTween(cameraTween);
	                    }
	                }).start();
	
	                // particle ani
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
	        key: 'rise',
	        value: function rise() {
	            var cameraTween = this.addTHREEObjTween(M3.camera, {
	                position: new THREE.Vector3(0, -500, 0),
	                lookAt: this.finalPos,
	                up: new THREE.Vector3(0, 1, 0)
	            }, dur, {
	                // onUpdate() { M3.camera.lookAt(that.initPos); },
	                onComplete: function onComplete() {
	                    that.removeTween(cameraTween);
	                }
	            }).start();
	
	            var maxR = 300; // 旋转飞起最大半径
	            var maxA = Math.PI * 3; // 每个粒子旋转最大角度
	
	        }
	    }, {
	        key: 'explode',
	        value: function explode() {
	            var that = this;
	            var gatherDur = 1500;
	            var explodeDur = 3000;
	            var cameraDur = gatherDur + explodeDur;
	            var gatherTween = new TWEEN.Tween({ p: 1 }).to({ p: -1 }, gatherDur);
	            var explodeTween = new TWEEN.Tween({ r: 0, size: 3 }).to({ r: 1000, size: 40 }, explodeDur);
	            var cameraTween = new TWEEN.Tween({ a: Math.PI * 0.5 }).to({ a: Math.PI * 2.5 }, cameraDur + 1000);
	
	            cameraTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
	                // 聚集
	                var a = this.a;
	                M3.camera.position.x = Math.cos(a) * 500;
	                M3.camera.position.z = Math.sin(a) * 500;
	                M3.camera.position.y = Math.cos(a) * 200;
	                M3.camera.lookAt(that.initPos);
	            }).onComplete(function () {}).start();
	
	            gatherTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
	
	                // 聚集
	                var p = this.p > 0 ? this.p : 0;
	                that.particleSystem.geometry.verticesNeedUpdate = true;
	                that.particleSystem.geometry.vertices.forEach(function (v3) {
	                    v3.setLength(v3.initV.length() * p);
	                });
	            }).onComplete(function () {
	                // console.log
	                // explode
	                explodeTween.start();
	            }).start();
	
	            explodeTween.easing(TWEEN.Easing.Cubic.Out).onUpdate(function () {
	                // explode
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
	            }).onComplete(function () {}); //.start();
	
	
	            this.addTween(gatherTween);
	            this.addTween(explodeTween);
	        }
	    }]);
	
	    return ExplodeParticles;
	}(_time2.default);
	
	exports.default = ExplodeParticles;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _view = __webpack_require__(3);
	
	var _view2 = _interopRequireDefault(_view);
	
	var _displayMobile = __webpack_require__(15);
	
	var _displayMobile2 = _interopRequireDefault(_displayMobile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// import DisplayContainerStage from '../stages/display-container.js';
	
	var Display = function (_View) {
		_inherits(Display, _View);
	
		function Display() {
			_classCallCheck(this, Display);
	
			var _this = _possibleConstructorReturn(this, (Display.__proto__ || Object.getPrototypeOf(Display)).call(this));
	
			_this._lockTick;
			// this._containerStage; 
			_this._progressView;
	
			_this.name = 'display';
			_this.isInit = false;
			_this.active = false;
	
			// stages
			_this._mobileStages = {}; // {pro6: xx, mx6: xx} for cache
			_this._currentMobileStages = [];
			_this.stages = [];
	
			// UI
			_this._$domWrap = $('#displayView');
			_this._$domManager = $('.display-manager');
	
			_this._$windowWrap = $('#displayWindowWrap');
	
			_this._windowDoms = [];
			_this._currentWindowDoms = [];
	
			_this._progressView = M3.viewManager.getView('progress');
			// this._containerStage = new DisplayContainerStage();
			// this.stages.push(this._containerStage);
			return _this;
		}
	
		// data : {mobile: [pro5, mx6 ...]}
	
	
		_createClass(Display, [{
			key: 'activate',
			value: function activate(data) {
				var that = this;
				// check self init
				if (!this.isInit) {
					this.init();
					// this._containerStage.init();
				}
	
				if (data) {
					var mobiles = $.extend(true, [], data.mobiles);
					this._currentMobileStages = [];
					mobiles.forEach(function (name, i) {
						if (!this._mobileStages[name]) {
							var mobileStage = new _displayMobile2.default(name);
							this._mobileStages[name] = mobileStage;
							this._currentMobileStages.push(mobileStage);
						}
					}.bind(this));
	
					// this._isload 如果检查到需要加载，会启动加载，并在加载完成之后调用回调
					if (!this._isLoad.bind(this)(this.activate.bind(this))) return;
				}
	
				// all loaded 
				//this._containerStage.entry();// containerStage
	
				var sizePos = calculateSubWindowSize(this._currentMobileStages.length);
				var x = 0;
				var entryCount = 0;
	
				this._currentMobileStages.forEach(function (mobileStage, i, all) {
					var meshPos = new THREE.Vector3(x + (i - all.length / 2) * 100, 0, 0);
					mobileStage.entry(meshPos, sizePos[i]).then(function () {
						entryCount++;
						if (entryCount === all.length) {
							// todo entry animate done
						}
					});
					that.stages.push(mobileStage);
				});
				this._createWindowUI();this._resizeWindows();
	
				// UI
				this._$domWrap.removeClass('none');
	
				this.active = true;
			}
		}, {
			key: 'inActivate',
			value: function inActivate() {
				Object.keys(this.scene).forEach(function (o) {
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
	
				// this._containerStage.leave();
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
	
				// windows
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
						// loaded 
						callback();that._progressView.inactivate();
					}
				}
	
				for (var name in this._mobileStages) {
					// loading
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
				//console.log('display.js loading: ' + progress);
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
	
			// 模型恢复初始状态
	
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
	
				// ui remove
				this._currentWindowDoms[index].remove();
				this._currentWindowDoms.splice(index, 1);
				this._resizeWindows();
			}
		}, {
			key: '_resizeWindows',
			value: function _resizeWindows() {
				var sizePos = calculateSubWindowSize(this._currentMobileStages.length);
	
				// stage resize
				this._currentMobileStages.forEach(function (mobileStage, i) {
					mobileStage.resizeWindow(sizePos[i]);
				});
	
				// ui resize
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
				that.removeTick(this._lockTick);this._lockTick = null;
			}
		}]);
	
		return Display;
	}(_view2.default);
	
	exports.default = Display;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _stage = __webpack_require__(7);
	
	var _stage2 = _interopRequireDefault(_stage);
	
	var _mobile = __webpack_require__(16);
	
	var _mobile2 = _interopRequireDefault(_mobile);
	
	var _m3Trackballcontrol = __webpack_require__(21);
	
	var _m3Trackballcontrol2 = _interopRequireDefault(_m3Trackballcontrol);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DisplayMobile = function (_Stage) {
		_inherits(DisplayMobile, _Stage);
	
		function DisplayMobile(mobileName) {
			_classCallCheck(this, DisplayMobile);
	
			var _this = _possibleConstructorReturn(this, (DisplayMobile.__proto__ || Object.getPrototypeOf(DisplayMobile)).call(this));
	
			_this._windowSize; // for px calculate
			_this._winSizePX; // for render 
	
			// 3D 资源
			_this._camera;
			_this._mobile;
	
			_this.name; // pro5?
			_this.size;
			_this.isInit = false;
	
			_this.trackball;
			_this.objects = {};
			_this.target;
	
			// 模型位置，旋转等信息
			_this.objectSizes = {
				model: { position: null, rotation: null },
				camera: { position: null, lookAt: null }
			};
	
			// 状态
			_this.state;
	
			_this.color;
	
			_this.locked = false;
			_this.active = false;
	
			_this.name = mobileName;
			_this._mobile = new _mobile2.default(_this.name);
			_this.size = _this._mobile.size;
			return _this;
		}
	
		_createClass(DisplayMobile, [{
			key: 'load',
			value: function load(onProgress) {
				return this._mobile.load(onProgress);
			}
		}, {
			key: 'init',
			value: function init(onProgress) {
				var that = this;
				return this.load(onProgress).then(function () {
					return new Promise(function (resolve, reject) {
						// init
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
			value: function entry(meshPos, windowSize) {
				this._windowSize = windowSize;
				// 3d
				this.target = new THREE.Vector3(meshPos.x, meshPos.y, meshPos.z);
	
				this.objects.mesh.position.copy(this.target);
				// this.objects.mesh.rotation.copy(new THREE.Euler(Math.PI/3, -0.2, .8, 'XYZ' ));
				this._camera.up.copy(M3.camera.up);
				this._camera.position.copy(M3.camera.position);
				this._camera.position.z += 40;
				this._camera.lookAt(THREE.THREEUtil.getLookAt(M3.camera));
	
				// light
				this.objects.spotLight.position.copy(this.target);
				this.objects.spotLight.position.y += 200;
				this.objects.spotLight.position.x += 300;
				this.objects.spotLight.position.z += 100;
				this.objects.spotLight.lookAt(this.target);
	
				// initial size info
				this.objectSizes = { mesh: {}, camera: {} };
				this.objectSizes.mesh.position = this.objects.mesh.position.clone();
				this.objectSizes.mesh.rotation = this.objects.mesh.rotation.clone();
	
				this.objectSizes.camera.position = this.objects.mesh.position.clone();
				this.objectSizes.camera.position.z += 50;
				this.objectSizes.camera.lookAt = this.objects.mesh.position.clone();
	
				// 添加到场景
				Object.keys(this.objects).forEach(function (o) {
					M3.scene.add(this.objects[o]);
				}.bind(this));
	
				this.resize();
	
				this._changeColor();
				this.addTick(this._render.bind(this));
	
				return this._playEntryAnimation();
			}
	
			// 窗口关闭
	
		}, {
			key: 'leave',
			value: function leave() {
	
				// 移除模型
				console.log(Object.keys(this.objects));
				Object.keys(this.objects).forEach(function (o) {
					M3.scene.remove(that.objects[o]);
				});
				// render();
				this.$domElem.remove();
				this.getView('display-manager').removeWindow(this);
				this.removeTween();
				this.removeTick();
				this.active = false;
			}
	
			// 窗口重置
	
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
	
			// 获取模型旋转信息，相机相对信息，用于设置其他 displayWindow 使表现一致；
	
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
				// this._camera.rotation.copy(size.cameraRotation);
				// this._camera.up = size.cameraUp;
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
	
			/*
	   * 从scene 中移除模型
	   */
	
		}, {
			key: 'remove',
			value: function remove() {
				_get(DisplayMobile.prototype.__proto__ || Object.getPrototypeOf(DisplayMobile.prototype), 'remove', this).call(this);
				this.removeTick();
			}
	
			// model，trackball 重置
	
		}, {
			key: 'reset',
			value: function reset() {
				//console.log(this.objectSizes.mesh.position);
				this.setState('animate');
	
				var initModelRotation = this.objectSizes.mesh.rotation;
				var initCameraPosition = this.objectSizes.camera.position;
				var initCameraLookAtPosition = this.objectSizes.camera.position;
	
				this.addTHREEObjTween(this.objects.mesh, {
					rotation: initModelRotation
				}, 1000).start();
	
				this.addTHREEObjTween(this._camera, {
					position: initCameraPosition,
					lookAt: initCameraLookAtPosition
				}, 1000, {
					onComplete: function () {
						this.setState('handle');
					}.bind(this)
				}).start();
			}
		}, {
			key: '_setupScene',
			value: function _setupScene() {
	
				// 3D 相关资源创建
				this.objects.spotLight = new THREE.SpotLight(0xeeeeee);
				this.objects.spotLight.intensity = 1;
				this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	
				this.trackball = new _m3Trackballcontrol2.default(this._camera);
				// this.trackball.enabled = false;
			}
		}, {
			key: '_changeColor',
			value: function _changeColor(color) {
				this._mobile.changeColor(color);
			}
	
			/* 动画 */
	
		}, {
			key: '_playEntryAnimation',
			value: function _playEntryAnimation() {
				var that = this;
				return new Promise(function (resolve, reject) {
					that.setState('animate');
	
					var initModelRotation = that.objectSizes.mesh.rotation;
					var initCameraPosition = that.objectSizes.camera.position;
	
					that.objects.mesh.rotation.copy(initModelRotation);
					that.objects.mesh.rotation.x -= Math.PI * 0.5;
					that.objects.mesh.rotation.z += Math.PI * 1.2;
					that.addTHREEObjTween(that.objects.mesh, {
						rotation: initModelRotation
					}, 2000).start();
	
					that.addTHREEObjTween(that._camera, {
						position: initCameraPosition
					}, 2000, {
						onComplete: function onComplete() {
							that.setState('handle');
							resolve();
						}
					}).start();
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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _time = __webpack_require__(4);
	
	var _time2 = _interopRequireDefault(_time);
	
	var _loader = __webpack_require__(17);
	
	var _loader2 = _interopRequireDefault(_loader);
	
	var _mobileConf = __webpack_require__(18);
	
	var _mobileConf2 = _interopRequireDefault(_mobileConf);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Dependencies CONFIG.mobiles
	
	
	var loader = new _loader2.default();
	var mobileEnvMap;
	var JSONLoader = new THREE.JSONLoader();
	
	var Mobile = function (_Time) {
		_inherits(Mobile, _Time);
	
		function Mobile(mobileName) {
			_classCallCheck(this, Mobile);
	
			var _this = _possibleConstructorReturn(this, (Mobile.__proto__ || Object.getPrototypeOf(Mobile)).call(this));
	
			_this.mesh; // group
			_this.size; // 资源大小
	
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
	
		_createClass(Mobile, [{
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
					return new Promise(function (resolve) {
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
	
							if (material.name.match('glass')) {}
							/*if (material.name.indexOf('metal') >= 0) {
	      	var texture = new THREE.ImageUtils.loadTexture('./assets/pro5/metal.jpg');
	      	texture.repeat.set(50,50);
	              		texture.wrapS = THREE.RepeatWrapping;
	              		texture.wrapT = THREE.RepeatWrapping;
	      		material = new THREE.MeshPhongMaterial({
	      		map: texture,
	      		bumpMap: texture,
	      		bumpScale: 0.1
	      		// aoMapIntensity: 2
	      	});
	      	}*/
	
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
				// change path
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

/***/ },
/* 17 */
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
							'type': params.type || that._getLoaderType(type)
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
		'img': function img(url, onload, onProgress) {
			var imgLoader = new THREE.ImageLoader();
			imgLoader.load(url, function () {
				onload(url);
			}, function (xhr) {
				return onProgress(xhr.loaded / xhr.total);
			});
		},
	
		// 下载 模型
		'json': function json(url, onload, onProgress) {
			var xhrLoader = new THREE.XHRLoader();
			xhrLoader.load(url, onload, function (xhr) {
				return onProgress(xhr.loaded / xhr.total);
			});
		},
	
		// model 
		'model': function model(url, onload, onProgress) {
			var xhrLoader = new THREE.XHRLoader();
			xhrLoader.load(url, function (str) {
				onload(str.replace(/module\.exports\s*=\s*/, ''));
			}, function (xhr) {
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// 模型是 webpack Chunk，需要知道webpack 处理之后的路径
	var buildPath = './build/';
	
	var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];
	
	var mobile = {
		'models': { url: buildPath + __webpack_require__(19), size: 300, 'type': 'model' },
	
		// 贴图，file-loader 获取路径
		'map': {
			'default': { url: __webpack_require__(20), size: 3000 }
		}
	};
	
	var mobiles = [];
	
	products.forEach(function (productName) {
		mobiles.push({ "name": productName, mobile: mobile });
	});
	
	exports.default = mobiles;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/mobiles/pro5/pro5.js";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/mobiles/pro5/pro5uv.png";

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @author Eberhard Graether / http://egraether.com/
	 * @author Mark Lundin 	/ http://mark-lundin.com
	 */
	
	var TrackballControls = function TrackballControls() {
	
		var _this = this;
		var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
	
		this.domElement = document;
	
		// API
	
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
	
		// internals
		this.targetMesh;
		this.target = new THREE.Vector3();
		this.target0 = this.target.clone();
		this.position0; //this.camera.position.clone();
		this.up0; //= this.camera.up.clone();
	
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
	
		// events
	
		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };
	
		// methods
	
		initEvent();
	
		this.init = function (camera, targetMesh) {
	
			this.camera = camera;
			this.cameraUp = camera.up.clone();
			this.targetMesh = targetMesh;
	
			_rotation = new THREE.Quaternion();
			_rotation.setFromEuler(targetMesh.rotation.clone());
			// for reset 
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
	
		this.rotateTarget = function () {
	
			//this.targetMesh.rotation.setFromQuaternion(_rotation, 'XYZ'); 
		};
	
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
	
				//_this.dispatchEvent( changeEvent );
	
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
	
		// event handle
	
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
	
			//_this.dispatchEvent( startEvent );
		}
	
		// event handle
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
			//_this.dispatchEvent( endEvent );
		}
	
		function mousewheel(event) {
	
			if (_this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;
	
			event.preventDefault();
			event.stopPropagation();
	
			var delta = 0;
	
			if (event.wheelDelta) {
				// WebKit / Opera / Explorer 9
	
				delta = event.wheelDelta / 40;
			} else if (event.detail) {
				// Firefox
	
				delta = -event.detail / 3;
			}
	
			_zoomStart.y += delta * 0.01;
			//_this.dispatchEvent( startEvent );
			//_this.dispatchEvent( endEvent );
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
			//_this.dispatchEvent( startEvent );
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
			//_this.dispatchEvent( endEvent );
		}
	
		function initEvent() {
			_this.domElement.addEventListener('contextmenu', function (event) {
				event.preventDefault();
			}, false);
	
			_this.domElement.addEventListener('mousedown', mousedown, false);
	
			_this.domElement.addEventListener('mousewheel', mousewheel, false);
			_this.domElement.addEventListener('DOMMouseScroll', mousewheel, false); // firefox
	
			_this.domElement.addEventListener('touchstart', touchstart, false);
			_this.domElement.addEventListener('touchend', touchend, false);
			_this.domElement.addEventListener('touchmove', touchmove, false);
		}
	};
	
	module.exports = TrackballControls;

/***/ },
/* 22 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map