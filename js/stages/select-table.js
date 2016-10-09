var Stage = require('./stage.js');

// Dependencies CONFIG.selects
var SelectCube = Stage.extend(function() {
	this.isInit = false;
	this.objects;

	var that = this;
	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(00, 00, 500);

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
		// this.objects.table.add(tableTop);

		var tableBottomGemo = new THREE.CylinderGeometry(100, 90, 30, 100, 10);
		var tableBottomMaterial = new THREE.MeshLambertMaterial({color: 0x3a5c67,'side': THREE.DoubleSide, 'emissive': 0x888888}); 
		var tableBottom = new THREE.Mesh(tableBottomGemo, tableBottomMaterial);
		tableBottom.position.set(0, 15, 0);

		this.objects.table = new THREE.Group();
		// this.objects.table.add(tableBottom);
		//console.log(tableTop.material);

		// meizu logo
		var svgString = "M22.8,41H3c-1.7,0-3,1.4-3,3v15.1h3.6V45.2c0-0.7,0.5-1.2,1.2-1.2h6.3v15.2h3.6V44H21c0.7,0,1.2,0.5,1.2,1.2v13.9h3.5V44C25.8,42.4,24.4,41,22.8,41zM29.6,44v12.1c0,1.7,1.3,3,3,3H48v-2.9H34.3c-0.7,0-1.2-0.5-1.2-1.2v-3.4h14.1v-3H33.1v-3.4c0-0.7,0.5-1.2,1.2-1.2H48V41H32.6C30.9,41,29.6,42.4,29.6,44zM75.3,41H59.4v2.9h13.1L59.9,55.1c-2,1.7-0.7,4,1,4H77v-2.9H63.6L76.2,45C78.3,43.1,77,41,75.3,41zM96.5,41v13.9c0,0.7-0.5,1.2-1.2,1.2l0,0H85.1l0,0c-0.7,0-1.2-0.5-1.2-1.2V41h-3.5v15.1c0,1.7,1.3,3,3,3H97c1.7,0,3-1.3,3-3V41H96.5zM51.8 41L55.5 41L55.5 59.1L51.8 59.1z";
		var shape = transformSVGPathExposed(svgString);
		var options = {
            amount: 5,
            bevelThickness: 0.5,
            bevelSize: 0.5,
            bevelSegments: 12,
            bevelEnabled: true,
            curveSegments: 80,
            steps: 1
        };
        var svgGemo = new THREE.ExtrudeGeometry(shape, options)
        var svgMaterial = new THREE.MeshPhongMaterial({color: 0x0cbbef, shininess: 100, metal: true});
        var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
        svgGemo.center();
        svgGemo.rotateX(Math.PI);
        // svgMesh.applyMatrix( new THREE.Matrix4().makeTranslation(-50, -50, 0) );
        // svgMesh.position.set(0, 0, 0);
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