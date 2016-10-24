// Dependencies CONFIG.mobiles

import Time from 'time.js';
import Loader from 'loader.js';
var loader = new Loader();
var mobileEnvMap;
var JSONLoader = new THREE.JSONLoader();



class Mobile extends Time {

	constructor(mobileName) { 
		super();

		this.mesh; // group
		this.size; // 资源大小

		this._modelConfigs;

		this._materials;
		this._colors = [];
		this._currentColor;
		this._uuidMaterialNameMap = {};
		this._texturePath = './assets/texture/';
		CONFIG.mobiles.forEach(function(mobile) {
			if (mobile.name === mobileName) {
				this._modelConfigs = mobile;
			}
		});
		this.size = loader.calculateSize(this._modelConfigs);
	}

	getColors() {
		return this._colors;
	}

	changeColor(color) {
		if (this._currentColor === color) return;
		if (this._colors.indexOf(color) < 0) {
			console.log('No this color');
			return;
		}

		this.mesh.children.forEach(function(child) {
			var materialName = this._uuidMaterialNameMap[uuid];

			this._materials[color].forEach(function(material) {
				if (material.name.replace(/\d*$/, '') === materialName.replace(/\d*$/, '')) {
					child.material = material;
					child.material.needsUpdate = true;
				}				
			});
		});
	}

	load(onProgress) {
		var materials;
		var group = new THREE.Group();
		var loadPromise = loader.load(this._modelConfigs, onProgress);

		return loadPromise.then(function(modelRes) {
			return new Promise(function(resolve) {
				this._materials = modelRes.materials;
				for (var color in this._materials) {
					this._colors.push(color);
					this._currentColor = this._colors[0];
					this._materials[color] = this._JSONLoaderParse(this._materials[color]).materials;
				}

				modelRes.models.forEach(function(modelJson) {
					var mParse = this._JSONLoaderParse(modelJson);
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

					this._uuidMaterialNameMap[model.uuid] = mParse.materials[0].name;
					group.add(model);
				});
				that.mesh = group;
				resolve();
			});
		}).catch(function(e) { console.error(e.stack); });
	}

	_JSONLoaderParse(json) {

		if (typeof json === 'string') {
			json = JSON.parse(json);
		}
		// change path
		json.materials.forEach(function(material) {
			if (material.mapDiffuse) {
				material.mapDiffuse = this._texturePath + material.mapDiffuse;
			}
		});
		return JSONLoader.parse(json, location.pathname.replace(/[^\/]+$/, ''));
	}
}

export default Mobile;