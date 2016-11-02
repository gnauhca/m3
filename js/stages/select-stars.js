import Time from 'time.js';
import Stage from './stage.js';
import selectCfg from 'select-conf.js';
import ExplodeParticle from './explode-particles.js';

class Star extends Time {
	constructor(initCrood) {
		super();
		this.startLines = []; // 以此星星为起点的 Line
		this.endLines = []; // 以此星星为终点的 Line
		this.mesh;
		this.connectStars = []; 
		this.initCrood = initCrood;
		this.autoMoveTween;
	}

	init() {
		this.build();
		this.mesh.position.set(0, 0, 0);
		// this.mesh.scale.set(0, 0, 0);

		// this.mesh.rotation.set(Math.random(), Math.random(), Math.random());
		this.t = this.addTick(function() {
			// this.mesh.rotation.x += 0.02;
			this.mesh.rotation.y += 0.006;
			// this.mesh.rotation.z += 0.02;
		}.bind(this));

		let that = this;
	}

	build() {
		// create mesh
		var gemo = new THREE.SphereGeometry(10, 10, 10);
		gemo = new THREE.TetrahedronGeometry(15, 0);
		if (Math.random() > 0) {
			gemo = new THREE.BoxGeometry(15, 15, 15);
		}
		var material1 = new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true});
		var material2 = THREE.CustomMaterial.glass.clone();
		// material1.opacity = 0.2
		// var material2 = new THREE.MeshPhongMaterial({color: 0xabcdef, transparent: true, opacity: 0.7});
		var mulMaterial = new THREE.MultiMaterial([/*material1, */material2]);
		var mesh = new THREE.Mesh(gemo, mulMaterial);
		
		var mesh = THREE.SceneUtils.createMultiMaterialObject(gemo, [material1, material2]);


		mesh.rotation.set(Math.random(), Math.random(), Math.random());

		this.mesh = mesh;
	}

	setCrood(crood) {
		this.mesh.position.copy(crood);
		this.startLines.forEach(function(line) { line.setStart(crood); });
		this.endLines.forEach(function(line) { line.setEnd(crood); });
	}


	autoMove() {
		function move() {
			var newCrood = that.initCrood.clone().add(new THREE.Vector3(
				Math.random() * 20,
				Math.random() * 20,
				Math.random() * 20
			));
			that.moveTo(newCrood, move);
		}
		move();
	}

	moveTo(crood, callback) {
		autoMoveTween = this.addTHREEObjTween(this.mesh, {position: crood}, 2000 + Math.random() * 3000|0, {
			onUpdate: function() { 
				this.setCrood(this.mesh.position); 
			}.bind(this),
			onComplete: callback
		}).start();
	}
}

class ProductStar extends Star {
	constructor(crood, svgString) {
		super(crood);
		this.name;
		this.svgString = svgString;
	}

	init() {
		super.init();
		this.removeTick(this.t);
	}

	build() {
		super.build();
		var group = new THREE.Group();
		var svgGemo = new THREE.SVGGemetry(this.svgString, {});
		var material = new THREE.MeshBasicMaterial({color: 0x0cbbef});
		// var material = new THREE.MeshPhongMaterial({color: 0x0a4fdc});
		var mesh = new THREE.Mesh(svgGemo, material);
		mesh.scale.set(0.2, 0.2, 0.2 );
		this.svgMesh = mesh;

		var initV = new THREE.Vector3(0,0,1);
		var finalV = this.initCrood.clone().normalize();

		initV.y = finalV.y = 0;
		var axis = new THREE.Vector3();
		axis.crossVectors(initV, finalV).normalize();
		var angle = Math.acos( initV.dot(finalV) / initV.length() / initV.length());
		var quaternion = new THREE.Quaternion(); 

		quaternion.setFromAxisAngle(axis, angle);
		mesh.rotation.setFromQuaternion(quaternion);

		
		group.add(mesh);
		group.add(this.mesh);
		this.mesh = group;
		// this.mesh = mesh;
	}

	lightUp() {

	}
}

class Line extends Time {
	constructor(croodStart, croodEnd) {
		super();
		this.start = croodStart.clone();
		this.end = croodEnd.clone();

		this.init();
		this.setStart(croodStart);
		this.setEnd(croodEnd);
	}

	init() {
		var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4});
		var gemo = new THREE.Geometry();
		gemo.vertices.push(
			this.start,
			this.end
		);
		var line = new THREE.Line(gemo, material);
		this.mesh = line;
		this.mesh.visible = false;
	}

	connect(dur=2000, delay=0) {
		var that = this;
		var random = Math.random()*2|0;
		var movePoint = ['start', 'end'][random];
		var staticPoint = ['start', 'end'][(random+1) % 2];
		var dest = this[movePoint].clone();
		
		function update() {
			that.mesh.geometry.verticesNeedUpdate = true;
			that.mesh.material.needUpdate = true;
		}

		this.mesh.visible = true;
		this[movePoint].copy(this[staticPoint]);
		this[movePoint].animate(dest, 2000, delay, {onUpdate: update})
		this.mesh.material.animate({opacity: 0.4}, 2000, delay, {onUpdate: update})
	}

	setStart(crood) {
		this.start.copy(crood);
		this.mesh.geometry.verticesNeedUpdate = true;
	}
	setEnd(crood) {
		this.end.copy(crood);
		this.mesh.geometry.verticesNeedUpdate = true;
	}
}

class SelectStars extends Stage {
	constructor() {
		super();

		this.isInit = false;

		this._gridSize = 30;
		this._starCount = 60;
		this._rangeX = 20; // 边长
		this._rangeY = 10; // 边长
		this._rangeZ = 20; // 边长
		
		this._minDistant = this._gridSize * 3; // 两个点之间最小间隔
		this._maxConnectDistant = this._gridSize * 4; // 两个点的距离小于多少被连在一起

		this._stars = [];
		this._lines = [];
		this._products;

		this.explodeParticle = new ExplodeParticle();
	}
	init() {
		this._products = $.extend(true, [], selectCfg.products);
		this.isInit = true;
		return this._build();
	}

	_build() {
		let that = this;
		let starCroods = [];
		let starCrood;
		let isValidCrood = false;
		let starGroup = new THREE.Group();
		
		let toBaseVec = new THREE.Vector3(
			-this._gridSize * this._rangeX / 2,
			-this._gridSize * this._rangeY / 2,
			-this._gridSize * this._rangeZ / 2
		);

		while(starCroods.length < this._starCount) {

			starCrood = new THREE.Vector3(
				parseInt(this._rangeX * Math.random()) * this._gridSize, 
				parseInt(this._rangeY * Math.random()) * this._gridSize, 
				parseInt(this._rangeZ * Math.random()) * this._gridSize
			);
			starCrood.add(toBaseVec);

			let hasConnect = false;
			let distantVec = new THREE.Vector3;
			let distant;
			isValidCrood = starCroods.every(function(crood) {
				distant = distantVec.subVectors(starCrood, crood).length();
				hasConnect = (hasConnect || distant < that._maxConnectDistant);
				return distant > that._minDistant;
			}) && hasConnect;

			if (!starCroods.length || isValidCrood) {
				starCroods.push(starCrood);
			}
		}

		// 在生成的 stars 点中，随机选择作为产品 star
		let productIndexes = new Set();
		while(productIndexes.size < this._products.length) {
			productIndexes.add((Math.random() * this._starCount)|0);
		}
		// console.log(starCroods, productIndexes);
		let productCfgIndex = 0; // selectCfg.products 的 index
		starCroods.forEach(function(starCrood, index) {
			var star;
			if (productIndexes.has(index)) {
				star = new ProductStar(starCrood, that._products[productCfgIndex].svgString);
				star.init();
				star.name = that._products[productCfgIndex].name;
				that._products[productCfgIndex].star = star;
				productCfgIndex++;
			} else {
				star = new Star(starCrood); star.init();
			}
			// star.setCrood(starCrood);
			star.setCrood(new THREE.Vector3(0, 0, 0));
			// star.mesh.scale.setScalar(0.0001);
			that._stars.push(star);
			starGroup.add(star.mesh);
		});
		this.objects.starGroup = starGroup;
		this.objects.starGroup.scale.setScalar(0.0001);

		// line
		let line;
		let lineGroup = new THREE.Group();
		this._stars.forEach(function(iStar, i) {
			that._stars.forEach(function(jStar, j) {
				if (
					i === j || 
					iStar.connectStars.indexOf(jStar) !== -1 || 
					jStar.connectStars.indexOf(iStar) !== -1 ||
					(new THREE.Vector3).subVectors(iStar.initCrood, jStar.initCrood).length() > that._maxConnectDistant
				) return;


				line = new Line(iStar.initCrood, jStar.initCrood);
				iStar.connectStars.push(jStar);
				jStar.connectStars.push(iStar);
				iStar.startLines.push(line);
				jStar.endLines.push(line);
				lineGroup.add(line.mesh);
				that._lines.push(line);
			});
		});
		this.objects.lineGroup = lineGroup;
		
		// import build
		return new Promise(function(resolve) {
			that.explodeParticle.build().then(function() {
				that.objects.particleSystem = that.explodeParticle.particleSystem;
				resolve();
			}.bind(that));
		}).catch(e => console.error(e.stack));

	}

	entry() {
		var that = this;
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));


		// lightUp
		this.explodeParticle.lightUp().then(function() {

			that.objects.starGroup.rotation.x = Math.PI * 20;
			that.objects.starGroup.animate({
				scale: new THREE.Vector3(1,1,1),
				rotation_x: 0 
			}, 800, 800);

			that._stars.forEach(function(star) {
				star.mesh.animate({position: star.initCrood}, 300, (/*Math.random() * 300 + */2000)|0 )
			});	

			return that.explodeParticle.explode();
		}).then(function() {
			that._lines.forEach(function(line) {
				line.connect(3000, Math.random() * 2000);
			});

			that._controls = new THREE.TrackballControls(that.camera, M3.renderer.domElement);
			that._controls.staticMoving = true;
			that._controls.travel = true;
			that._t = that.addTick(function(delta) {
				that._controls.update(delta);
			});
		});

		// control travel
		/*this.camera.position.set(0,0,1000);
		this.camera.lookAt(new THREE.Vector3);
		this._controls = new THREE.TrackballControls(this.camera, M3.renderer.domElement);
		this._controls.staticMoving = true;
		this._controls.travel = false;
		this._t = this.addTick(function(delta) {
			this._controls.update(delta);
		});*/
	}

	
}

export default SelectStars;





