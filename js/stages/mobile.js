// Dependencies CONFIG.mobiles

var Time = require('time.js');
var Loader = require('loader.js');
var loader = new Loader();
var mobileEnvMap;



var Mobile = Time.extend(function() {
	var that = this;

	this.mesh; // group
	this.size; // 资源大小

	var _modelConfigs;

	var _materials;
	var _colors = [];
	var _currentColor;
	var _uuidMaterialNameMap = {};
	var _texturePath = './assets/texture/';
	var JSONLoader = new THREE.JSONLoader();

	this.constructor = function(mobileName) { 
		this.super();
		CONFIG.mobiles.forEach(function(mobile) {
			if (mobile.name === mobileName) {
				_modelConfigs = mobile;
			}
		});
		this.size = loader.calculateSize(_modelConfigs);
	}

	this.getColors = function() {
		return _colors;
	}

	this.changeColor = function(color) {
		if (_currentColor === color) return;
		if (_colors.indexOf(color) < 0) {
			console.log('No this color');
			return;
		}

		this.mesh.children.forEach(function(child) {
			var materialName = _uuidMaterialNameMap[uuid];

			_materials[color].forEach(function(material) {
				if (material.name.replace(/\d*$/, '') === materialName.replace(/\d*$/, '')) {
					child.material = material;
					child.material.needsUpdate = true;
				}				
			});
		});
	}

	this.load = function(onProgress) {
		var materials;
		var group = new THREE.Group();
		var loadPromise = loader.load(_modelConfigs, onProgress);

		return loadPromise.then(function(modelRes) {
			return new Promise(function(resolve) {
				_materials = modelRes.materials;
				for (var color in _materials) {
					_colors.push(color);
					_currentColor = _colors[0];
					_materials[color] = JSONLoaderParse(_materials[color]).materials;
				}

				modelRes.models.forEach(function(modelJson) {
					var mParse = JSONLoaderParse(modelJson);
					var geometry = mParse.geometry;
					var material = mParse.materials[0];
					var model;

					if (material.name.indexOf('metal') >= 0) {
						var texture = new THREE.ImageUtils.loadTexture('./assets/pro5/metal.jpg');
						texture.repeat.set(50,50);
	            		texture.wrapS = THREE.RepeatWrapping;
	            		texture.wrapT = THREE.RepeatWrapping;

						material = new THREE.MeshPhongMaterial({
							map: texture,
							bumpMap: texture,
							bumpScale: 0.1
							// aoMapIntensity: 2
						});

					}

					material.side = THREE.DoubleSide;
					material.transparent = (material.opacity === 1?false:true);
					model = new THREE.Mesh(geometry, material);

					_uuidMaterialNameMap[model.uuid] = mParse.materials[0].name;
					group.add(model);
				});
				that.mesh = group;
				resolve();
			});
		}).catch(function(e) { console.error(e.stack); });
	}

	function JSONLoaderParse(json) {

		if (typeof json === 'string') {
			json = JSON.parse(json);
		}
		// change path
		json.materials.forEach(function(material) {
			if (material.mapDiffuse) {
				material.mapDiffuse = _texturePath + material.mapDiffuse;
			}
		});
		return JSONLoader.parse(json, location.pathname.replace(/[^\/]+$/, ''));
	}
});

module.exports = Mobile;