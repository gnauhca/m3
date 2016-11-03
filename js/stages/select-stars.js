import Time from 'time.js';
import Stage from './stage.js';
import selectCfg from 'select-conf.js';
import ExplodeParticle from './explode-particles.js';

class Star extends Time {
	constructor(initCrood) {
		super();
		this.startLines = []; // 以此星星为起点的 Line
		this.endLines = []; // 以此星星为终点的 Line
		this.box;
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
		let gemo = new THREE.SphereGeometry(10, 10, 10);
		gemo = new THREE.TetrahedronGeometry(15, 0);
		if (Math.random() > 0) {
			gemo = new THREE.BoxGeometry(15, 15, 15);
		}
		let material1 = new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true});
		let material2 = THREE.CustomMaterial.glass.clone();
		// material1.opacity = 0.2
		// let material2 = new THREE.MeshPhongMaterial({color: 0xabcdef, transparent: true, opacity: 0.7});
		let mulMaterial = new THREE.MultiMaterial([/*material1, */material2]);
		let mesh = THREE.SceneUtils.createMultiMaterialObject(gemo, [material1, material2]);

		mesh.rotation.set(Math.random(), Math.random(), Math.random());
		this.mesh = mesh;
		this.box = mesh;
	}

	setCrood(crood) {
		this.mesh.position.copy(crood);
		this.startLines.forEach(function() {this.update()});
		this.endLines.forEach(function() {this.update()});
	}


	autoMove() {
		function move() {
			let newCrood = that.initCrood.clone().add(new THREE.Vector3(
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
		let group = new THREE.Group();
		let svgGemo = new THREE.SVGGemetry(this.svgString, {});
		let material = new THREE.MeshBasicMaterial({color: 0x0cbbef});
		// let material = new THREE.MeshPhongMaterial({color: 0x0a4fdc});
		let mesh = new THREE.Mesh(svgGemo, material);
		mesh.scale.set(0.2, 0.2, 0.2 );
		this.svgMesh = mesh;

		let initV = new THREE.Vector3(0,0,1);
		let finalV = this.initCrood.clone().normalize();

		initV.y = finalV.y = 0;
		let axis = new THREE.Vector3();
		axis.crossVectors(initV, finalV).normalize();
		let angle = Math.acos( initV.dot(finalV) / initV.length() / initV.length());
		let quaternion = new THREE.Quaternion(); 

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
	constructor(startStar, endStar) {
		super();
		this.startStar = startStar;
		this.endStar = endStar;

		this.start = new THREE.Vector3;
		this.end = new THREE.Vector3;

		this.startPointLight; // 端点光
		this.endPointLight; // 端点光

		this.ray = new THREE.Raycaster();
		this.connected = false;
		this.init();
	}

	init() {
		let material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4});
		let gemo = new THREE.Geometry();
		gemo.vertices.push(this.start, this.end);

		let line = new THREE.Line(gemo, material);
		this.mesh = line;
		this.mesh.visible = false;
	}

	connect(dur=2000, delay=0) {
		let that = this;
		let moveIndex = Math.random()*2|0;
		let staticIndex = (moveIndex+1) % 2;
		
		function update() {
			that.mesh.geometry.verticesNeedUpdate = true;
			that.mesh.material.needUpdate = true;
		}

		var pointTween = new TWEEN.Tween({p: 0}).to({p: 1}, dur).onUpdate(function() {
			let curCroods = that.calCrood();
			let sub = (new THREE.Vector3).subVectors(curCroods[moveIndex],curCroods[staticIndex]);
			sub.setLength(sub.length * this.p);
			curCroods[moveIndex] = curCroods[staticIndex].clone().add(sub);
			that.setCrood(curCroods);
		}).onComplete(function() {
			that.removeTween(pointTween);
			that.connected = true;
		});
		setTimeout(()=>pointTween.start(), delay);		
		this.mesh.material.animate({opacity: 0.4}, dur, delay, {onUpdate: update})
	}

	calCrood() {
		let startV = this.startStar.box.getWorldPosition();
		let endV = this.endStar.box.getWorldPosition();

		console.log(this.startStar.initCrood, this.endStar.initCrood);
		// console.log(startV, endV, (new THREE.Vector3).subVectors(endV, startV));
		this.ray.set(startV, (new THREE.Vector3).subVectors(endV, startV).normalize());
		let intersects = this.ray.intersectObjects([this.startStar.box, this.endStar.box]);
		console.log(intersects);
		return [intersects[0].point, intersects[1].point];
	}

	setCrood(croods) {
		this.start.copy(croods[0]);
		this.end.copy(croods[1]);
		this.mesh.geometry.verticesNeedUpdate = true;
	}

	update() {
		if (!this.connected) return;
		var vecs = calCrood();
		setCrood(vecs[0], vecs[1]);
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
			let star;
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

				line = new Line(iStar, jStar);
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
		this.explodeParticle.build();
		this.objects.particleSystem = this.explodeParticle.particleSystem;

	}

	entry() {
		let that = this;
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





