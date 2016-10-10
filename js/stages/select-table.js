var Stage = require('./stage.js');
var selectCfg = require('select-conf.js');

// Dependencies CONFIG.selects
var SelectCube = Stage.extend(function() {
	this.isInit = false;
	this.objects;

	var that = this;
	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(00, 400, 300);

	var _products = []; // [{mesh: xx, selected: false}]

	var _t;
	var _trackballControls;


	// this.objects
	this.init = function() {
		buildBase();
		buildProductLogo(); //set products

		_trackballControls = new THREE.TrackballControls(this.camera);

        this.isInit = true;
	}


	this.entry = function() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		this.camera.position.copy(_CAMERACROOD);
		this.camera.lookAt(_BASECROOD);

		_t = this.addTick(function(delta) {
			_trackballControls.update(delta);
		});
	}


	this.selectProduct = function(productNames) {

	}

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}


	function buildBase() {

		// table 2m width
		var tableTopGemo = new THREE.CylinderGeometry(100, 100, 5, 100);
		var tableTopMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaff});

		tableTopMaterial.transparent = true;
		tableTopMaterial.opacity = 0.3;
		tableTopMaterial.refractionRatio = 1.3;
		tableTopMaterial.reflectivity = 1;
		tableTopMaterial.shininess = 37.46;
		tableTopMaterial.specular = new THREE.Color("rgb(0.54, 0.54, 0.54)");

		var tableTop = new THREE.Mesh(tableTopGemo, tableTopMaterial);
		tableTop.position.set(0, 31, 0);

		var tableBottomGemo = new THREE.CylinderGeometry(100, 90, 30, 100, 10);
		var tableBottomMaterial = new THREE.MeshLambertMaterial({color: 0x3a5c67,'side': THREE.DoubleSide, 'emissive': 0x888888}); 
		var tableBottom = new THREE.Mesh(tableBottomGemo, tableBottomMaterial);
		tableBottom.position.set(0, 15, 0);

		that.objects.tableTop = tableTop;
		that.objects.tableBottom = tableBottom;

		// meizu logo
		var svgString = selectCfg.logo;
		var options = {
            amount: 5,
            bevelThickness: 0.5,
            bevelSize: 0.5,
            bevelSegments: 12,
            bevelEnabled: true,
            curveSegments: 80,
            steps: 1
        };
        var svgGemo = createSVGGemo(svgString, options);
        svgGemo.computeBoundingBox()
        svgGemo.translate(0, -svgGemo.boundingBox.max.y, 0);
        svgGemo.rotateX(Math.PI);

        var svgMaterial = new THREE.MeshPhongMaterial({color: 0x0cbbef, shininess: 100, metal: true});
        var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
        svgMesh.position.set(0, 0, 200);
        M3.scene.add(svgMesh);
        that.objects.svgLogo = svgMesh;

		// plane
		var planeGridCount = 50;
		var planeWidth = planeGridCount * 20;
		var planeHeight = planeGridCount * 20;
		var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
		var material = new THREE.MeshPhongMaterial( {color: 0x3a5c67, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( phaneGeom, material );
		plane.rotation.x = Math.PI * 0.5;
		that.objects.plane = plane;

		// light
        var directionalLightColor = "#ffffff";
        var directionalLight = new THREE.DirectionalLight(directionalLightColor);
        directionalLight.name = that.name + ' directionalLight';
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
        directionalLight.target = that.objects.sphere;

 		that.objects.spotLight = new THREE.SpotLight(0xffffff);
 		that.objects.spotLight.intensity = 0.8;
 		that.objects.spotLight.position.set(-300, 200, 100);
 		that.objects.spotLight.lookAt(_BASECROOD); 

 		that.objects.spotLight2 = new THREE.SpotLight(0xffffff);
 		that.objects.spotLight2.intensity = 0.5;
 		that.objects.spotLight2.position.set(100, 200, -100);
 		that.objects.spotLight2.lookAt(_BASECROOD); 

	}

	function createSVGGemo(svgString, options) {
		var shape = transformSVGPathExposed(svgString);
		var defaultOptions = {
            amount: 5,
            bevelThickness: 0,
            bevelSize: 0,
            bevelSegments: 12,
            bevelEnabled: false,
            curveSegments: 80,
            steps: 1
        };
        var svgGemo;

        options = $.extend({}, defaultOptions, options);
		svgGemo = new THREE.ExtrudeGeometry(shape, options)
        svgGemo.center();	
        return svgGemo;
	}

	function buildProductLogo() {
		var logoMaterial = new THREE.MeshPhongMaterial({color: 0x0cbbef});
		var group = new THREE.Group();
		var len = selectCfg.products.length;
		var angelStep = Math.PI * 2 / len;
		var Radius = 80;
		var y = 31;
		var x;
		var z;

		selectCfg.products.forEach(function(product, i) {
			var gemo = createSVGGemo(product.svgString);
			var mesh = new THREE.Mesh(gemo, logoMaterial.clone());
			
			x = Radius * Math.cos(angelStep * i);
			z = Radius * Math.sin(angelStep * i);

			_products[product.name] = mesh;
			mesh.scale.set(0.2, 0.2, 0.2);
			mesh.position.set(x, y, z);
			mesh.rotation.x = Math.PI / 2;
			mesh.rotation.z = Math.PI / 2 + angelStep * i;
			group.add(mesh);
		});

		that.objects.products = group;
	}

});

module.exports = SelectCube;




