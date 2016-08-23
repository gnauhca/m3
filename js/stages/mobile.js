var Loader = require('./loader');
var loader = new Loader();
var mobileEnvMap;


var JSONLoader = new THREE.JSONLoader();


var Mobile = Time.extend(function() {

	this.mesh; // group
	this.size; // 资源大小

	var _modelConfigs;

	var _materials;
	var _colors = [];

	var _currentColor;

	var _uuidMaterialNameMap = {};

	this.constructor = function(mobileName) {
		this.super();
		CONFIG.mobiles.forEach(function(mobile) {
			if (mobile.name === mobileName) {
				_modelConfigs = mobile;
			}
		});
		this.size = loader.calculateSize(mobile);
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

		loadPromise.then(function(modelRes) {
			_materials = modelRes.materials;

			for (var color in _materials) {
				_colors.push(color);
				_currentColor = _colors[0];
				_materials[color] = JSONLoader.parse(_materials[color]).materials;
			}

			modelRes.models.forEach(function(modelJson) {
				var mParse = JSONLoader.parse(modelJson);
				var model = new THREE.Mesh(mParse.geometry, mParse.materials[0]);

				_uuidMaterialNameMap[model.uuid] = mParse.materials[0].name;

				group.add(model);
			});
			this.mesh = group;
		}).catch(function(e) { console.log(e.stack); });
		return loadPromise;
	}



});