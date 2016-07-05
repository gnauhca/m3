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
	var camera;
	var trackball;

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
		M3.scene.remove(camera);
	}

	this.resize = function() {
		if (!initialized && active) return;
		camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

		camera.position.set(0, 0, 250);
		camera.lookAt(baseCrood);
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
				'./assets/room/floor.jpg',
				'./assets/room/wall.jpg',
				'./assets/room/wall.jpg',
			]
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

		textureCube.repeat.set(5,5);
		textureCube.wrapS = THREE.RepeatWrapping;
		textureCube.wrapT = THREE.RepeatWrapping;
        // var shader = THREE.ShaderLib["cube"];
        // shader.uniforms["tCube"].value = textureCube;
        // var roomMaterial = new THREE.ShaderMaterial({
        //     fragmentShader: shader.fragmentShader,
        //     vertexShader: shader.vertexShader,
        //     uniforms: shader.uniforms,
        //     depthWrite: false,
        //     side: THREE.BackSide
        // });
		// roomMaterial.map.repeat.set(5,5);
	 //    roomMaterial.map.wrapS = THREE.RepeatWrapping;
	 //    roomMaterial.map.wrapT = THREE.RepeatWrapping;

		var roomMaterials = [];
		var material;
		for (var i = 0; i < assets.scene.room.length; i++) {
			if (i == 3) {
				material = new THREE.MeshBasicMaterial({
					'map': THREE.ImageUtils.loadTexture(assets.scene.room[i]),
					'side': THREE.BackSide
				});	
				material.reflectivity = 1;
			} else {
				material = new THREE.MeshBasicMaterial({
					'map': THREE.ImageUtils.loadTexture(assets.scene.room[i]),
					'side': THREE.BackSide
				});				
			}


			material.map.repeat.set(5,5);
            material.map.wrapS = THREE.RepeatWrapping;
            material.map.wrapT = THREE.RepeatWrapping;

			roomMaterials.push(material);
		}
		var roomMaterial = new THREE.MeshFaceMaterial( roomMaterials );

		var roomCube = new THREE.CubeGeometry(100, 80, 100);
		var room = new THREE.Mesh(roomCube, roomMaterial);

		M3.scene.add(room);

		// logo 
		var logoCube = new THREE.CubeGeometry(50, 20, 1);
		var logoMaterial = wallMaterial;
		logoMaterial.envMap = textureCube;
		var logo = new THREE.Mesh(logoCube, logoMaterial);
		logo.position.set(0, 0, -47);
		M3.scene.add(logo);

		// table
		var tableTopCyliner = new THREE.CylinderGeometry(20, 19.8, 0.5, 60);
		var tableMaterial = wallMaterial;
		tableMaterial.envMap = textureCube;

		var tableTop = new THREE.Mesh(tableTopCyliner, tableMaterial);
		tableTop.position.set(0, -29, 0);
		M3.scene.add(tableTop);

		var tableBottomCyliner = new THREE.CylinderGeometry(19.5, 16, 10, 60);
		var tableBottom = new THREE.Mesh(tableBottomCyliner, tableMaterial);
		tableBottom.position.set(0, -35, 0);
		M3.scene.add(tableBottom);

		// light 
        var ambiColor = "#333333";
        var ambientLight = new THREE.AmbientLight(ambiColor);
        M3.scene.add(ambientLight);

        var roomLight = {};
        roomLight.lightCenter = new THREE.SpotLight(0xffffff);
		roomLight.lightLeftTop = new THREE.SpotLight(0xffffff);
		roomLight.lightRightTop = new THREE.SpotLight(0xffffff);
		roomLight.lightLeftBottom = new THREE.SpotLight(0xffffff);
		roomLight.lightRightBottom = new THREE.SpotLight(0xffffff);

        roomLight.lightCenter = new THREE.SpotLight(0, 40, 0);
		roomLight.lightLeftTop.position.set(-49, 49, -49);
		roomLight.lightRightTop.position.set(49, 49, -49);
		roomLight.lightLeftBottom.position.set(-49, 49, 49);
		roomLight.lightRightBottom.position.set(49, 49, 49);

		for (var light in roomLight) {
	        roomLight[light].castShadow = true;
	        roomLight[light].shadowCameraNear = 2;
	        roomLight[light].shadowCameraFar = 100;
	        roomLight[light].shadowCameraFov = 40;
	        roomLight[light].distance = 0;
	        roomLight[light].angle = 0.4;
	        roomLight[light].intensity = 0.3;
			M3.scene.add(roomLight[light]);
		}



		// camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
        camera.position.set(-50, 20, 50);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        M3.scene.add(camera);

        trackball = new THREE.TrackballControls(camera);
	}

	function setupUI() {

	}



	function render() {
		that.addTick(function() {
			M3.renderer.render(M3.scene, camera);
			trackball.update();
		});
	}
});

module.exports = DisplayRoom;


















