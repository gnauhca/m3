var View = require('./view.js');
var Loader = require('./loader.js');
var LogoAni = require('./logo-animation.js');
var ProductPreview = require('./product-preview.js');
var loader = new Loader();

var ViewList = View.extend(function() {
	var that = this;
	var renderer; // render 外部提供
	var scene; // 场景 外部提供
	var camera; // 自身创建 camera
	var assetsLoaded = false; // 资源是否已加载
	var isActive = false;

	var productCfg = []; // 产品配置信息 from config.products
	var col = 4; // 一列展示的产品数量
	var initCrood = new THREE.Vector3(0, 0, -10); // 初始坐标
	var baseCrood = new THREE.Vector3(0, 0, 0); // 基准坐标，产品陈列中心点

	var logoUrl = CONFIG.meizulogo;
	var logoAni;

	var spriteBox = new THREE.Object3D(); // 精灵容器

	this.viewDisPlayManagerId; // 展示视图的ID

	this.constructor = function(_renderer, _scene) {
		renderer = _renderer;
		scene = _scene;
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

		productCfg = $.extend(true, [], CONFIG.products);
		//productCfg.length = 1;
		
		logoAni = new LogoAni(scene);
		productPreview = new ProductPreview();

		this.super();
	}

	this.destory = function() {

	}

	// 切换其他视图使当前视图 inactive
	this.inActivate = function() {
		isActive = false;
		this.removeTick(); // 移除全部tick 
	}

	// 激活当前视图， data 激活附带参数
	this.activate = function(data) {

		// 下载资源
		if (!assetsLoaded) {
			loadAssets();
			return;
		}

		// window render 设置
		resetWindow();

		// 精灵动画
		init();

		// render frame
		render();

	}

	function init() {
		resetWindow();
		logoAni.playEntryAnimation(function() {
			that.gotoView(productPreview.getViewId());
		});
	}

	// 窗口变化调整
	function resetWindow() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		renderer.setSize(winWidth, winHeight);
		camera.position.set(0, 0, 250);
		camera.lookAt(baseCrood);
		scene.add(camera);

		logoAni.reset();
		productPreview.reset();
	}


	// 加载资源
	function loadAssets() {
		var loadConfigs = [];

		productCfg.forEach(function(item, i) {
			loadConfigs[i] = {};
			loadConfigs[i].type = 'img';
			loadConfigs[i].url = item.imgUrl;
		});

		loadConfigs.push({
			type: 'img',
			url: logoUrl
		});

		loader.load(loadConfigs, function(progress) {
			// 进度显示	
		}, function(res) {
			// 成功回调	
			assetsLoaded = true;
			if (!that.isActive) {
				that.activate();
			}
		});
	}	

	// render 
	function render() {
		var renderTick = that.addTick(function() {
			renderer.render(scene, camera);
		});
	}

});


module.exports = ViewList;