var Stage = require('./stage.js');

// Dependencies CONFIG.selects
var SelectCube = Stage.extend(function() {
	this.isInit = false;
	this.objects;

	var that = this;
	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(200, 200, 300);

	// this.objects
	this.init = function() {
		this.build();
        this.isInit = true;
	}

	this.build = function() {

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

		this.objects.table = new THREE.Group();
		this.objects.table.add(tableTop);
		this.objects.table.add(tableBottom);
		//console.log(tableTop.material);

		// meizu logo
		var svgString = 'M120.9,269.9H28.2c-7.8,0-14.2,6.4-14.2,14.2V355h16.7v-65.5c0-3.1,2.5-5.7,5.7-5.7h29.8V355h16.7v-71.2h29.8c3.1,0,5.7,2.5,5.7,5.7V355H135v-70.9C135,276.3,128.7,269.9,120.9,269.9z';
		var shape = transformSVGPathExposed(svgString);
		var options = {
            amount: 10,
            bevelThickness: 2,
            bevelSize: 02,
            bevelSegments: 4,
            bevelEnabled: true,
            curveSegments: 20,
            steps: 1
        };
        var svgGemo = new THREE.ExtrudeGeometry(shape, options)
        var svgMaterial = new THREE.MeshPhongMaterial({color: 0x3a5c67, shininess: 100, metal: true});
        var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
        svgMesh.position.set(-200, 240, -200);
        svgMesh.scale.set(01,01,01);
        svgMesh.rotation.x = Math.PI
        //console.log(svgMesh);
        M3.scene.add(svgMesh);
        this.objects.svgLogo = svgMesh;

		// plane
		var planeGridCount = 50;
		var planeWidth = planeGridCount * 20;
		var planeHeight = planeGridCount * 20;
		var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
		var material = new THREE.MeshPhongMaterial( {color: 0x3a5c67, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( phaneGeom, material );
		plane.rotation.x = Math.PI * 0.5;
		// this.objects.plane = plane;

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
 		this.objects.spotLight2.position.set(100, 200, -100);
 		this.objects.spotLight2.lookAt(_BASECROOD); 

		_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	}

	this.entry = function() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		this.camera.position.copy(_CAMERACROOD);
		this.camera.lookAt(_BASECROOD);
	}


	this.selectProduct = function(productNames) {

	}

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}

});

module.exports = SelectCube;