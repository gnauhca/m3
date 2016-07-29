var View = require('./view.js');
var DisplayWindow = require('./display-window.js');
//var DisplayManagerUi = require('../display-manager-ui.js');

var DisplayManager = View.extend(function() {
	var that = this;
	var initialized = false;
	var lockTick;
	var sphereTick;

	this.name = 'display-manager';
	this.displayWindows = [];
	this.activeWindows = [];
	this.active = false;

	// 3d
	this.scene = {};

	var $domWrap = $('#displayView');
	var $domManager = $('.display-manager');

	this.constructor = function() {
		this.super();
	}

	this.activate = function(data) { 

		if (!initialized) {
			init();
		}

		var productDatas = $.extend(true, [], data.productDatas);
		var sizePos = calculateSubWindowSize(productDatas.length);

		productDatas.forEach(function(productData, i) {

			var displayWindowData = {
				'productData': productData,
				'cameraPos': data.cameraPos,
				'windowSize': sizePos[i],
			};
			var displayWindow;

			if (that.displayWindows.length) {
				displayWindow = that.displayWindows.pop();
			} else {
				displayWindow = new DisplayWindow();
			}

			displayWindow.activate(displayWindowData);
			that.activeWindows.push(displayWindow); 
		});

		// 3d
		// 添加到场景
		// M3.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
		Object.keys(this.scene).forEach(function(o) { M3.scene.add(this.scene[o]);}.bind(this));

		// 圆旋转动画
		sphereTick = this.addTick(function() {
			this.scene.tetrahedronGroup.rotation.x += 0.0005;
			this.scene.tetrahedronGroup.rotation.y += 0.0005;
			this.scene.tetrahedronGroup.rotation.z += 0.0005;
			this.scene.tetrahedronGroup.children.forEach(function(mesh) {
				mesh.rotation.x += mesh.rr;
				mesh.rotation.y += mesh.rr;
				mesh.rotation.z += mesh.rr;
			});
			//this.scene.sphere.rotation.x += 0.0005;
			//this.scene.sphere.rotation.y += 0.0005;
			//this.scene.sphere.rotation.z += 0.0005;
		}.bind(this));

		// UI
		$domWrap.removeClass('none');

		this.active = true;
	}

	this.inActivate = function() {
		Object.keys(this.scene).forEach(function(o) { M3.scene.remove(that.scene[o]);});
		this.removeTick(sphereTick);

		$domWrap.addClass('none');
		this.activeWindows.forEach(function(activeWindow) {
			setTimeout(function() {activeWindow.inActivate();}, 0);
		});
		this.activeWindows.length = 0;
		this.active = false;
	}

	this.removeWindow = function(displayWindow) {
		this.activeWindows.some(function(activeWindow, i) {
			if (activeWindow === displayWindow) {
				that.displayWindows.push(activeWindow);
				that.activeWindows.splice(i, 1);
				return true;
			} 
		});
		resetWindow();
	}

	this.resize = function() {
		resetWindow();
	}

	function init() {
		setupScene();
		setupUI();
	}

	function setupScene() {
		// 创建圆
		// var geometry = new THREE.SphereGeometry( 100, 10, 5 );
		var geometry = new THREE.BoxGeometry(200, 200, 200, 6, 6, 6)

		//console.log(geometry);
		var random;
		var tetrahedronGroup = new THREE.Group();;

		var createTetrahedron = (function() {

			var colors = [0x2dcaa6, 0x316182,0x79ccd2, 0x254658, 0x98bfc4];
			var color;
			var tetrahedron;
			var material;

			return function(radius, detail) {
				color = colors[~~(Math.random()*colors.length)];
				// color = 0x2abcde;
				material = new THREE.MeshLambertMaterial({
					'color': color,
					transparent: true,
					opacity: 0.8
				});
				tetrahedron = new THREE.Mesh(
					new THREE.TetrahedronGeometry(radius, detail),
					material
				);
				return tetrahedron;
			}		
		})();

		var tetrahedron;
		geometry.vertices.forEach(function(vertice) {
			tetrahedron = createTetrahedron(3 * Math.random()|0, 0);
			tetrahedron.position.copy(vertice);
			tetrahedron.position.x += Math.random() * 10;
			tetrahedron.position.y += Math.random() * 10;
			tetrahedron.position.z += Math.random() * 10;
			tetrahedron.rotation = new THREE.Euler(
                Math.PI * 2 * Math.random(),
                Math.PI * 2 * Math.random(),
                0,
                'XYZ'
            );
            tetrahedron.rr = 0.5 - Math.random();
            tetrahedron.rr *= 0.05;
			tetrahedronGroup.add(tetrahedron);

		});
		that.scene.tetrahedronGroup = tetrahedronGroup;
		//console.log(tetrahedronGroup);



		var material = new THREE.MeshPhongMaterial( {color: 0xeeeeee,side: THREE.BackSide, /*wireframe: true*/} );
		var basicMaterial = new THREE.MeshBasicMaterial({color: 0x333333, /*wireframe: true*/});
		var sphere = new THREE.SceneUtils.createMultiMaterialObject(geometry, [basicMaterial, material]);
		sphere.name = this.name + ' sphere';
		//that.scene.sphere = sphere;
		//console.log(sphere);

		// 光
		//that.scene.spotLight = new THREE.SpotLight(0xffffff);


		// point light
		var pointLight = new THREE.PointLight(0xffffff);
		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(0,0,0);
		pointLight.intensity = 0.6;
		that.scene.pointLight = pointLight;

        var ambiColor = "#111111";
        ambientLight = new THREE.AmbientLight(ambiColor);
        that.scene.ambientLight = ambientLight;

		// 
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
        //directionalLight.target = that.scene.sphere;


        that.scene.directionalLight = directionalLight;

        var directionalLight2 = new THREE.DirectionalLight(directionalLightColor);
        directionalLight2.position.set(30, 50, 50);
        that.scene.directionalLight2 = directionalLight2;

	}

	function setupUI() {
		var $lockBtn = $domManager.find('.lock-btn');
		var $unlockBtn = $domManager.find('.unlock-btn');
		var $backBtn = $domManager.find('.back-btn');

		$domManager.on('click', '.setting-btn', function() {
			$domManager.addClass('show');
		});

		$domManager.on('click', '.lock-btn', function() {
			$lockBtn.addClass('none')
			$unlockBtn.removeClass('none');
			$domManager.removeClass('show');
			lock();
		});

		$domManager.on('click', '.unlock-btn', function() {
			$unlockBtn.addClass('none')
			$lockBtn.removeClass('none');
			$domManager.removeClass('show');
			unlock();
		});

		$domManager.on('click', '.back-btn', function() {
			that.inActivate();
			that.activateView('product-preview');
			$domManager.removeClass('show');
		});
	}


	function lock() {
		that.activeWindows.forEach(function(activeWindow, i) {
			var isMain = (i === 0);
			activeWindow.lock(isMain);
		});

		lockTick = that.addTick(function() {
			var sizeInfo = that.activeWindows[0].getSize();
			//console.log(sizeInfo);
			that.activeWindows.forEach(function(activeWindow, i) {
				if (i > 0)
				activeWindow.setSize(sizeInfo);
			});
		});
	}

	function unlock() {
		that.activeWindows.forEach(function(activeWindow, i) {
			activeWindow.unlock();
		});

		that.removeTick(lockTick);
	}

	function resetWindow() {
		var sizePos = calculateSubWindowSize(that.activeWindows.length);
		that.activeWindows.forEach(function(activeWindow, i) {
			activeWindow.resizeWindow(sizePos[i]);
		});
	}

});

module.exports = DisplayManager;



