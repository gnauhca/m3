var View = require('./view.js');
var Loader = require('./loader');


var DisplayRoom = View.extend(function() {
	var that = this;
	var active = false;
	var initialized = false;
	var config; // 配置
	var assets;
	var loader = new Loader();
	var sizeInfo;

	// scene
	var scene = {};

	this.state; // 状态



	this.constructor = function() {
		this.super();
		config = $.extend(true, {}, CONFIG);
	}

	this.activate = function() {
		active = true;
		if (!initialized) {
			init(); return;
		}
		render();
	}

	this.inActivate = function() {
		M3.scene.remove(scene.camera);
	}

	this.resize = function() {
		if (!initialized && active) return;
		scene.camera.aspect = window.innerWidth / window.innerHeight;
        scene.camera.updateProjectionMatrix();

		scene.camera.position.set(0, 0, 250);
		scene.camera.lookAt(baseCrood);
	}

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

	// 加载资源
	function loadAsset() { 
		var assetsConfig = $.extend(true, {}, config);

		assetsConfig.scene = {
			room: [
				'./assets/room/wall.jpg',
				'./assets/room/wall.jpg',
				'./assets/room/wall.jpg',
				'./assets/room/floor-grid.jpg',
				'./assets/room/wall.jpg',
				'./assets/room/wall.jpg',
			],
			roomLogo: './assets/room/roomlogo.png'
		}

		loader.load(assetsConfig, null, function(res) {
			assets = res;
			init();
		});
	}

	function setupScene() {

		// room
		var wallMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

		var loader = new THREE.CubeTextureLoader();
		var textureCube = loader.load(assets.scene.room);

		var roomMaterials = [];
		var material;
		for (var i = 0; i < assets.scene.room.length; i++) {
			if (i == 3) {
				material = new THREE.MeshBasicMaterial({
					'map': THREE.ImageUtils.loadTexture(assets.scene.room[i]),
					'side': THREE.BackSide
				});	
				material.reflectivity = 1;
				material.map.repeat.set(2,2);
	            material.map.wrapS = THREE.RepeatWrapping;
	            material.map.wrapT = THREE.RepeatWrapping;
			} else {
				material = new THREE.MeshLambertMaterial({
					//'map': THREE.ImageUtils.loadTexture(assets.scene.room[i]),
					'side': THREE.BackSide
				});				
			}



			roomMaterials.push(material);
		}
		var roomMaterial = new THREE.MeshFaceMaterial( roomMaterials );

		var roomCube = new THREE.CubeGeometry(100, 80, 100);
		scene.room = new THREE.Mesh(roomCube, roomMaterial);

		M3.scene.add(scene.room);
 
		// logo cube
		var logoCube = new THREE.CubeGeometry(80, 32, 1);
		var logoCubeMaterial = wallMaterial;
		logoCubeMaterial.transparent = true;
		logoCubeMaterial.opacity = 0.6;
		scene.logoCube = new THREE.Mesh(logoCube, logoCubeMaterial);
		scene.logoCube.position.set(0, 0, -47);
		M3.scene.add(scene.logoCube);

		// logo
		var logoPicTexture = new THREE.ImageUtils.loadTexture(assets.scene.roomLogo);
		var logoGeometry = new THREE.PlaneGeometry(80, 32, 1, 1);
		var logoMaterial = new THREE.MeshLambertMaterial( { map: logoPicTexture, color: 0xffffff} );
		scene.logo = new THREE.Mesh(logoGeometry, logoMaterial);
		scene.logo.position.copy(scene.logoCube.position);
		scene.logo.position.z += 0.52;
		M3.scene.add(scene.logo);




		// table
		var tableTopCyliner = new THREE.CylinderGeometry(15, 15, 0.5, 60);
		var tableMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
		

		scene.tableTopCamera = new THREE.CubeCamera( 0.1, 1000, 500 );
		scene.tableTopCamera.renderTarget.mapping = THREE.CubeRefractionMapping;
		tableMaterial.envMap = scene.tableTopCamera.renderTarget;
		tableMaterial.refractionRatio = 1.1;
		tableMaterial.reflectivity = 0.3;

		scene.tableTop = new THREE.Mesh(tableTopCyliner, tableMaterial);
		scene.tableTop.position.set(0, -34, 0);
		scene.tableTopCamera.position = scene.tableTop.position;
		scene.tableTopCamera.position.y -= 20;
		M3.scene.add(scene.tableTop);
		M3.scene.add(scene.tableTopCamera);

		var tableBottomCyliner = new THREE.CylinderGeometry(15, 14.5, 5, 60, 10);
		var tableBottomMaterial = new THREE.MeshLambertMaterial({color: 0xffffff,'side': THREE.DoubleSide, 'emissive': 0x888888}); 
		scene.tableBottom = new THREE.Mesh(tableBottomCyliner, tableBottomMaterial);
		scene.tableBottom.position.set(0, -37.5, 0);
		M3.scene.add(scene.tableBottom);

		// light 
        var ambiColor = "#111111";
        scene.ambientLight = new THREE.AmbientLight(ambiColor);
        M3.scene.add(scene.ambientLight);

        scene.roomLight = {};
        scene.roomLight.lightCenter = new THREE.SpotLight(0xffffff);
		scene.roomLight.lightLeftTop = new THREE.SpotLight(0xffffff);
		scene.roomLight.lightRightTop = new THREE.SpotLight(0xffffff);
		scene.roomLight.lightLeftBottom = new THREE.SpotLight(0xffffff);
		scene.roomLight.lightRightBottom = new THREE.SpotLight(0xffffff);

        scene.roomLight.lightCenter = new THREE.SpotLight(0, 40, 0);
		// scene.roomLight.lightLeftTop.position.set(-40, 40, -40);
		// scene.roomLight.lightRightTop.position.set(40, 40, -40);
		//scene.roomLight.lightLeftBottom.position.set(-40, -20, 40);
		scene.roomLight.lightRightBottom.position.set(40, -20, 40);

		for (var light in scene.roomLight) {
	        scene.roomLight[light].castShadow = true;
	        scene.roomLight[light].shadowCameraNear = 2;
	        scene.roomLight[light].shadowCameraFar = 100;
	        scene.roomLight[light].shadowCameraFov = 40;
	        scene.roomLight[light].distance = 0;
	        scene.roomLight[light].angle = 1;
	        scene.roomLight[light].intensity = 0.3;
	        scene.roomLight[light].shadowCameraVisible = false;
			scene.roomLight[light].shadowDarkness = 0.5;
			M3.scene.add(scene.roomLight[light]);
		}

		// point light
		scene.pointLight = new THREE.PointLight(0xffffff);
		scene.pointLight.position.set(0,0,0);
		scene.pointLight.intensity = 0.6;
		M3.scene.add(scene.pointLight);


		// camera
        scene.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 500);
        scene.camera.position.set(-0, -20, 50);
        scene.camera.lookAt(new THREE.Vector3(0, -40, 0));
        M3.scene.add(scene.camera);

        scene.trackball = new THREE.TrackballControls(scene.camera);
	}

	function setupUI() {

	}



	function render() {
		that.addTick(function() {
			scene.tableTop.visible = false;
			scene.tableTopCamera.updateCubeMap( M3.renderer, M3.scene );
			scene.tableTop.visible = true;

			M3.renderer.render(M3.scene, scene.camera);
			scene.trackball.update();
		});
	}
});

module.exports = DisplayRoom;


















