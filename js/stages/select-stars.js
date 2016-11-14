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
			this.setCrood();
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
		material2.side = THREE.DoubleSide;
		let mesh = THREE.SceneUtils.createMultiMaterialObject(gemo, [material1, material2]);

		mesh.rotation.set(Math.random(), Math.random(), Math.random());
		this.mesh = mesh;
		this.box = mesh;
		this.box.name = 'starbox';
	}

	setCrood(crood) {
		crood && this.mesh.position.copy(crood);
		this.startLines.forEach((line) => line.update());
		this.endLines.forEach((line) => line.update());
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
		this.selected = false;
		this._svgString = svgString;

		this._svgMesh;
		this._glowSprite;

		this._selectTween;

	}

	init() {
		super.init();
		this.removeTick(this.t);
	}

	build() {
		super.build();
		let group = new THREE.Group();
		let svgGemo = new THREE.SVGGemetry(this._svgString, {});
		let material = new THREE.MeshBasicMaterial({color: 0x0cbbef});
		// let material = new THREE.MeshPhongMaterial({color: 0x0a4fdc});
		let svgMesh = new THREE.Mesh(svgGemo, material);
		svgMesh.scale.set(0.1, 0.1, 0.1);

		let initV = new THREE.Vector3(0,0,1);
		let finalV = this.initCrood.clone().normalize();

		initV.y = finalV.y = 0;
		let axis = new THREE.Vector3();
		axis.crossVectors(initV, finalV).normalize();
		let angle = Math.acos( initV.dot(finalV) / initV.length() / initV.length());
		let quaternion = new THREE.Quaternion(); 

		quaternion.setFromAxisAngle(axis, angle);
		svgMesh.rotation.setFromQuaternion(quaternion);
		this._svgMesh = svgMesh;

		let spriteMap = M3.assets.particleMap.texture; 

		let spriteMaterial = new THREE.SpriteMaterial({
			map: spriteMap,
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 0
		});
		let glowSprite = new THREE.Sprite(spriteMaterial);
		glowSprite.scale.set(80, 80, 80);
		this._glowSprite = glowSprite;
		
		group.add(glowSprite);
		group.add(svgMesh);
		group.add(this.mesh);
		this.mesh = group;
	}

	select() {
		var that = this;
		this.selected = true;
		this._glowSprite.visible = true;
		this._glowSprite.material.stopAnimate().animate({opacity: 0.6}, 300, 0, {
			onUpdate: () => function() {
				this._glowSprite.material.needUpdate = true;
			},
			onComplete: ()=>this._glowSprite.visible = true
		});
	}

	unSelect() {
		this.selected = false;
		this._glowSprite.visible = true;
		this._glowSprite.material.stopAnimate().animate({opacity: 0}, 300, 0, {
			onComplete: ()=>this._glowSprite.visible = false
		});
	}
}

class Line extends Time {
	constructor(startStar, endStar) {
		super();
		this.startStar = startStar;
		this.endStar = endStar;

		this.start = new THREE.Vector3;
		this.end = new THREE.Vector3;

		this.mesh; // 需要被加进场景的物体
		this.line;
		this.startPointLight; // 端点光
		this.endPointLight; // 端点光

		this.ray = new THREE.Raycaster();
		this.connected = false;
		this.init();
	}

	init() {
		let lineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4});
		let lineGeom = new THREE.Geometry();
		lineGeom.vertices.push(this.start, this.end);
		this.line = new THREE.Line(lineGeom, lineMaterial);

		let pointLightMap = M3.assets.particleMap.texture; 

		let spriteMaterial = new THREE.SpriteMaterial({
			size: 15,
			map: pointLightMap,
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 0
		});
		this.startPointLight = new THREE.Sprite(spriteMaterial);
		this.endPointLight = new THREE.Sprite(spriteMaterial);
		this.startPointLight.scale.set(10,10,10);
		this.endPointLight.scale.set(10,10,10);

		this.mesh = new THREE.Group();
		this.mesh.add(this.line);
		this.mesh.add(this.startPointLight);
		this.mesh.add(this.endPointLight);
		this.mesh.visible = false;
	}

	connect(dur=TIME_1000, delay=0) {
		let that = this;
		let moveIndex = Math.random()*2|0;
		let staticIndex = (moveIndex+1) % 2;
		
		this.mesh.visible = true;
		function update() {
			that.line.geometry.verticesNeedUpdate = true;
			that.line.material.needUpdate = true;
		}
		
		let pointTween = new TWEEN.Tween({p: 0}).to({p: 1}, dur)
			.easing(TWEEN.Easing.Cubic.In).onUpdate(function() {
				let curCroods = that.calCrood();
				let sub = (new THREE.Vector3).subVectors(curCroods[moveIndex],curCroods[staticIndex]);
				sub.setLength(sub.length() * this.p);
				curCroods[moveIndex] = curCroods[staticIndex].clone().add(sub);
				that.setCrood(curCroods);
			}).onComplete(function() {
				that.removeTween(pointTween);
				that.connected = true;
			});
		setTimeout(()=>pointTween.start(), delay);		
		this.line.material.animate({opacity: 0.4}, dur, delay, {onUpdate: update})
		this.startPointLight.animate({scale: new THREE.Vector3(1,1,1)}, dur, delay);
		this.startPointLight.material.animate({opacity: 0.5}, dur, delay);
	}

	calCrood() {
		let startV = this.startStar.box.getWorldPosition();
		let endV = this.endStar.box.getWorldPosition();

		// console.log(this.startStar.initCrood, this.endStar.initCrood);
		// console.log(startV, endV, (new THREE.Vector3).subVectors(endV, startV));
		this.ray.set(startV, (new THREE.Vector3).subVectors(endV, startV).normalize());
		let intersects = this.ray.intersectObjects([this.startStar.box, this.endStar.box], true);
		let pointStart,pointEnd;

		intersects.forEach(function(intersect) {
			if (!pointStart && this.startStar.box.children.indexOf(intersect.object) !== -1) {
				pointStart = intersect.point;
			}
			if (!pointEnd && this.endStar.box.children.indexOf(intersect.object) !== -1) {
				pointEnd = intersect.point;
			}
		}.bind(this));

		//console.log(intersects);
		//console.log(pointStart, pointEnd);
		return [pointStart, pointEnd];
	}

	setCrood(croods) {
		this.start.copy(croods[0]);
		this.end.copy(croods[1]);

		this.startPointLight.position.copy(this.start);
		this.endPointLight.position.copy(this.end);

		this.line.geometry.verticesNeedUpdate = true;
	}

	update() {
		if (!this.connected) return;
		let vecs = this.calCrood();
		this.setCrood(vecs);
	}
}

class SelectStars extends Stage {
	constructor() {
		super();

		this.isInit = false;
		this.interacted = false;

		this._gridSize = 30;
		this._starCount = 60;
		this._rangeX = 20; // 边长
		this._rangeY = 10; // 边长
		this._rangeZ = 20; // 边长
		
		this._minDistant = this._gridSize * 3; // 两个点之间最小间隔
		this._maxConnectDistant = this._gridSize * 4; // 两个点的距离小于多少被连在一起

		this._productCfgs;
		this._stars = [];
		this._lines = [];
		this._pStars = []; // 产品星
		this._selectedPStars = [];
		this._maxSelected = 2;

		this.explodeParticle = new ExplodeParticle();
	}
	init() {
		this._productCfgs = $.extend(true, [], selectCfg.products);
		this.isInit = true;
		this._initEvent();
		return this._build();
	}

	_initEvent() {
		let that = this;
		let raycaster = new THREE.Raycaster();
		let intersects;
		let mouse = new THREE.Vector2();
		let hit;
		let hitStar;

		function mousedown(event) {
			if (!that.interacted) return;

			hit = null;
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
			raycaster.setFromCamera(mouse, M3.camera);
			intersects = raycaster.intersectObjects(that._pStars.map(pStar=>pStar.box), true);

			if (intersects.some(function(intersect) {
				if (intersect.object.name === 'starbox') {
					hit = intersect;
					return true;
				} else if (intersect.object.parent && intersect.object.parent.name === 'starbox') {
					hit = intersect.object.parent;
					return true;
				}
			})) {
				hitStar = that._pStars.filter(pStar=>pStar.box===hit)[0];
				that._toggle(hitStar);
			}
			// console.log(hit);
		}

		document.addEventListener('click', mousedown);
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
		while(productIndexes.size < this._productCfgs.length) {
			productIndexes.add((Math.random() * this._starCount)|0);
		}
		// console.log(starCroods, productIndexes);
		let productCfgIndex = 0; // selectCfg.products 的 index
		starCroods.forEach(function(starCrood, index) {
			let star;
			if (productIndexes.has(index)) {
				star = new ProductStar(starCrood, that._productCfgs[productCfgIndex].svgString);
				star.init();
				star.name = that._productCfgs[productCfgIndex].name;
				that._pStars.push(star);
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
			}, TIME_800, TIME_800);

			that._stars.forEach(function(star) {
				star.mesh.animate({position: star.initCrood}, TIME_300, (TIME_2000)|0 )
			});	
			return that.explodeParticle.explode();

		}).then(function() {
			that._lines.forEach(function(line) {
				line.connect(TIME_3000, Math.random() * TIME_2000);
			});

			that._controls = new THREE.TrackballControls(that.camera, M3.renderer.domElement);
			that._controls.staticMoving = true;
			that._controls.travel = true;
			that._t = that.addTick(function(delta) {
				that._controls.travel = false;
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


	_select(star) {
		if (this._selectedPStars.length === this._maxSelected) {
			this._selectedPStars.shift().unSelect();
		}
		star.select();
		this._selectedPStars.push(star);
	}

	_unSelect(star) {
		star.unSelect();
		this._selectedPStars = this._selectedPStars.filter(pStar=>star!==pStar);
	}

	_toggle(star) {
		star.selected ? this._unSelect(star) : this._select(star);
	}

	// 下列选择方法，使用产品名字，用于UI的交互
	selectMul(arr) {
		
	}

	toggle(name) {
		let star = this._products.filter((product)=>product.name===name)[0];
		this._toggle(star);
	}

	getSelected() {

	}
	
}

export default SelectStars;





