var Stage = require('./stage.js');

// Dependencies CONFIG.selects
var SelectCube = Stage.extend(function() {
	this.isInit = false;
	this.objects;

	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(200, 100, 200);

	var _CUBESIZE = 30; // 立方体大小
	var _CUBEXCOUNT = 10; // 横向个数
	var _CUBEZCOUNT = 10; // 纵向 Z(向) 个数
	var _CUBEHEIGHT = 100;
	var _MINSCALE = 0.1; // 最小高度缩放
	var _MAXSCALE = 0.9; // 最大高度缩放

	var _cubes; // 存储方块信息的二维数组
	var _productCubes; // 产品方块

	var _cubeTick;


	// this.objects
	this.init = function() {
		this.build();
        this.isInit = true;
	}

	this.build = function() {

		// cubes
		_cubes = [];

		var cubeGroup = new THREE.Group();
		var cubeMaterial;
		var cubeGeom;
		var cube;

		for (var i = 0; i < _CUBEXCOUNT; i++ ) {
			var x = _BASECROOD.x - _CUBEXCOUNT / 2 + i;
			_cubes[i] = _cubes[i] || [];
			for (var j = 0; j < _CUBEZCOUNT; j++ ) {
				var z = _BASECROOD.z - _CUBEZCOUNT / 2 + j;
				_cubes[i][j] = {
					position: {x: x, y: 0, z: z},
					height: _CUBEHEIGHT * 2,
					scaleV: (Math.random() | 0) / 2000, // 缩放速度每一帧缩放 0.??
					scale: _MINSCALE + (_MAXSCALE - _MINSCALE) * Math.random(), // 缩放范围
					percent: Math.random()
				};
				cubeGeom = new THREE.BoxGeometry(
								_CUBESIZE * 0.8, 
								0, 
								_CUBESIZE * 0.8
							);
				cubeMaterial = new THREE.MeshPhongMaterial(
					{
						color: 0x00b9ef,
						transparent: true,
						opacity: 0.95,
						reflectivity: 1,
						specular: 0xdddddd,
						shininess: 90
					}
				);
				cube = new THREE.Mesh(cubeGeom, cubeMaterial);
				cube.position.set(
					_cubes[i][j].position.x * _CUBESIZE,
					0,
					_cubes[i][j].position.z * _CUBESIZE
				);
				console.log(cube.position);
				_cubes[i][j].cube = cube;
				cubeGroup.add(cube);
			}
		}

		//product cube
		_productCubes = [];
		CONFIG.selects.forEach(function(select) {
			_productCubes.push(_cubes[select.size[0]][select.size[1]]);
		});

		this.objects.cubeGroup = cubeGroup;

		plane
		var planeGridCount = 50;
		var planeWidth = planeGridCount * _CUBESIZE;
		var planeHeight = planeGridCount * _CUBESIZE;
		var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
		var material = new THREE.MeshPhongMaterial( {color: 0x3a5c67, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( phaneGeom, material );
		plane.rotation.x = Math.PI * 0.5;
		this.objects.plane = plane;

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
        directionalLight.target = this.objects.sphere;

        //this.objects.directionalLight = directionalLight;
 		this.objects.spotLight = new THREE.SpotLight(0xeeeeee);
 		this.objects.spotLight.intensity = 1;
 		this.objects.spotLight.position.set(-300, 200, 100);
 		this.objects.spotLight.lookAt(_BASECROOD); 

		_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	}

	this.entry = function() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		this.camera.position.copy(_CAMERACROOD);
		this.camera.lookAt(_BASECROOD);

		_cubeTick = this.addTick(moveCube);
	}


	this.selectProduct = function(productNames) {

	}

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}

	// Normal 方块移动
	function moveCube = function(delta) {
		for (var cube, i = _cubes.length - 1; i >= 0; i--) {
			_cubes[i]
			for (var j = _cobes[i].length - 1; j >= 0; j--) {
				cube = _cobes[i][j];

				if (!cube.selected) {
					cube.scale += delta * cube.scaleV;
					
				}

			};
		};
	}







});

module.exports = SelectCube;