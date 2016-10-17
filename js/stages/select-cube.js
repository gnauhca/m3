import Stage from './stage.js';

// Dependencies CONFIG.selects
class SelectCube extends Stage {

	constructor() {
		super();
		this.objects;
		this._BASECROOD = new THREE.Vector3();
		this._PLANEWIDTH = 1500;
		this._PLANEHEIGHT = 1500;
		this._CUBESIZE = 60; // 立方体大小
		this._GRIDXCOUNT = (this._PLANEWIDTH / this._CUBESIZE)|0; // 横向个数
		this._GRIDZCOUNT = (this._PLANEHEIGHT / this._CUBESIZE)|0; // 纵向 Z(向) 个数
		this._CUBEHEIGHT = 400;
		this._MINSCALE = 0.1; // 最小高度缩放
		this._MAXSCALE = 0.6; // 最大高度缩放
		this._cubes; // 存储方块信息的二维数组		
		this.isInit = false;
	}

	// this.objects
	init() {
		this.build();
        this.isInit = true;
	}

	build() {

		// cubes
		this._cubes = [];

		var emptySpace = 0.3;
		var cubeGroup = new THREE.Group();
		var cubeMaterial;
		var cubeGeom;
		var cube;
		var glowCube;

		for (let i = 0; i < this._GRIDXCOUNT; i++ ) {
	
			for (let j = 0; j < this._GRIDZCOUNT; j++ ) {

				var x = this._BASECROOD.x - this._GRIDXCOUNT / 2 + i;
				var z = this._BASECROOD.z - this._GRIDZCOUNT / 2 + j;
				if (x * x + z * z < this._GRIDXCOUNT * emptySpace * this._GRIDXCOUNT * emptySpace ||
					(Math.random() + 0.5) | 0) {
					continue;
				}

				this._cubes[i] = this._cubes[i] || [];
				this._cubes[i][j] = {
					position: {x: x, y: 0, z: z},
					scaleV: (Math.random() / 6000), // 缩放速度每一帧缩放 0.??
					scaleMin: this._MINSCALE + (this._MAXSCALE - this._MINSCALE) * Math.random() / 2,
					scaleMax: this._MAXSCALE - (this._MAXSCALE - this._MINSCALE) * Math.random() / 2, // 缩放范围
				};
				// console.log(this._cubes[i][j].position);
				// 
				var cubeSize = this._CUBESIZE *  (0.2 + 0.5 * Math.random());
				cubeGeom = new THREE.BoxGeometry(
								cubeSize, 
								this._CUBEHEIGHT, 
								cubeSize,2,2,2
							);
				cubeMaterial = new THREE.MeshLambertMaterial(
					{
						color: 0x888888,
						// transparent: true,
						// opacity: 0.9,
						// reflectivity: 1,
						// specular: 0xdddddd,
						// shininess: 90
					}
				);
				cube = new THREE.Mesh(cubeGeom, cubeMaterial);
				cube.position.set(
					(this._cubes[i][j].position.x + Math.random() - 0.5) * this._CUBESIZE,
					0,
					(this._cubes[i][j].position.z + Math.random() - 0.5) * this._CUBESIZE
				);
				cube.scale.set(1, 0.01, 1);
				this._cubes[i][j].cube = cube;

				var glowCubeGeom = new THREE.BoxGeometry(
					cubeSize * 1.4, 
					this._CUBEHEIGHT  * 1.1, 
					cubeSize * 1.4, 3, 8, 3
				);
				var modifier = new THREE.SubdivisionModifier( 1 );
				modifier.modify( glowCubeGeom ); 
				glowCube = new THREE.Mesh(
					glowCubeGeom,
					new THREE.GlowMaterial({
						c: 0.34,
						p: 2.8,
						color: new THREE.Color(0xffffff),
						transparent: true
					})
				);
				
				glowCube.position.copy(cube.position);
				glowCube.scale.copy(cube.scale);
				this._cubes[i][j].glowCube = glowCube;

				cubeGroup.add(cube);
				cubeGroup.add(glowCube);



			}
		}

		this.objects.cubeGroup = cubeGroup;


	}

	entry() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));
		this._moveCubes();
	}

	leave() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}

	_moveCube(cube) {
		var that = this;
		var target = {};
		var dur;

		cube.scaleMin = this._MINSCALE + (this._MAXSCALE - this._MINSCALE) * Math.random() / 2;
		cube.scaleMax = this._MAXSCALE - (this._MAXSCALE - this._MINSCALE) * Math.random() / 2; // 缩放范围
		
		if (cube.cube.scale.y <= cube.scaleMin) {
			target.scale = new THREE.Vector3(1, cube.scaleMax + 0.01, 1);
		} else if (cube.cube.scale.y >= cube.scaleMax) {
			target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
		} else {
			target.scale = new THREE.Vector3(1, cube.scaleMin - 0.01, 1);
		}
		// target.scale.x = target.scale.z = target.scale.y < 0.7 ? 0.7: target.scale.y;
		// target.rotation = new THREE.Euler( 0, cube.cube.rotation.y + Math.random() * Math.PI * (1 - Math.random()), 0, 'XYZ' );

		dur = Math.abs(target.scale.y - cube.cube.scale.y) / cube.scaleV;
		
		cube.tween = that.addTHREEObjTween(cube.cube, target, dur, {
			onUpdate: function() {
				cube.glowCube.scale.copy(cube.cube.scale)//.multiplyScalar(1.5);
				//cube.glowCube.scale.y = cube.cube.scale.y + 0.2;
			},
			onComplete: function() {
				// console.log(target);
				that.removeTween(cube.tween);
				that._moveCube(cube);
			}
		});
		cube.tween.start();


	}

	// Normal 方块移动
	_moveCubes() {
		for (let cube, i = this._cubes.length - 1; i >= 0; i--) {
			if (!this._cubes[i]) { continue; }
			for (let j = this._cubes[i].length - 1; j >= 0; j--) {
				if (!this._cubes[i][j]) { continue; }
				cube = this._cubes[i][j];
				this._moveCube(cube);
			};
		};
	}



}

export default SelectCube;