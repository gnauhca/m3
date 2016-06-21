var View = require('./view.js');
var Loader = require('./loader.js');
var loader = new Loader();

var ViewList = View.extend(function() {
	var that = this;
	var renderer; // render 外部提供
	var scene; // 场景 外部提供
	var camera; // 自身创建 camera
	var assetsLoaded = false; // 资源是否已加载
	var productCfg = []; // 产品配置信息 from config.products

	var col = 4; // 一列展示的产品数量
	var initCrood = new THREE.Vector3(0, 0, -10); // 初始坐标
	var baseCrood = new THREE.Vector3(0, 0, 0); // 基准坐标，产品陈列中心点

	var spriteBox = new THREE.Object3D(); // 精灵容器

	var isActive = false;

	this.viewDisPlayManagerId; // 展示视图的ID

	this.constructor = function(_renderer, _scene) {
		renderer = _renderer;
		scene = _scene;
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

		productCfg = $.extend(true, [], CONFIG.products);
		//productCfg.length = 1;
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

		// 精灵创建
		if (!productCfg[0].sprite) {
			createSprite();
		}

		// window render 设置
		resetWindow();

		// 精灵动画
		initAni();

		// render frame
		render();

	}

	// 窗口变化调整
	function resetWindow() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		renderer.setSize(winWidth, winHeight);
		camera.position.set(0, 0, 50);
		camera.lookAt(baseCrood);
		scene.add(camera);

        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(300, 300, 300);
        spotLight.intensity = 1;
        scene.add(spotLight);


	}

	// 创建精灵
	function createSprite() {
		var spriteSize = 3;
		var spriteMargin = 1;

		var row = Math.ceil(productCfg.length / col);
		var center = {row: row/2 - 0.5, col: col/2 - 0.5};

		productCfg.forEach(function(cfg, i) {
	        var spriteMaterial = new THREE.SpriteMaterial({
                opacity: 1,
                color: 0xaaaaaa,
                transparent: true,
                map: new THREE.ImageUtils.loadTexture(cfg.imgUrl)
            });

	        //spriteMaterial.depthTest = false;
	        //spriteMaterial.blending = THREE.AdditiveBlending;

	        var sprite = new THREE.Sprite(spriteMaterial);
	        cfg.sprite = sprite;// 存入config


	        // 精灵最终位置大小信息
	        cfg.sizeInfo = {
	        	x: (i % col - center.col) * (spriteSize + spriteMargin),
	        	y: (Math.floor(i / col) - center.row) * (spriteSize + spriteMargin),
	        	z: baseCrood.z,
	        	s: spriteSize // 精灵大小
	        }
	        console.log(cfg.sizeInfo);
	        cfg.sprite.position.copy(initCrood);
	        cfg.sprite.scale.set(0, 0, 0);

	        //cfg.sprite.position.set(cfg.sizeInfo.x, cfg.sizeInfo.y, cfg.sizeInfo.z);
	        //cfg.sprite.scale.set(1, 1, 1);

	        spriteBox.add(sprite);
		});
		scene.add(spriteBox);
	}

	// init Animate 初始动画
	function initAni() {
		var aniCfg = $.extend(true, [], productCfg);
		var circle = 1; // 旋转圈数
		var timePass = 0; 

		aniCfg.forEach(function(cfg, i) {
			cfg.percent = 0; 
			cfg.finalAngle = Math.PI * 2 * circle + Math.atan(cfg.sizeInfo.x / (baseCrood.z - initCrood.z));
			cfg.aniRadius = Math.sqrt(cfg.sizeInfo.x * cfg.sizeInfo.x + (baseCrood.z - initCrood.z) * (baseCrood.z - initCrood.z));
			cfg.delay = i * 0.3 * Math.random();
			cfg.aniDur = 2000 + parseInt(Math.random() * 1000); 
		});


		var currentAngle;
		var finishNum = 0;

		var aniTick = that.addTick(function(detal) {
			timePass += detal;

			// 遍历更新精灵位置
			aniCfg.forEach(function(cfg) {
				if (cfg.percent === 1) return;

				cfg.percent = (timePass - cfg.delay) / cfg.aniDur;
				cfg.percent = cfg.percent < 0 ? 0 : (cfg.percent > 1 ? 1: cfg.percent);
				currentAngle = cfg.finalAngle * cfg.percent;

				cfg.x = Math.sin(currentAngle) * cfg.aniRadius * cfg.percent;
				cfg.z = Math.cos(currentAngle) * cfg.aniRadius * cfg.percent + initCrood.z;
				cfg.y = (cfg.sizeInfo.y - initCrood.y) * cfg.percent;

				cfg.s = cfg.sizeInfo.s * cfg.percent;

				cfg.sprite.position.set(cfg.x, cfg.y, cfg.z);
				cfg.sprite.scale.set(cfg.s, cfg.s, cfg.s);
				console.log(cfg.sprite.position);

				if (cfg.percent === 1) {
					finishNum ++;
				}
			});

			if (finishNum === aniCfg.length) {
				// 初始动画完成
				this.isActive = true;
				setTimeout(function() {
					that.removeTick(aniTick);
				}, 0);
			}
		});	
	}

	// 加载资源
	function loadAssets() {
		var loadConfigs = [];

		productCfg.forEach(function(item, i) {
			loadConfigs[i] = {};
			loadConfigs[i].type = 'img';
			loadConfigs[i].url = item.imgUrl;
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