var Stage = require('./stage.js');

var DisplayContainer = Stage.extend(function() {
	this.isInit = false;

	var _rotateTick;

	// this.objects
	this.init = function() {
		this.build();
        this.isInit = true;
	}

	this.build = function() {
		// 创建圆
		// var geometry = new THREE.SphereGeometry( 100, 10, 5 );
		var geometry = new THREE.BoxGeometry(200, 200, 200, 6, 6, 6)

		//console.log(geometry);
		var random;
		var tetrahedronGroup = new THREE.Group();

		var createTetrahedron = (function() {

			var colors = [0x2dcaa6, 0x316182,0x79ccd2, 0x254658, 0x98bfc4];
			var color;
			var tetrahedron;
			var material;

			return function(radius, detail) {
				color = colors[~~(Math.random()*colors.length)];
				// color = 0x2abcde;
				material = new THREE.MeshLambertMaterial({
					'color': color,
					transparent: true,
					opacity: 0.8
				});
				tetrahedron = new THREE.Mesh(
					new THREE.TetrahedronGeometry(radius, detail),
					material
				);
				return tetrahedron;
			}		
		})();

		var tetrahedron;
		geometry.vertices.forEach(function(vertice) {
			tetrahedron = createTetrahedron(3 * Math.random()|0, 0);
			tetrahedron.position.copy(vertice);
			tetrahedron.position.x += Math.random() * 10;
			tetrahedron.position.y += Math.random() * 10;
			tetrahedron.position.z += Math.random() * 10;
			tetrahedron.rotation = new THREE.Euler(
                Math.PI * 2 * Math.random(),
                Math.PI * 2 * Math.random(),
                0,
                'XYZ'
            );
            tetrahedron.rr = 0.5 - Math.random();
            tetrahedron.rr *= 0.05;
			tetrahedronGroup.add(tetrahedron);

		});
		this.objects.tetrahedronGroup = tetrahedronGroup;
		//console.log(tetrahedronGroup);



		var material = new THREE.MeshPhongMaterial( {color: 0xeeeeee,side: THREE.BackSide, /*wireframe: true*/} );
		var basicMaterial = new THREE.MeshBasicMaterial({color: 0x333333, /*wireframe: true*/});
		var sphere = new THREE.SceneUtils.createMultiMaterialObject(geometry, [basicMaterial, material]);
		sphere.name = this.name + ' sphere';
		//this.objects.sphere = sphere;
		//console.log(sphere);

		// 光
		//this.objects.spotLight = new THREE.SpotLight(0xffffff);


		// point light
		var pointLight = new THREE.PointLight(0xffffff);
		pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.set(0,0,0);
		pointLight.intensity = 0.6;
		this.objects.pointLight = pointLight;

        var ambiColor = "#111111";
        ambientLight = new THREE.AmbientLight(ambiColor);
        this.objects.ambientLight = ambientLight;

		// 
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
        //directionalLight.target = this.objects.sphere;


        this.objects.directionalLight = directionalLight;

        var directionalLight2 = new THREE.DirectionalLight(directionalLightColor);
        directionalLight2.position.set(30, 50, 50);
        this.objects.directionalLight2 = directionalLight2;
	}

	this.entry = function() {
		// 添加到场景
		// M3.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));

		// 圆旋转动画
		_rotateTick = this.addTick(function() {
			this.objects.tetrahedronGroup.rotation.x += 0.0005;
			this.objects.tetrahedronGroup.rotation.y += 0.0005;
			this.objects.tetrahedronGroup.rotation.z += 0.0005;
			this.objects.tetrahedronGroup.children.forEach(function(mesh) {
				mesh.rotation.x += mesh.rr;
				mesh.rotation.y += mesh.rr;
				mesh.rotation.z += mesh.rr;
			});
			//this.objects.sphere.rotation.x += 0.0005;
			//this.objects.sphere.rotation.y += 0.0005;
			//this.objects.sphere.rotation.z += 0.0005;
		}.bind(this));
	}	

	this.leave = function() {
		// or return a promise so that can do some ani
		this.removeTick(_rotateTick); 
	}
});

module.exports = DisplayContainer;