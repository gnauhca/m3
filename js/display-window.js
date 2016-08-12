var View = require('./view.js');
var Loader = require('./loader.js');
var TrackballControls = require('./m3-trackballcontrol');

var loader = new Loader();

var DisplayWindow = View.extend(function() {
	var that = this;
	var initialized = false;

	var windowSizePX;

	// config (from other manager view)
	var config;

	// assets from loader
	var assets;

	// 3D 资源
	this.trackball;
	this.scene = {};
	this.sceneOffline = {};
	this.target;

	// 模型位置，旋转等信息
	this.sceneObjSizes = {
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

	this.constructor = function() {
		this.super();
	}

	this.activate = function(data) {
		if (data)
		config = $.extend(true, {}, data);

		if (!initialized) {
			init(); return;
		}

		// 3d
		this.target = new THREE.Vector3(config.productData.modelPos.x, config.productData.modelPos.y, config.productData.modelPos.z);

		// this.scene.camera.position.copy(config.cameraPos);

        this.scene.model.position.copy(this.target);
        this.scene.model.rotation.copy(new THREE.Euler(Math.PI/3, -0.2, .8, 'XYZ' ));
        this.scene.camera.position.copy(this.scene.model.position);
		this.scene.camera.position.z += 40;
		this.scene.camera.lookAt(this.target);

		// initial size info
		this.sceneObjSizes.model.position = this.scene.model.position.clone();
		this.sceneObjSizes.model.rotation = this.scene.model.rotation.clone();

		this.sceneObjSizes.camera.position = this.scene.camera.position.clone();
		this.sceneObjSizes.camera.lookAt = this.scene.model.position.clone();

		// 添加到场景
		Object.keys(this.scene).forEach(function(o) { M3.scene.add(this.scene[o]);}.bind(this));
		
		// dom
		this.$domElem.appendTo(this.$domWrap);

		this.resize();

		changeColor(Object.keys(config.productData.model.textures)[0]);
		playEntryAnimation();

		that.addTick(render)
		this.active = true;
	}

	// 窗口关闭
	this.inActivate = function() {

		// 移除模型
		console.log(Object.keys(this.scene));
		Object.keys(this.scene).forEach(function(o) { M3.scene.remove(that.scene[o]);});
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

		windowSizePX = {};
		windowSizePX['left'] = parseInt(winWidth * config.windowSize['left']);
		windowSizePX['width'] = parseInt(winWidth * config.windowSize['width']);
		windowSizePX['top'] = parseInt(winHeight * config.windowSize['top']);
		windowSizePX['height'] = parseInt(winHeight * config.windowSize['height']);

		windowSizePX['bottom'] = winHeight - windowSizePX['height'] - windowSizePX['top'];

        this.scene.spotLight.position.copy(this.target);
        this.scene.spotLight.position.y += 200;
        this.scene.spotLight.position.x += 300;
        this.scene.spotLight.position.z += 100;
        this.scene.spotLight.lookAt(this.target); 

        // dom size & position
        for (var key in config.windowSize) {
        	this.$domElem.css(key, config.windowSize[key] * 100 + '%');
        }

		this.scene.camera.aspect = windowSizePX['width'] / windowSizePX['height'];
		this.scene.camera.updateProjectionMatrix();

		this.trackball.handleResize(windowSizePX);
	}

	this.resizeWindow = function(windowSize) {
		var initSize = config.windowSize;
		var finalSize = windowSize;

		that.setState('animate');
		var resizeTween = new TWEEN.Tween(initSize).easing(TWEEN.Easing.Cubic.InOut).to(finalSize, 1500).onUpdate(function() {
			config.windowSize = this;
			that.resize();
		}).onComplete(function() {
			that.removeTween(resizeTween);
			that.setState('handle');
		}).start();
	}

	this.setState = function(state) { 
		this.state = state;
		if (state === 'handle') { 
			this.trackball.init(this.scene.camera, this.scene.model);
			this.resize(); 
			!this.locked && this.trackball && (this.trackball.enabled = true);
		} else {
			!this.locked && this.trackball && (this.trackball.enabled = false);
		}
	}

	// 获取模型旋转信息，相机相对信息，用于设置其他 displayWindow 使表现一致；
	this.getSize = function() {
		var size = {};

		size.modelRotation = this.scene.model.rotation.clone();
		size.cameraRotation = this.scene.camera.rotation.clone();
		size.cameraUp = this.scene.camera.up.clone();
		size.eye = (new THREE.Vector3).subVectors(this.scene.camera.position, this.scene.model.position);

		return size;
	}

	this.setSize = function(size) {
		this.scene.model.rotation.copy(size.modelRotation);
		// this.scene.camera.rotation.copy(size.cameraRotation);
		// this.scene.camera.up = size.cameraUp;
		this.scene.camera.position.addVectors(this.scene.model.position, size.eye);
		this.scene.camera.lookAt(this.scene.model);
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

	/* private method */
	// 场景搭建，ui创建
	function init() {
		if (!assets) {
			loadAsset(); return;
		}
		initialized = true;

		// scene
		setupScene();

		// ui
		setupUI();

		that.activate();
	}

	// 加载模型资源
	function loadAsset() {
		that.setState('loading');
		var assetConifg = $.extend(true, {}, config.productData.model);

		// 加载模型资源
		loader.load(
			assetConifg, 
			function(p) { showProgress(p); }, 
			function(res) {	assets = res; init(); }
		);
	}

	// 下载进度
	function showProgress(progress) {
		console.log('displayWindow progress', progress);
	}

	function setupScene() {

		// 3D 相关资源创建
 		that.scene.spotLight = new THREE.SpotLight(0xeeeeee);
 		that.scene.spotLight.intensity = 0;
		that.scene.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);


		var color = Object.keys(assets.textures)[0];
    	var texture = THREE.ImageUtils.loadTexture(assets.textures['black']);
		var material = new THREE.MeshLambertMaterial({transparent: true, opacity: 1});

		var model = new THREE.Mesh(assets.geometry, material);
		model.scale.set(0.1, 0.1, 0.1);
		model.rotation.x = Math.PI/2;

		that.scene.model = model;

        //test
        // var geometry = new THREE.CylinderGeometry( 5, 6, 1, 6);
        // var material = new THREE.MeshLambertMaterial({color: 0x333333});
        // var platform = new THREE.Mesh(geometry, material);
        // that.scene.platform = platform;

		// trackball
        that.trackball = new TrackballControls(that.scene.camera);
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
		Object.keys(config.productData.model.textures).forEach(function(color) {
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
		if (color === that.color) return;
		that.$domElem.find('.color').removeClass('selected');
		that.$domElem.find('.color.' + color).addClass('selected');
		that.color = color;

		var loader = new THREE.TextureLoader(); 

		that.scene.model.material.map = THREE.ImageUtils.loadTexture(assets.textures[color]);
		that.scene.model.material.needsUpdate = true;
	}

	// 模型切换
	function changeProduct(productData) {
		that.productData = productData;
		loadAsset();
	}


	/* 动画 */
	function playEntryAnimation() {
		that.setState('animate');

		var initModelRotation = that.sceneObjSizes.model.rotation;
		var initCameraPosition = that.sceneObjSizes.camera.position;

		that.scene.model.rotation.copy(initModelRotation);
		that.scene.model.rotation.x -= Math.PI * 0.5;
		that.scene.model.rotation.z += Math.PI * 1.2;
		that.addTHREEObjTween(that.scene.model, {
			rotation: initModelRotation
		}, 2000).start();

		that.scene.camera.position.copy(initCameraPosition);
		that.scene.camera.position.z += 300,
		that.addTHREEObjTween(that.scene.camera, {
			position: initCameraPosition
		}, 2000, {
			onComplete: function() {
				that.setState('handle');
			}
		}).start();
	}

	// model，trackball 重置
	function refresh() { //console.log(that.sceneObjSizes.model.position);
		that.setState('animate');
		var initModelRotation = that.sceneObjSizes.model.rotation;

		var initCameraPosition = that.sceneObjSizes.camera.position;
		var initCameraLookAtPosition = that.sceneObjSizes.camera.position;

		var cameraLookAt = new THREE.Vector3(0, 0, -1);
        cameraLookAt.applyEuler(that.scene.camera.rotation, that.scene.camera.eulerOrder);
        cameraLookAt.add(that.scene.camera.position);

		that.addTHREEObjTween(that.scene.model, {
        	rotation: initModelRotation
        }, 1000).start();

		that.addTHREEObjTween(that.scene.camera, {
        	position: initCameraPosition,
        	lookAt: initCameraLookAtPosition
        }, 1000, {
        	onComplete: function() {
        		that.setState('handle');
        	}
        }).start();   
	}

	function render() {
		//console.log(windowSizePX);
		M3.renderer.setViewport(windowSizePX['left'], windowSizePX['bottom'], windowSizePX['width'], windowSizePX['height']);
		M3.renderer.setScissor(windowSizePX['left'], windowSizePX['bottom'], windowSizePX['width'], windowSizePX['height']);
		M3.renderer.setScissorTest(true);
		that.scene.camera.aspect = windowSizePX['width'] / windowSizePX['height'];
		that.scene.camera.updateProjectionMatrix();
		M3.renderer.render( M3.scene, that.scene.camera );	
		that.trackball.update();		
	}
});

module.exports = DisplayWindow;
