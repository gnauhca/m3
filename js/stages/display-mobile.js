var View = require('./view.js');
var Mobile = require('./mobile.js');
var TrackballControls = require('./m3-trackballcontrol');

var loader = new Loader();

var DisplayWindow = View.extend(function() {
	var that = this;

	var windowSize; // for px calculate
	var _winSizePX; // for render 

	// 3D 资源
	var _camera;
	var _mobile;

	this.name; // pro5?
	this.size;
	this.isInit = false;

	this.trackball;
	this.objects = {};
	this.target;

	// 模型位置，旋转等信息
	this.objectSizes = {
		model : {position: null, rotation: null},
		camera : {position: null, lookAt: null}
	}; 

	// 状态
	this.state;
	this.color;

	this.locked = false;
	this.active = false;


	// dom
	this.$domWrap = $('#displayView');
	this.$domElem;

	this.constructor = function(mobileName) {
		this.name = mobileName;
		this.super();
		_mobile = new Mobile(this.name);
		this.size = _mobile.size;
	}

	this.load = function(onProgress) {
		return _mobile.load(onProgress);
	}

	this.init = function(onProgress) {
		return this.load(onProgress).then(function() {
			return new Promise(function(resolve, reject) {
				// init
				this.objects.mesh = _mobile.mesh;
				setupScene();
				this.isInit = true;
				resolve();
			});
		}).catch(function(e) { console.log(e.stack); });;
	}

	this.entry = function(meshPos, windowSize) {
		windowSize = windowSize;
		// 3d
		this.target = new THREE.Vector3(meshPos.x, meshPos.y, meshPos.z);

        this.objects.mesh.position.copy(this.target);
        this.objects.mesh.rotation.copy(new THREE.Euler(Math.PI/3, -0.2, .8, 'XYZ' ));
        _camera.position.copy(M3.camera.position);
		_camera.position.z += 40;
		_camera.lookAt(THREEUtil.getLookAt(M3.camera));

		// light
        this.objects.spotLight.position.copy(this.target);
        this.objects.spotLight.position.y += 200;
        this.objects.spotLight.position.x += 300;
        this.objects.spotLight.position.z += 100;
        this.objects.spotLight.lookAt(this.target); 

		// initial size info
		this.objectSizes.mesh.position = this.objects.mesh.position.clone();
		this.objectSizes.mesh.rotation = this.objects.mesh.rotation.clone();

		this.objectSizes.camera.position = this.objects.mesh.position.clone();
		this.objectSizes.camera.position.z += 50;
		this.objectSizes.camera.lookAt = this.objects.mesh.position.clone();

		// 添加到场景
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));
		
		// dom
		this.$domElem.appendTo(this.$domWrap);

		this.resize();

		changeColor(Object.keys(_config.productData.model.textures)[0]);
		that.addTick(render);

		return playEntryAnimation();
	}

	// 窗口关闭
	this.leave = function() {

		// 移除模型
		console.log(Object.keys(this.objects));
		Object.keys(this.objects).forEach(function(o) { M3.scene.remove(that.objects[o]);});
		render();
		this.$domElem.remove();
		this.getView('display-manager').removeWindow(this);
		this.removeTween();
		this.removeTick();
		this.active = false;
	}

	// 窗口重置
	this.resize = function() {  
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		_winSizePX = {};
		_winSizePX['left'] = parseInt(winWidth * _windowSize['left']);
		_winSizePX['width'] = parseInt(winWidth * _windowSize['width']);
		_winSizePX['top'] = parseInt(winHeight * _windowSize['top']);
		_winSizePX['height'] = parseInt(winHeight * _windowSize['height']);

		_winSizePX['bottom'] = winHeight - _winSizePX['height'] - _winSizePX['top'];

        // dom size & position
        for (var key in _windowSize) {
        	this.$domElem.css(key, _windowSize[key] * 100 + '%');
        }

		_camera.aspect = _winSizePX['width'] / _winSizePX['height'];
		_camera.updateProjectionMatrix();

		this.trackball.handleResize(_winSizePX);
	}

	this.resizeWindow = function(windowSize) {
		var initSize = _windowSize;
		var finalSize = windowSize;

		that.setState('animate');
		var resizeTween = new TWEEN.Tween(initSize).easing(TWEEN.Easing.Cubic.InOut).to(finalSize, 1500).onUpdate(function() {
			_windowSize = this;
			that.resize();
		}).onComplete(function() {
			that.removeTween(resizeTween);
			that.setState('handle');
		}).start();
	}

	this.setState = function(state) { 
		this.state = state;
		if (state === 'handle') { 
			this.trackball.init(_camera, this.objects.mesh);
			this.resize(); 
			!this.locked && this.trackball && (this.trackball.enabled = true);
		} else {
			!this.locked && this.trackball && (this.trackball.enabled = false);
		}
	}

	// 获取模型旋转信息，相机相对信息，用于设置其他 displayWindow 使表现一致；
	this.getSize = function() {
		var size = {};

		size.modelRotation = this.objects.mesh.rotation.clone();
		size.cameraRotation = _camera.rotation.clone();
		size.cameraUp = _camera.up.clone();
		size.eye = (new THREE.Vector3).subVectors(_camera.position, this.objects.mesh.position);

		return size;
	}

	this.setSize = function(size) {
		this.objects.mesh.rotation.copy(size.modelRotation);
		// _camera.rotation.copy(size.cameraRotation);
		// _camera.up = size.cameraUp;
		_camera.position.addVectors(this.objects.mesh.position, size.eye);
		_camera.lookAt(this.objects.mesh);
	}

	this.lock = function(isMain) {
		this.locked = true;
		if (isMain) {
			this.trackball.enabled = true;
			this.trackball.fullScreen = true;
		} else {
			this.trackball.enabled = false;
		}
		refresh();
	}

	this.unlock = function() {
		this.locked = false;

		this.trackball.enabled = true;
		this.trackball.fullScreen = false;
		refresh();
	}

	// model，trackball 重置
	function reset() { //console.log(that.objectSizes.mesh.position);
		that.setState('animate');
		var initModelRotation = that.objectSizes.mesh.rotation;

		var initCameraPosition = that.objectSizes.camera.position;
		var initCameraLookAtPosition = that.objectSizes.camera.position;

		var cameraLookAt = new THREE.Vector3(0, 0, -1);
        cameraLookAt.applyEuler(_camera.rotation, _camera.eulerOrder);
        cameraLookAt.add(_camera.position);

		that.addTHREEObjTween(that.objects.mesh, {
        	rotation: initModelRotation
        }, 1000).start();

		that.addTHREEObjTween(_camera, {
        	position: initCameraPosition,
        	lookAt: initCameraLookAtPosition
        }, 1000, {
        	onComplete: function() {
        		that.setState('handle');
        	}
        }).start();   
	}

	function setupScene() {

		// 3D 相关资源创建
 		that.objects.spotLight = new THREE.SpotLight(0xeeeeee);
 		that.objects.spotLight.intensity = 0;
		_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


        that.trackball = new TrackballControls(_camera);
        that.trackball.enabled = false;
	}

	// UI 初始化
	function setupUI() {
		// UI (DOM)
		var domTemplate = 
		'<div class="display-window">' + 
			'<div class="window-control">' + 
				'<i class="btn reset-btn icon ion-ios-reload"></i>' + 
				'<i class="btn close-btn icon ion-ios-close-empty"></i>' + 			
			'</div>' + 
			'<div class="colors-control"></div>' + 
		'</div>';

		var colorTemplate = '<i class="color @color" data-color="@color"></i>';

		var colorHTML = '';
		Object.keys(_config.productData.model.textures).forEach(function(color) {
			colorHTML += colorTemplate.replace(/\@color/g, color);
		});
		that.$domElem = $(domTemplate);
		that.$domElem.find('.colors-control').empty().html(colorHTML);

		// 事件
		that.$domElem.on('click', '.reset-btn', function() { refresh() });
		that.$domElem.on('click', '.close-btn', function() { that.inActivate() });
		that.$domElem.on('click', '.color', function() { changeColor($(this).data('color')) });	
	}

	function changeColor(color) {
		_mobile.changeColor(color);
	}

	/* 动画 */
	function playEntryAnimation() {
		return new Promise(function(resolve, reject) {
			that.setState('animate');

			var initModelRotation = that.objectSizes.mesh.rotation;
			var initCameraPosition = that.objectSizes.camera.position;

			that.objects.mesh.rotation.copy(initModelRotation);
			that.objects.mesh.rotation.x -= Math.PI * 0.5;
			that.objects.mesh.rotation.z += Math.PI * 1.2;
			that.addTHREEObjTween(that.objects.mesh, {
				rotation: initModelRotation
			}, 2000).start();

			that.addTHREEObjTween(_camera, {
				position: initCameraPosition
			}, 2000, {
				onComplete: function() {
					that.setState('handle');
					resolve();
				}
			}).start();
		});

	}

	function render() {

		M3.renderer.setViewport(_winSizePX['left'], _winSizePX['bottom'], _winSizePX['width'], _winSizePX['height']);
		M3.renderer.setScissor(_winSizePX['left'], _winSizePX['bottom'], _winSizePX['width'], _winSizePX['height']);
		M3.renderer.setScissorTest(true);
		_camera.aspect = _winSizePX['width'] / _winSizePX['height'];
		_camera.updateProjectionMatrix();
		M3.renderer.render( M3.scene, _camera );	
		that.trackball.update();		
	}
});

module.exports = DisplayWindow;
