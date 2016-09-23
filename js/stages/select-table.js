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
		// this.objects.table.add(tableTop);

		var tableBottomGemo = new THREE.CylinderGeometry(100, 90, 30, 100, 10);
		var tableBottomMaterial = new THREE.MeshLambertMaterial({color: 0x3a5c67,'side': THREE.DoubleSide, 'emissive': 0x888888}); 
		var tableBottom = new THREE.Mesh(tableBottomGemo, tableBottomMaterial);
		tableBottom.position.set(0, 15, 0);

		this.objects.table = new THREE.Group();
		// this.objects.table.add(tableBottom);
		//console.log(tableTop.material);

		// meizu logo
		var svgString = "M106.9,0H14.2C6.4,0,0,6.4,0,14.2v70.9h16.7V19.6c0-3.1,2.5-5.7,5.7-5.7h29.8v71.2h16.7V13.9h29.8c3.1,0,5.7,2.5,5.7,5.7v65.5H121V14.2C121,6.4,114.7,0,106.9,0zM138.8,14.2v56.7c0,7.8,6.3,14.2,14.2,14.2h72.3V71.3h-64.1c-3.1,0-5.7-2.5-5.7-5.7V49.5h66.3V35.6h-66.3V19.5c0-3.1,2.5-5.7,5.7-5.7h64.1V0H153C145.1,0,138.8,6.4,138.8,14.2zM243.2,0L260.7,0L260.7,85,L243.2,85zM353.6,0H279v13.8h61.7l-59.2,52.6c-9.5,8.1-3.3,18.6,4.6,18.6h75.4V71.2h-62.9l59.3-52.6C367.5,10,361.8,0,353.6,0zM453,0v65.5c0,3.1-2.5,5.7-5.7,5.7l0,0h-47.6l0,0c-3.1,0-5.7-2.5-5.7-5.7V0h-16.6v70.9c0,7.8,6.3,14.2,14.2,14.2h63.8c7.8,0,14.2-6.3,14.2-14.2V0H453z";
		var shape = transformSVGPathExposed(svgString);
		var options = {
            amount: 10,
            bevelThickness: 3,
            bevelSize: 02,
            bevelSegments: 12,
            bevelEnabled: true,
            curveSegments: 80,
            steps: 1
        };
        var svgGemo = new THREE.ExtrudeGeometry(shape, options)
        var svgMaterial = new THREE.MeshPhongMaterial({color: 0x0cbbef, shininess: 100, metal: true});
        var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
        svgMesh.scale.set(1, 1, 1);
        svgMesh.position.set(-330, 0, 0);
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