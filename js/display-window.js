var View = require('./view.js');
var Loader = require('./loader.js');
var loader = new Loader();

var DisplayWindow = View.extend(function() {
	var that = this;
	var windowSize;
	var windowSizePX;
	var spotLight;


	this.model;
	this.camera;
	this.target;
	this.productData;


	this.state;

	this.constructor = function() {
		this.super();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

 		spotLight = new THREE.SpotLight(0xffffff);
        // spotLight.shadowCameraNear = 2;
        // spotLight.shadowCameraFar = 200;
        // spotLight.shadowCameraFov = 30;
        // spotLight.distance = 0;
        // spotLight.angle = 0.4;


        M3.scene.add(spotLight);
		M3.scene.add(this.camera);
	}

	this.activate = function(data) {

		windowSize = data.windowSize;

		this.productData = data.productData;
		this.camera.position.copy(data.cameraPos);

		this.target = new THREE.Vector3(this.productData.modelPos.x, this.productData.modelPos.y, this.productData.modelPos.z);
		changeProduct(this.productData, Object.keys(this.productData.model.textures)[0]);
		this.reset();
		render();
	}

	this.reset = function() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		windowSizePX = {};
		windowSizePX['left'] = parseInt(winWidth * parseInt(windowSize['left'])/100);
		windowSizePX['width'] = parseInt(winWidth * parseInt(windowSize['width'])/100);
		windowSizePX['top'] = parseInt(winHeight * parseInt(windowSize['top'])/100);
		windowSizePX['height'] = parseInt(winHeight * parseInt(windowSize['height'])/100);

		windowSizePX['bottom'] = winHeight - windowSizePX['height'] - windowSizePX['top'];

        spotLight.position.copy(this.target);
        spotLight.position.y += 100;
        spotLight.position.x += 100;
        spotLight.lookAt(this.target);


        // create a cube
        /*var sphereGeometry = new THREE.SphereGeometry(3, 30,30);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(target);
        M3.scene.add(sphere);*/

		this.camera.aspect = windowSizePX['width'] / windowSizePX['height'];
		this.camera.updateProjectionMatrix();
		this.camera.position.z += 50;
	}

	this.setState = function(state) {
		this.state = state;
		displayWindowState[state](this);
	}

	// 下载进度
	this.showProgress = function (progress) {
		console.log('displayWindow progress', progress);
	}

	// 模型切换
	function changeProduct(productData) {
		that.productData = productData;
		that.setState('loading');
	}

	function render() {
		that.addTick(function() {
			M3.renderer.setViewport(windowSizePX['left'], windowSizePX['bottom'], windowSizePX['width'], windowSizePX['height']);
			M3.renderer.setScissor(windowSizePX['left'], windowSizePX['bottom'], windowSizePX['width'], windowSizePX['height']);
			M3.renderer.setScissorTest(true);
			//M3.renderer.setClearColor(0xffffff);
			that.camera.updateProjectionMatrix();
			M3.renderer.render( M3.scene, that.camera );			
		});
	}
});

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
		displayWindow.model.rotation.x = Math.random();
		displayWindow.model.rotation.y = Math.random();
		displayWindow.model.rotation.z = Math.random();
		displayWindow.addTick(function() {
			var speed =  0.003;
			displayWindow.model.rotation.x += speed;
			displayWindow.model.rotation.y += speed;
			displayWindow.model.rotation.z += speed;
		});

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
				cameraPz: displayWindow.target.z + 25,
				cameraOffset: 10000
			};


		var tween = new TWEEN.Tween(aniInit).to(aniFinal, 3000).onUpdate(function() {
			// displayWindow.model.rotation.x = this.modelRx;
			// displayWindow.model.rotation.y = this.modelRy;
			// displayWindow.model.rotation.z = this.modelRz;

			var offset = 0//(parseInt(this.cameraOffset) % 20 - 10) / 20;

			displayWindow.camera.position.x = this.cameraPx + offset;
			displayWindow.camera.position.y = this.cameraPy;
			displayWindow.camera.position.z = this.cameraPz;

		}).onComplete(function() { 
			displayWindow.removeTween(tween);
			displayWindow.setState('handle');


		}).easing(TWEEN.Easing.Cubic.InOut).start();

		displayWindow.addTween(tween);
	},

	// 可操作状态
	handle: function(displayWindow) {

	}
}


module.exports = DisplayWindow;
