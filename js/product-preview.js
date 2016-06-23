var View = require('./view.js');

var ProductsPreview = View.extend(function() {
	var that = this;

	var $domWrap;

	var gridNumHor;
	var gridNumVer;
	var gridWidthPercent;
	var gridHeightPercent;

	var productDatas = [];
	var itemElems = [];

	var maxSelect = 4; // 最多选择个数

	this.constructor = function() {
		this.super();
		this.init();
	}

	this.init = function() {
		productDatas = $.extend(true, [], CONFIG.products);
		$domWrap = $('#listView');
		create();
		initEvent();
	}

	this.activate = function() {
		$domWrap.show();
		setTimeout(function() {
			$domWrap.addClass('active');
		}, 50);
	}

	this.gotoView = function() {
		$domWrap.addClass('inactive');
	}

	// 重置大小，位置
	this.reset = function() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		var gridWidth = 400;
		var gridHeight = 400;

		gridNumHor = Math.round(winWidth/gridWidth);
		gridNumVer = Math.round(winHeight/gridHeight);

		gridWidthPercent = 100 / (gridNumHor === 0 ? 1 : gridNumHor);
	 	gridHeightPercent = 100 / (gridNumVer === 0 ? 1 : gridNumVer);


		var left;
		var top;
	 	if (itemElems.length) {

	 		for (var i = 0; i < productDatas.length || i < gridNumHor * gridNumVer; i++) {
		 		left = (i % gridNumHor) * gridWidthPercent;
		 		top = Math.floor(i / gridNumHor) * gridHeightPercent;

		 		if (!itemElems[i]) {
		 			itemElems[i] = $('<li data-preview-index="' + i + '"><div></div></li>')[0];
		 			$domWrap.find('ul').append(itemElems[i]);
		 		}

	 			$(itemElems[i]).css({
	 				left: left + '%',
	 				top: top + '%',
	 				width: gridWidthPercent + '%',
	 				height: gridHeightPercent + '%'
	 			});
	 		}
	 	}
	}

	this.getSelected = function() {

	}

	function create() {
		var htmlStr = '';

	 	productDatas.forEach(function(productData, i) {
	 		htmlStr += '<li data-preview-index="' + i + '"><div><img src="' + productData.imgUrl + '" alt=""></div></li>'
	 	});	
	 	htmlStr = '<ul>' + htmlStr + '</ul>';
	 	$domWrap.html(htmlStr);

	 	itemElems = [];
	 	Array.prototype.push.apply(itemElems,$domWrap.find('li'));
	 	that.reset();
	}

	function initEvent() {
		$domWrap.on('click', 'li', function() {
			$(this).toggleClass('selected');
			productDatas[$(this).data('previewIndex')].selected = true;
		});
	}



});

module.exports = ProductsPreview;



// 创建精灵
/*function createSprite() {
	var spriteSize = 8;
	var spriteMargin = 4;

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
        	y: -(Math.floor(i / col) - center.row) * (spriteSize + spriteMargin),
        	z: baseCrood.z + 10,
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
	logoAni.playEntryAnimation(); return;

	var aniCfg = $.extend(true, [], productCfg);
	var circle = 2; // 旋转圈数
	var timePass = 0; 

	aniCfg.forEach(function(cfg, i) {
		cfg.percent = 0; 
		cfg.finalAngle = Math.PI * 2 * circle + Math.atan(cfg.sizeInfo.x / (baseCrood.z - initCrood.z));
		cfg.aniRadius = Math.sqrt(cfg.sizeInfo.x * cfg.sizeInfo.x + (baseCrood.z - initCrood.z) * (baseCrood.z - initCrood.z));
		cfg.delay = i * 200 + Math.random() * 100;
		cfg.aniDur = 5000 + parseInt(Math.random() * 1000); 
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
}*/