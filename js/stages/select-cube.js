var Stage = require('./stage.js');

var SelectCube = Stage.extend(function() {
	this.isInit = false;
	this.objects;

	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(200, 200, 200);

	var _CUBESIZE = 10; // 立方体大小
	var _CUBEXCOUNT = 20; // 横向个数
	var _CUBEZCOUNT = 20; // 纵向 Z(向) 个数
	var _MINHEIGHT = 100; // 最小高度
	var _MAXHEIGHT = 100; // 最大高度

	var _cubes;

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

		for (var x = _BASECROOD.x - _CUBEXCOUNT / 2, i = 0; i < _CUBEXCOUNT; i++ ) {
			_cubes[i] = cubes[i] || [];
			for (var z = _BASECROOD.z - _CUBEZCOUNT / 2, j = 0; j < _CUBEZCOUNT; j++ ) {

				_cubes[i][j] = {
					position: {x: x, y: 0, z: z},
					height: _MINHEIGHT + (_MAXHEIGHT - _MINHEIGHT) * Math.random(),
					v: (100 * Math.random() | 0) / 2000, // 缩放速度
					scale: (0.5 * Math.random() | 0) // 缩放范围
				};
				cubeGeom = new THREE.BoxGeometry(
								_CUBESIZE, 
								_CUBESIZE, 
								_cubes[i][j]
							);
				cubeMaterial = new THREE.MeshLambertMaterial();
				cube = new THREE.Mesh(cubeGeom, cubeMaterial);
				cube.position.set(
					_cubes[i][j].x * _CUBESIZE,
					_cubes[i][j].y * _CUBESIZE,
					_cubes[i][j].z * _CUBESIZE,
				);
				_cubes[i][j].cube = cube;
				cubeGroup.add(cube);
			}
		}
		this.cubeGroup = cubeGroup;

		// plane
		var planeGridCount = 50;
		var planeWidth = planeGridCount * _CUBESIZE;
		var planeHeight = planeGridCount * _CUBESIZE;
		var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
		var material = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
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
        //directionalLight.target = this.objects.sphere;

        this.objects.directionalLight = directionalLight;

        var directionalLight2 = new THREE.DirectionalLight(directionalLightColor);
        directionalLight2.position.set(30, 50, 50);
        this.objects.directionalLight2 = directionalLight2;
	}

	this.entry = function() {

	}	

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}
});

module.exports = SelectCube;