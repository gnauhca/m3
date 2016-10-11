var Stage = require('./stage.js');
var selectCfg = require('select-conf.js');

// Dependencies CONFIG.selects
var SelectCube = Stage.extend(function() {
	this.isInit = false;
	this.objects;

	var that = this;
	var _BASECROOD = new THREE.Vector3(0, 0, 0);
	var _CAMERACROOD = new THREE.Vector3(00, 400, 300);

	var _products = {}; // {'pro5': {mesh: xx, glowMesh, selected: false}}

	var _t;
	var _controls;

	// shader
	var _glowMaterial;

	// this.objects
	this.init = function() {
		_glowMaterial = new THREE.ShaderMaterial({
		    uniforms: {
		        "c": { type: "f", value: 0.2 },
		        "p": { type: "f", value: 1.9},
		        glowColor: { type: "c", value: new THREE.Color(0xffffff) },
		        viewVector: { type: "v3", value: this.camera.position }
		    },
		    vertexShader: document.getElementById('glowVertexShader').textContent,
		    fragmentShader: document.getElementById('glowFragmentShader').textContent,
		    side: THREE.FrontSide,
		    blending: THREE.AdditiveBlending,
		    transparent: true
		});

		buildBase();
		buildProductLogo(); //set products

		_controls = new THREE.OrbitControls(this.camera, M3.renderer.domElement);


        this.isInit = true;




	}


	this.entry = function() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		this.camera.position.copy(_CAMERACROOD);
		this.camera.lookAt(_BASECROOD);

		_t = this.addTick(function(delta) {
			_controls.update(delta);

			var glowMesh;

			for (var productName in _products) {
				glowMesh = _products[productName].glowMesh
				glowMesh.material.uniforms.viewVector.value = 
					new THREE.Vector3().subVectors(that.camera.position, glowMesh.position);
			}

			that.objects.glowSvgMesh.material.uniforms.viewVector.value = 
					new THREE.Vector3().subVectors(that.camera.position, that.objects.glowSvgMesh.position);
		});

		// shader test 
		var gui = new dat.GUI();
		var parameters = { c: 0.5, p: 4.0 };
		var cGUI = gui.add( parameters, 'c' ).min(0.0).max(1.0).step(0.01).name("c").listen();
		cGUI.onChange(
		    function(value) { 
				setPandC(parameters.p, parameters.c); 
		    }
		);

		var pGUI = gui.add(parameters, 'p').min(0.0).max(6.0).step(0.01).name("p").listen();
		pGUI.onChange(
		    function(value) { 
				setPandC(parameters.p, parameters.c);
		    }
		);

		function setPandC(p, c) {
			M3.scene.traverse(function(object) {
				if (object.material && object.material instanceof THREE.ShaderMaterial) {
					object.material.uniforms["p"].value = p; 
					object.material.uniforms["c"].value = c; 
				}
			});
		}

	}


	this.selectProduct = function(productNames) {
		_products.forEach(function(_product) {

		});
	}

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}

	function addColorTween(Material, color) {
		var init = 0;
	}

	function buildBase() {

		// table 2m width
		var tableTopGemo = new THREE.CylinderGeometry(100, 100, 3, 100);
		var tableTopMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaff});

		tableTopMaterial.transparent = true;
		tableTopMaterial.opacity = 0.3;
		tableTopMaterial.refractionRatio = 1.3;
		// tableTopMaterial.reflectivity = 1;
		tableTopMaterial.shininess = 37.46;
		tableTopMaterial.specular = new THREE.Color("rgb(0.54, 0.54, 0.54)");

		var tableTop = new THREE.Mesh(tableTopGemo, tableTopMaterial);
		tableTop.position.set(0, 35, 0);

		var tableBottomGemo = new THREE.CylinderGeometry(100, 90, 30, 100, 10);
		var tableBottomMaterial = new THREE.MeshLambertMaterial({color: 0x3a5c67,'side': THREE.DoubleSide, 'emissive': 0x888888}); 
		var tableBottom = new THREE.Mesh(tableBottomGemo, tableBottomMaterial);
		tableBottom.position.set(0, 15, 0);

		that.objects.tableTop = tableTop;
		that.objects.tableBottom = tableBottom;


		var tableGlowGemo = new THREE.CylinderGeometry(95.1, 95, 2, 100, 10);
		var tableGlow = new THREE.Mesh(tableGlowGemo, _glowMaterial.clone());
		tableGlow.position.set(0, 15, 0);

		that.objects.tableTop = tableTop;
		that.objects.tableBottom = tableBottom;
		that.objects.tableGlow = tableGlow;



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
        // that.objects.svgLogo = svgMesh;


        var glowSvgMesh = new THREE.Mesh(svgGemo.clone(), _glowMaterial.clone());
		glowSvgMesh.position.copy(svgMesh.position);
		glowSvgMesh.scale.multiplyScalar(1.2);
		that.objects.glowSvgMesh = glowSvgMesh;

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
		var logoMaterial = new THREE.MeshPhongMaterial({color: 0xdddddd});
		var group = new THREE.Group();
		var len = selectCfg.products.length;
		var angelStep = Math.PI * 2 / len;
		var Radius = 80;
		var y = 32;
		var x;
		var z;

		var svgOption = {
            amount: 1,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 12,
            bevelEnabled: false,
            curveSegments: 80,
            steps: 1
        };



		selectCfg.products.forEach(function(product, i) {
			var gemo = createSVGGemo(product.svgString, svgOption);
			var mesh = new THREE.Mesh(gemo, logoMaterial.clone());
			
			var glowMesh = new THREE.Mesh(gemo.clone(), _glowMaterial.clone());


			x = Radius * Math.cos(angelStep * i);
			z = Radius * Math.sin(angelStep * i);

			_products[product.name] = {'mesh': mesh, 'glowMesh': glowMesh, 'selected':false};

			mesh.scale.set(0.1, 0.1, 0.1);
			mesh.position.set(x, y, z);
			mesh.rotation.x = Math.PI / 2;
			mesh.rotation.z = Math.PI / 2 + angelStep * i;

			glowMesh.scale.set(0.1, 0.1, 0.1).multiplyScalar(1.2);;
			glowMesh.position.set(x, y, z);
			glowMesh.rotation.x = Math.PI / 2;
			glowMesh.rotation.z = Math.PI / 2 + angelStep * i;

			// group.add(glowMesh);
			group.add(mesh);
		});

		that.objects.products = group;
	}

});

module.exports = SelectCube;




