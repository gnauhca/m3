import Stage from './stage.js';
import selectCfg from 'select-conf.js';

// Dependencies CONFIG.selects
class SelectTable extends Stage {

	constructor() {
		super();
		this.isInit = false;
		this.objects;

		this._BASECROOD = new THREE.Vector3(0, 0, 0);
		this._CAMERACROOD = new THREE.Vector3(0, 100, 400);

		this._products = {}; // {'pro5': {mesh: xx, glowMesh, selected: false}}

		this._t;
		this._controls;

		// shader
		this._glowMaterial;
	}

	// this.objects
	init() {
		this._glowMaterial = new THREE.ShaderMaterial({
		    uniforms: {
		        "c": { type: "f", value: 0.79 },
		        "p": { type: "f", value:1.2},
		        glowColor: { type: "c", value: new THREE.Color(0xffffff) },
		        viewVector: { type: "v3", value: this.camera.position }
		    },
		    vertexShader: document.getElementById('glowVertexShader').textContent,
		    fragmentShader: document.getElementById('glowFragmentShader').textContent,
		    side: THREE.FrontSide,
		    blending: THREE.AdditiveBlending,
		    transparent: true
		});

		this._buildBase();
		this._buildProductLogo(); //set products

		this._controls = new THREE.OrbitControls(this.camera, M3.renderer.domElement);


        this.isInit = true;
	}


	entry() {
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		this.camera.position.copy(this._CAMERACROOD);
		this.camera.lookAt(this._BASECROOD);

		this._t = this.addTick(function(delta) {
			this._controls.update(delta);
			
			var glowMesh;

			M3.scene.traverse(function(object) {
				if (object.material && object.material instanceof THREE.ShaderMaterial) {
					object.material.uniforms.viewVector.value = 
					new THREE.Vector3().subVectors(this.camera.position, object.position);
				}
			}.bind(this));
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


	selectProduct(productNames) {
		this._products.forEach(function(_product) {

		});
	}

	leave() {
		// or return a promise so that can do some ani
		this.removeTick(); 
	}

	_createSVGGemo(svgString, options) {
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

	_buildBase() {

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
		tableTop.position.set(0, 33, 0);


		var tableBottomGemo = new THREE.CylinderGeometry(100, 90, 30, 100, 10);
		var tableBottomMaterial = new THREE.MeshLambertMaterial({color: 0x3a5c67,'side': THREE.DoubleSide, 'emissive': 0x888888}); 
		var tableBottom = new THREE.Mesh(tableBottomGemo, tableBottomMaterial);
		tableBottom.position.set(0, 15, 0);

		this.objects.tableTop = tableTop;
		this.objects.tableBottom = tableBottom;


		var tableGlowGemo = new THREE.CylinderGeometry(95.1, 95, 2, 100, 10);
		var tableGlow = new THREE.Mesh(tableGlowGemo, this._glowMaterial);
		tableGlow.position.set(0, 15, 0);

		this.objects.tableTop = tableTop;
		this.objects.tableBottom = tableBottom;
		this.objects.tableGlow = tableGlow;

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
        var svgGemo = this._createSVGGemo(svgString, options);
        svgGemo.computeBoundingBox()
        svgGemo.translate(0, -svgGemo.boundingBox.max.y, 0);
        svgGemo.rotateX(Math.PI);

        var svgMaterial = new THREE.MeshPhongMaterial({color: 0x0cbbef, shininess: 100, metal: true});
        var svgMesh = new THREE.Mesh(svgGemo, svgMaterial);
        svgMesh.position.set(0, 0, 150);
        // this.objects.svgLogo = svgMesh;


        var glowSvgMesh = new THREE.Mesh(svgGemo.clone(), this._glowMaterial);
		glowSvgMesh.position.copy(svgMesh.position);
		glowSvgMesh.scale.multiplyScalar(1.1);
		this.objects.glowSvgMesh = glowSvgMesh;

		// plane
		var planeGridCount = 100;
		var planeWidth = planeGridCount * 20;
		var planeHeight = planeGridCount * 20;
		var phaneGeom = new THREE.PlaneGeometry(planeWidth, planeHeight, planeGridCount, planeGridCount);
		// var material = new THREE.MeshPhongMaterial( {color: 0x3a5c67, side: THREE.DoubleSide} );
		var material = new THREE.MeshBasicMaterial( {color: 0x3a5c67, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( phaneGeom, material );
		plane.rotation.x = Math.PI * 0.5;
		this.objects.plane = plane;


		// grid 
		var gridGroup = new THREE.Group();
		var gridMesh;


		/*for (let i = 0; i < 100; i++) {
			gridMesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1), new MeshPhongMaterial({color: 0xffffff}));
		}*/


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
        directionalLight.target.lookAt(this._BASECROOD); 
        //this.objects.directionalLight = directionalLight;

 		this.objects.spotLight = new THREE.SpotLight(0xffffff);
 		this.objects.spotLight.intensity = 0.8;
 		this.objects.spotLight.position.set(-300, 200, 100);
 		this.objects.spotLight.lookAt(this._BASECROOD); 

 		this.objects.spotLight2 = new THREE.SpotLight(0xffffff);
 		this.objects.spotLight2.intensity = 0.5;
 		this.objects.spotLight2.position.set(100, 200, -100);
 		this.objects.spotLight2.lookAt(this._BASECROOD); 
	}

	_buildProductLogo() {
		var logoMaterial = new THREE.MeshPhongMaterial({color: 0x999999});
		var group = new THREE.Group();
		var len = selectCfg.products.length;
		var angelStep = Math.PI * 2 / len;
		var Radius = 90;
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
			var gemo = this._createSVGGemo(product.svgString, svgOption);
			var mesh = new THREE.Mesh(gemo, logoMaterial/*.clone()*/);
			
			var glowMesh = new THREE.Mesh(gemo.clone(), this._glowMaterial.clone());


			x = Radius * Math.cos(angelStep * i);
			z = Radius * Math.sin(angelStep * i);

			this._products[product.name] = {'mesh': mesh, 'glowMesh': glowMesh, 'selected':false};

			mesh.scale.set(0.15, 0.15, 0.15);
			mesh.position.set(x, y, z);
			mesh.rotation.x = Math.PI / 2;
			mesh.rotation.z = Math.PI / 2 + angelStep * i;

			glowMesh.scale.set(0.15, 0.15, 0.15).multiplyScalar(1.2);;
			glowMesh.position.set(x, y, z);
			glowMesh.rotation.x = Math.PI / 2;
			glowMesh.rotation.z = Math.PI / 2 + angelStep * i;

			// group.add(glowMesh);
			group.add(mesh);


			if (i === 0) {
				// mesh.material.color.set(0xffffff);
				// mesh.material.emissive.set(0xeeeeee);

				this.addTHREEObjTween(mesh.material, {color: new THREE.Color(0x0cbbef), emissive: new THREE.Color(0xcccccc)}, 3000).start();

				this.addTHREEObjTween(this.objects.glowSvgMesh.material, {
					uniforms_c_value: 0.46,
					uniforms_p_value: 0.2,
					uniforms_glowColor_value: new THREE.Color(0x59c0de)
				}, 4000).start();

			}

		}.bind(this));

		this.objects.products = group;
	}

}

export default SelectTable;




