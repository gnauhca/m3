var View = require('./view.js');
var Loader = require('./loader.js');
var loader = new Loader();

var models = {};

var DisplayWindow = View.extend(function() {
	var that = this;
	var productData;
	var size;
	var sizePX;
	var model;
	var camera;

	this.constructor = function() {
		this.super();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
		M3.scene.add(camera);
	}

	this.activate = function(data) {
		productData = data.productData;
		size = data.size;
		this.changeProduct(productData);
	}

	this.reset = function() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		for (var key in size) {
			sizePX[key] = winWidth * parseInt(size[key])/100;
		}
		sizePX.bottom = sizePX.top + sizePX.height;

		camera.aspect = sizePX[width] / sizePX[height];
		camera.updateProjectionMatrix();
	}

	function changeProduct(productData) {
		that.productData = productData;

		if (!models[productData.name]) {
			loader.load([{type: 'model', 'url': productData.modelUrl}], showProgress, function(res) {	
				model = models[productData.name] = res[0];
			});
		} else {
			scene.remove(model);
			scene.add(model);
		}
		model.position.set(productData.modelPos.x, productData.modelPos.y, productData.modelPos.z);
		model.scale.set(10, 10, 10);
	}

	function showProgress(progress) {

	}

	function render = function() {
		that.addTick(function() {
			M3.renderer.setViewport(sizePX[left], sizePX[bottom], sizePX[width], sizePX[height]);
			M3.renderer.setScissor(sizePX[left], sizePX[bottom], sizePX[width], sizePX[height]);
			M3.renderer.setScissorTest(true);
			M3.renderer.setClearColor(0x000);

			camera.updateProjectionMatrix();
			M3.renderer.render( scene, camera );			
		});

	}

});

modules.exports = DisplayWindow;
