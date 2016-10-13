import Stage from './stage.js';

// Dependencies CONFIG.selects
class SelectCube extends Stage {
	this.isInit = false;
	this.objects;

	var that = this;
	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(200, 100, 200);

	var _CUBESIZE = 20; // 立方体大小
	var _CUBEXCOUNT = 20; // 横向个数
	var _CUBEZCOUNT = 20; // 纵向 Z(向) 个数
	var _CUBEHEIGHT = 100;
	var _MINSCALE = 0.1; // 最小高度缩放
	var _MAXSCALE = 0.6; // 最大高度缩放

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
					scaleV: (Math.random() / 6000), // 缩放速度每一帧缩放 0.??
					scaleMin: _MINSCALE + (_MAXSCALE - _MINSCALE) * Math.random() / 2,
					scaleMax: _MAXSCALE - (_MAXSCALE - _MINSCALE) * Math.random() / 2, // 缩放范围
				};
				cubeGeom = new THREE.BoxGeometry(
								_CUBESIZE * 0.5, 
								_CUBEHEIGHT, 
								_CUBESIZE * 0.5
							);
				cubeMaterial = new THREE.MeshPhongMaterial(
					{
						color: 0x00b9ef,
						//transparent: true,
						opacity: 0.9,
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
				cube.scale.set(1, 0.01, 1);
				_cubes[i][j].cube = cube;
				cubeGroup.add(cube);
			}
		}

		//product cube
		_productCubes = [];
		CONFIG.selects.forEach(function(select) {
			var cube = _cubes[select.size[0]][select.size[1]];
			cube.name = select.name;
			_productCubes.push(cube);
		});

		this.objects.cubeGroup = cubeGroup;

		// plane
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

 		this.objects.spotLight = new THREE.SpotLight(0xffffff);
 		this.objects.spotLight.intensity = 0.8;
 		this.objects.spotLight.position.set(-300, 200, 100);
 		this.objects.spotLight.lookAt(_BASECROOD); 

 		this.objects.spotLight2 = new THREE.SpotLight(0xffffff);
 		this.objects.spotLight2.intensity = 0.5;
 		this.objects.spotLight2.position.set(200, 200, -100);
 		this.objects.spotLight2.lookAt(_BASECROOD); 

		_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	}

	this.entry = function() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		this.camera.position.copy(_CAMERACROOD);
		this.camera.lookAt(_BASECROOD);

		moveCubes();
	}


	this.selectProduct = function(productNames) {

	}

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}

	function moveCube(cube) {
		var target = {};
		var dur;

		cube.scaleMin = _MINSCALE + (_MAXSCALE - _MINSCALE) * Math.random() / 2;
		cube.scaleMax = _MAXSCALE - (_MAXSCALE - _MINSCALE) * Math.random() / 2; // 缩放范围
		
		if (cube.cube.scale.y <= cube.scaleMin) {
			target.scale = new THREE.Vector3(1, cube.scaleMax + 0.01, 1);
		} else if (cube.cube.scale.y >= cube.scaleMax) {
			target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
		} else {
			target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
		}
		target.scale.x = target.scale.z = target.scale.y < 0.7 ? 0.7: target.scale.y;
		target.rotation = new THREE.Euler( 0, cube.cube.rotation.y + Math.random() * Math.PI * (1 - Math.random()), 0, 'XYZ' );

		dur = Math.abs(target.scale.y - cube.cube.scale.y) / cube.scaleV;
		cube.tween = that.addTHREEObjTween(cube.cube, target, dur, {
			onComplete: function() {
				// console.log(target);
				that.removeTween(cube.tween);
				moveCube(cube);
			}
		});
		cube.tween.start();
	}

	// Normal 方块移动
	function moveCubes() {
		for (var cube, i = _cubes.length - 1; i >= 0; i--) {
			_cubes[i]
			for (var j = _cubes[i].length - 1; j >= 0; j--) {
				cube = _cubes[i][j];
				moveCube(cube);
			};
		};
		 // moveCube(_cubes[0][0]);
		// console.log(_cubes[0][0]);
	}




	//a


}

module.exports = SelectCube;