var Time = require('time.js');
var Loader = require('loader.js');
var loader = new Loader();
var mobileEnvMap;

var JSONLoader = new THREE.JSONLoader();


var Mobile = Time.extend(function() {
	var that = this;

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
			
			_materials = modelRes.materials;
			for (var color in _materials) {
				_colors.push(color);
				_currentColor = _colors[0];
				_materials[color] = JSONLoader.parse(JSON.parse(_materials[color])).materials;
			}

			modelRes.models.forEach(function(modelJson) {
				var mParse = JSONLoader.parse(JSON.parse(modelJson));
				var geometry = mParse.geometry;
				var material = mParse.materials[0];
				var model;

				material.side = THREE.DoubleSide;
				material.transparent = (material.opacity === 1?false:true);
				model = new THREE.Mesh(geometry, material);

				// if (mParse.materials[0].name.indexOf('map') >=0) {
				// 	// console.log(mParse.materials[0]);
				// 	var texture = THREE.ImageUtils.loadTexture('./assets/pro5/pro5uv.png');
				// 	var material = new THREE.MeshBasicMaterial();

				// 	material.map = texture;
				// 	material.side = THREE.DoubleSide;
				// 	material.map.needsUpdate = true;

				// 	model = new THREE.Mesh(mParse.geometry, material);
				// 	//console.log(model);
				// }


				_uuidMaterialNameMap[model.uuid] = mParse.materials[0].name;

				group.add(model);
			});
			that.mesh = group;
			return new Promise(function(r) { r();});
		}).catch(function(e) { console.error(e.stack); });
	}
});

module.exports = Mobile;