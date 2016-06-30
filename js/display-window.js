var View = require('./view.js');
var Loader = require('./loader.js');
var TrackballControls = require('./m3-trackballcontrol');

var loader = new Loader();

var DisplayWindow = View.extend(function() {
	var that = this;
	var windowSize;
	var windowSizePX;


	// 3D 资源
	this.spotLight;
	this.model;
	this.camera;
	this.target;
	this.productData;
	this.trackball;

	// 状态
	this.state;
	this.color;

	// UI (DOM)
	var domTemplate = 
	'<div class="display-window">' + 
		'<div class="window-control">' + 
			'<i class="btn reset-btn fa fa-refresh fa-2x"></i>' + 
			'<i class="btn close-btn fa fa-close fa-2x"></i>' + 			
		'</div>' + 
		'<div class="colors-control"></div>' + 
	'</div>';

	var colorTemplate = '<i class="color @color fa fa-square" data-color="@color"></i>'

	this.$domWrap = $('#displayView');
	this.$domElem;

	this.constructor = function() {
		this.super();

		// 3D 相关资源创建
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
        this.trackball = new TrackballControls(this.camera);
        this.trackball.enabled = false;
 		this.spotLight = new THREE.SpotLight(0xffffff);

        M3.scene.add(this.spotLight);
		M3.scene.add(this.camera);

		// UI相关
		this.$domElem = $(domTemplate); 
		initEvent();
	}

	this.activate = function(data) {

		windowSize = data.windowSize;

		this.productData = data.productData;
		this.camera.position.copy(data.cameraPos);

		this.target = new THREE.Vector3(this.productData.modelPos.x, this.productData.modelPos.y, this.productData.modelPos.z);

		changeProduct(this.productData, Object.keys(this.productData.model.textures)[0]);

		// UI 初始化
		this.$domElem.appendTo(this.$domWrap);
		var colorHTML = '';
		Object.keys(this.productData.model.textures).forEach(function(color) {
			colorHTML += colorTemplate.replace(/\@color/g, color);
		});
		this.$domElem.find('.colors-control').empty().html(colorHTML);

		this.reset();
		render();
	}

	// 窗口关闭
	this.inActivate = function() {

		// 移除模型
		M3.scene.remove(this.camera);
		M3.scene.remove(this.model);
		M3.scene.remove(this.spotLight);
		this.$domElem.remove();
	}

	// 窗口重置
	this.reset = function() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		windowSizePX = {};
		windowSizePX['left'] = parseInt(winWidth * parseInt(windowSize['left'])/100);
		windowSizePX['width'] = parseInt(winWidth * parseInt(windowSize['width'])/100);
		windowSizePX['top'] = parseInt(winHeight * parseInt(windowSize['top'])/100);
		windowSizePX['height'] = parseInt(winHeight * parseInt(windowSize['height'])/100);

		windowSizePX['bottom'] = winHeight - windowSizePX['height'] - windowSizePX['top'];

        this.spotLight.position.copy(this.target);
        this.spotLight.position.y += 200;
        this.spotLight.position.x += 300;
        this.spotLight.position.z += 100;
        this.spotLight.lookAt(this.target);

        // dom size & position
        this.$domElem.css(windowSize);

        // test
        var geometry = new THREE.CylinderGeometry( 6, 6, 0.5, 6);
        var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.target);
        mesh.position.y -= 10;
        M3.scene.add(mesh);




		this.camera.aspect = windowSizePX['width'] / windowSizePX['height'];
		this.camera.updateProjectionMatrix();

		this.trackball.handleResize(windowSizePX);
	}

	// model，trackball 重置
	this.refresh = function() {

	}

	this.setState = function(state) {
		this.state = state;
		displayWindowState[state](this);
		if (state === 'handle') {
			this.trackball.init(this.camera, this.model);
			this.reset();
			this.trackball.enabled = true;
		} else {
			this.trackball.enabled = false;
		}
	}

	// 下载进度
	this.showProgress = function(progress) {
		console.log('displayWindow progress', progress);
	}

	this.loaded = function() {

	}

	/* private method */

	// DOM 事件
	function initEvent() {
		that.$domElem.on('click', '.reset-btn', function() {that.refresh()});
		that.$domElem.on('click', '.close-btn', function() {that.inActivate()});
		that.$domElem.on('click', '.color', function() {changeColor($(this).data('color'))});
	}

	function changeColor(color) {
		if (color = that.color) return;
		that.$domElem.find('.color').removeClass('selected');
		that.$domElem.find('.color.' + color).addClass('selected');
	}

	// 模型切换
	function changeProduct(productData, color) {
		that.productData = productData;
		that.color = color;
		that.setState('loading');
	}

	function render() {
		that.addTick(function() {
			M3.renderer.setViewport(windowSizePX['left'], windowSizePX['bottom'], windowSizePX['width'], windowSizePX['height']);
			M3.renderer.setScissor(windowSizePX['left'], windowSizePX['bottom'], windowSizePX['width'], windowSizePX['height']);
			M3.renderer.setScissorTest(true);
			M3.renderer.setClearColor(0x000000);
			that.camera.updateProjectionMatrix();
			M3.renderer.render( M3.scene, that.camera );	
			that.trackball.update();		
		});
	}
});

// 窗口状态管理
var displayWindowState = {

	// 下载状态
	loading: function(displayWindow) {
		function setModel() {
			var color = Object.keys(displayWindow.productData.model.textures)[0];
        	var texture = THREE.ImageUtils.loadTexture(displayWindow.productData.model.textures[color]);
			var material = new THREE.MeshBasicMaterial({map: texture});
			var _model;

			_model = new THREE.Mesh(displayWindow.productData.model.geometry, material);
			_model.scale.set(0.1, 0.1, 0.1);
			_model.position.copy(displayWindow.target);
			_model.rotation.x = Math.PI/2;
			M3.scene.remove(displayWindow.model);
			M3.scene.add(_model);
			displayWindow.model = _model;
			displayWindow.camera.lookAt(_model);
		}

		// 加载模型资源
		loader.load(displayWindow.productData.model, function(p) {displayWindow.showProgress(p)}, function(res) {	
			displayWindow.productData.model = res;
			setModel();
			displayWindow.setState('animate');
		});
	},

	// 动画播放
	animate: function(displayWindow, first) {

		var aniInit = {
				modelRx: Math.PI / 2, 
				modelRy: 0, 
				modelRz: Math.PI * 2, 
				cameraPx: displayWindow.target.x,
				cameraPy: displayWindow.target.y,
				cameraPz: displayWindow.target.z + 300,
				cameraOffset: 10
			};
		var aniFinal = {
				modelRx: Math.PI / 2, 
				modelRy: 0, 
				modelRz: 0, 
				cameraPx: displayWindow.target.x,
				cameraPy: displayWindow.target.y,
				cameraPz: displayWindow.target.z + 40,
				cameraOffset: 10000
			};


		var tween = new TWEEN.Tween(aniInit).easing(TWEEN.Easing.Cubic.InOut).to(aniFinal, 1000).onUpdate(function() {
			displayWindow.model.rotation.x = this.modelRx;
			displayWindow.model.rotation.y = this.modelRy;
			displayWindow.model.rotation.z = this.modelRz;

			var offset = 0//(parseInt(this.cameraOffset) % 20 - 10) / 20;

			displayWindow.camera.position.x = this.cameraPx + offset;
			displayWindow.camera.position.y = this.cameraPy;
			displayWindow.camera.position.z = this.cameraPz;

		}).onComplete(function() { 
			displayWindow.removeTween(tween);
			displayWindow.setState('handle');
		}).start();

		displayWindow.addTween(tween);
	},

	// 可操作状态
	handle: function(displayWindow) {

	}
}

module.exports = DisplayWindow;
