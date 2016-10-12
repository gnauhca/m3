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

	(function() { 
	__webpack_require__(1);//return;
	
	window.M3 = {};
	M3.viewManager = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./view/view-manager.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	// todo: webgl 检查
	//
	
	// 基本场景
	M3.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});
	
	M3.scene = new THREE.Scene();
	document.body.appendChild(M3.renderer.domElement);
	M3.renderer.setClearColor(0x2abced, 0);
	
	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;
	
	M3.renderer.setSize(winWidth, winHeight);
	
	
	M3.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	// main render tick
	var Time = __webpack_require__(7);
	var m3Time = new Time();
	
	M3.tick = m3Time.addTick(function() {
		M3.renderer.render(M3.scene, M3.camera);
	});
	
	
	window.addEventListener('resize', function() {
		winWidth = window.innerWidth;
		winHeight = window.innerHeight;
		M3.camera.aspect = winWidth / winHeight;
		M3.camera.updateProjectionMatrix();
		M3.renderer.setSize(winWidth, winHeight);
	});
	
	
	/* helper */
	var axisHelper = new THREE.AxisHelper( 100 );
	M3.scene.add( axisHelper );
	
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
	
	})();
	
	
	
	
	
	
	
	
	
	
	
	
	


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	/* 时间 */
	var TIME = {
	
		// 所有时间body对象
		bodys : []
	}
	
	stop = false;
	TIME.addBody = function(timeBody) {
		this.bodys.push(timeBody);
	}
	
	TIME.removeBody = function(timeBody) {
		var index = this.bodys.indexOf(timeBody);
	
		if (index !== -1) {
			this.bodys.splice(index, 1);
		}
	}
	
	TIME.tick = function() {
		TIME.handleFrame();
	
		if (!stop) {
			requestAnimationFrame(TIME.tick);
			//setTimeout(TIME.tick, 20);
		}
	}
	
	TIME.start = function() {
		stop = false;
		this.tick();
	}
	
	TIME.stop = function() {
		stop = true;
	}
	
	TIME.handleFrame = (function() { 
		var now = (new Date()).getTime();
		var last = now;
		var delta;
		return (function() { 
	
			delta = now - last;
			delta = delta > 500 ? 30 : (delta < 16? 16 : delta);
	
			//console.log(TIME.bodys);
			TIME.bodys.forEach(function(body) {
				if (!body.isStop) {
					body.ticks.forEach(function(tick) {
						tick.fn && tick.fn(delta); 
					});
				}
			});
	
			TWEEN.update();
		});	
	})();
	
	TIME.tick();
	
	
	/* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
	class Time {
	
		constructor() {
			TIME.addBody(this);
			this.ticks = [];
			this.tweens = [];
			this.isStop = false;
		}
	
	
		/**
		 * 该物体灭亡
		 */
		destory() {
			TIME.removeBody(this);
		}
	
		/** 
		 * 帧更新
		 * @param timegap 与上一帧的时间间隔
		 */
		addTick(fn) {
			var tick = {'fn': fn.bind(this)};
	
			tick.isStop = false;
			this.ticks.push(tick);
			return tick;
		}
	
		removeTick(tick) {
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
		addTween(tween) {
			this.tweens.push(tween);
		}
	
		/*
		 * tweenObj
		 */
		addTHREEObjTween(threeObj, target, dur, tweenObj) {		
			var that = this;
			var init = {};
			var dest = {};
		    
		    var attrs = ['x', 'y', 'z', 'r', 'g', 'b', 'opacity'];
			var separater = '_';
	
			for (let key in target) {
				let destKey = key;
				if (typeof target[key] === 'object') {
					for (let cKey in target[key]) {
						if (attrs.indexOf(cKey) !== -1) {
							destKey += cKey;
							dest[destKey] = target[key][cKey];
						}
					}
				} else {
					dest[destKey] = target[key];
				}
	
				if (destKey.indexOf('lookAt') === -1) {
					let keyArr = destKey.split('_');
					let subObj = threeObj;
	
					keyArr.forEach(function(subKey) { subObj = subObj[key]; });
					init[destKey] = subObj;
				} else {
					init[destKey] = dest[destKey]; // lookAt
				}
			}
	
			var tween;
			tweenObj = tweenObj || {};
			tween = new TWEEN.Tween(init)
			tween.to(dest, dur)
				.easing(tweenObj.easing || TWEEN.Easing.Cubic.InOut)
				.onUpdate(function() {
					let current = this;
					for (let currentKey in current) {
						if (currentKey.indexOf['lookAt'] !== -1) {
							let lookAt = current[currentKey];
							threeObj.lookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z));
						}
						let keyArr = currentKey.split('_');
						let last = keyArr.pop();
						let subObj = threeObj;
						keyArr.forEach(function(key) { subObj = subObj[key]; });
						subObj[last] = current[currentKey];
					}
					tweenObj.onUpdate && tweenObj.onUpdate();
				})
				.onComplete(function() {
					that.removeTween(tween);
					tweenObj.onComplete && tweenObj.onComplete();
				});
	
			this.tweens.push(tween);
			return tween;
		}
	
		removeTween(tween) {
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
		stop() {
			this.isStop = true;
			this.tweens.forEach(function(tween) {
				tween.stop();
			});
		}
	
		start() {
			this.isStop = false;
			this.tweens.forEach(function(tween) {
				tween.start();
			});
		}
	}
	
	export default Time;
	
	
	
	
	
	
	
	


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map