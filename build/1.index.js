webpackJsonp([1],{

/***/ 12:
/***/ function(module, exports) {

	var ViewDisplay = Class.extend(function() {
		
	});

/***/ },

/***/ 146:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, CONFIG) {var View = __webpack_require__(9);
	var DisplayManager = __webpack_require__(13);
	
	var ProductsPreview = View.extend(function() {
		this.name = 'product-preview';
	
		var that = this;
		var $domWrap;
	
		var gridNumHor;
		var gridNumVer;
		var gridWidthPercent;
		var gridHeightPercent;
	
		var productDatas = [];
		var productSelected = [];
		var itemElems = [];
	
		var maxSelect = 4; // 最多选择个数
	
		var displayManager = new DisplayManager();
	
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
			this.active = true;
			$domWrap.show();
			setTimeout(function() {
				$domWrap.addClass('active');
			}, 50);
		}
	
		this.inactivate = function() {
			this.active = false;
			$domWrap.addClass('inactive');
			setTimeout(function() {$domWrap.hide();}, 1000);
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
		 		var max = Math.max(productDatas.length, gridNumHor * gridNumVer);
	
		 		for (var i = 0; i < max; i++) {
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
		 		itemElems.length = max;
		 		$domWrap.find('.list-wrap li:gt(' + (max - 1) + ')').remove();
		 	}
		}
	
		this.getSelected = function() {
	
		}
	
		function create() {
			var htmlStr = '';
	
		 	productDatas.forEach(function(productData, i) {
		 		htmlStr += '<li data-preview-index="' + i + '"><div><img src="' + productData.imgUrl + '" alt=""></div></li>'
		 	});	
		 	htmlStr = htmlStr;
		 	$domWrap.find('.list-wrap').html(htmlStr);
	
		 	itemElems = [];
		 	Array.prototype.push.apply(itemElems,$domWrap.find('li'));
		 	that.reset();
		}
	
		function initEvent() {
			function selectProducts(indexes) {
				var $li = $domWrap.find('.list-wrap li');
				$li.removeClass('selected');
	
				if (indexes)
				indexes.forEach(function(index) {
					$li.eq(index).addClass('selected');
				});
	
				if (indexes && indexes.length) {
					$domWrap.addClass('show-control');
				} else {
					$domWrap.removeClass('show-control');
				}
			}
	
			$domWrap.on('click', 'li:lt(' + productDatas.length + ')', function() {
				var previewIndex = $(this).data('previewIndex');
	
				var productData = productDatas[previewIndex];
	
				if (productSelected.indexOf(productData) < 0) {
					productSelected.push(productData);
					if (productSelected.length > maxSelect) {
						productSelected.shift();
					}
				} else {
					productSelected = productSelected.filter(function(product) {
						return product !== productData;
					});
				}
	
				selectProducts(productSelected.map(function(product) {
					return productDatas.indexOf(product);
				}));
			});
	
			$domWrap.on('click', '#clear', function() {
				productSelected.length = 0;
				selectProducts();
			});
			$domWrap.on('click', '#go', function() {
				goDisplay();
			});
		}
	
		function goDisplay() {
			$domWrap.removeClass('show-control').addClass('choosed');
			var $li = $domWrap.find('.list-wrap li');
			var selectedPos = calculateSubWindowSize(productSelected.length);
			var index = 0;
	
			console.log(selectedPos);
	
			productDatas.forEach(function(product, i) {
				if (index > productSelected.length - 1) return false;
				if (productSelected.indexOf(product) != -1) {
					$li.eq(i).css(selectedPos[index]);
				    index++;			
				}
			});
	
			setTimeout(function() {
				that.inactive();
				that.inactivateView('welcome');
				that.activateView('display-manager', productSelected);
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(7)))

/***/ },

/***/ 148:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(CONFIG, $) {var View = __webpack_require__(9);
	var ProductPreview = __webpack_require__(146);
	var Welcome = View.extend(function() {
		this.name = 'welcome';
		this.isInit = false;
	
		var that = this;
		var logoUrl = CONFIG.MEIZU_LOGO;
		var particleDatas = [];
		var camera; // 自身创建 camera
		var cloud;
		var baseCrood = new THREE.Vector3(0, 0, 0);
		var renderTick;
	
		this.constructor = function() {
			this.super();
	        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
	
			M3.scene.add(camera);
	        productPreview = new ProductPreview();
		}
	
		this.activate = function() {
			if (!particleDatas.length) {
				var img = new Image();
				img.src = logoUrl;
				img.onload = function() {
					particleDatas = getParticlesData(img);
					createParticle();
					init();
				}
			} else {
				init();		
			}
		}
	
		this.inactivate = function() {
			this.removeTick(renderTick); // 移除全部tick 
		}
	
		this.reset = function() {
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;
	
			M3.renderer.setSize(winWidth, winHeight);
			camera.aspect = window.innerWidth / window.innerHeight;
	        camera.updateProjectionMatrix();
	
			camera.position.set(0, 0, 250);
			camera.lookAt(baseCrood);
		}
	
	
		function init() {
			that.reset();
			playEntryAnimation(function() {
				productPreview.activate();
			});	
			render();
		} 
	
		function getParticlesData(img) {
			var particleDatas = [];
			var width = img.width;
			var height = img.height;
	
			// 从canvas 读取颜色信息，创建粒子
			var cvs = document.createElement('canvas');
			cvs.width = width;
			cvs.height = height;
			var ctx = cvs.getContext('2d');
	
			ctx.drawImage(img, 0, 0);	
	
			var pixs = ctx.getImageData(0, 0, width, height).data;
	
			for (var i = 0; i < pixs.length; i += 4) {
			    var r = pixs[i],
			        g = pixs[i + 1],
			        b = pixs[i + 2],
			        a = pixs[i + 3];
	
			    if (b > 50) {
			        var x = (i % (4 * width)) / 4 - width/2;
			        var y = -(parseInt(i / (4 * width)) - height/2);
	
			        particleDatas.push({
			        	'color': 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')',
			        	//'color': '#abcdef',
			        	'size': {'x': x, 'y': y}
			        });
			    }
			}
	
			// 动画相关设置
			var circleNum = 2;
			var angleV = Math.PI * 2 / 4000; // 每秒转一圈, 转速
			var radiusV = 30; // 每旋转一圈半径增长长度
	
			particleDatas.forEach(function(particleData, i) {
	
				particleData.radiusV = radiusV;
				particleData.angleV = angleV * (0.8 + Math.random() * 0.4);
				particleData.percent = 0;
				particleData.delay = 2000 + (particleData.size.x * particleData.size.y) / 1;
				particleData.initRadius = Math.sqrt(particleData.size.x * particleData.size.x + particleData.size.y * particleData.size.y);
				particleData.angleY = Math.acos(particleData.size.y * Math.random()/particleData.initRadius); // 与 Y 轴夹角
	
				particleData.initAngle = particleData.size.x < 0 ? Math.PI : 0;
				particleData.currentAngle = particleData.initAngle;
				particleData.finalAngle = (circleNum + Math.random()) * Math.PI * 2// * (Math.random() > 0.5 ? 1 : -1);
				particleData.dur = (particleData.finalAngle - particleData.initAngle) / particleData.angleV;
	
			});
	
			return particleDatas;
		}
	
		function createParticle() {
	
	        var geom = new THREE.Geometry();
	        var material = new THREE.PointCloudMaterial({
	            size: 1,
	            transparent: true,
	            opacity: 0.6,
	            vertexColors: true,
	
	            sizeAttenuation: true,
	            color: 0xffffff
	        });
	
			particleDatas.forEach(function(particleData) {
				var particle = new THREE.Vector3(particleData.size.x, particleData.size.y, 0);
				geom.vertices.push(particle);
	
				var color = new THREE.Color(particleData.color);
				geom.colors.push(color);
			});
	
	        cloud = new THREE.PointCloud(geom, material);
	        cloud.name = "particles";
	        M3.scene.add(cloud);
		}
	
		function playEntryAnimation(callback) {
			var timePass = 0;
			var aniDatas = $.extend(true, [], particleDatas);
			//aniDatas = [/*$.extend(true, [], particleDatas)[0], */aniDatas[aniDatas.length-1]];
			var aniDoneNum = 0;
	
			var aniTick = that.addTick(function(detal) {
				timePass += detal;
				aniDoneNum = 0;
	
				aniDatas.forEach(function(aniData, i) {
					if (timePass < aniData.delay || aniData.percent === 1) { if (aniData.percent === 1) aniDoneNum++; return; };
					aniData.percent = (timePass - aniData.delay) / aniData.dur;
					aniData.percent = aniData.percent > 1 ? 1 : aniData.percent;
	
					aniData.currentAngle = easing.easeInOutCubic(timePass - aniData.delay, aniData.initAngle, aniData.finalAngle, aniData.dur);
	
					aniData.currentRadius = Math.abs((aniData.currentAngle - aniData.initAngle) / (Math.PI * 2)) * aniData.radiusV + aniData.initRadius;
	
					aniData.size.y = aniData.currentRadius * Math.cos(aniData.angleY);
					aniData.size.x = aniData.currentRadius * Math.abs(Math.sin(aniData.angleY)) * Math.cos(aniData.currentAngle);
					aniData.size.z = aniData.currentRadius * Math.abs(Math.sin(aniData.angleY)) * Math.sin(aniData.currentAngle);
	
					cloud.geometry.vertices[i].set(aniData.size.x, aniData.size.y, aniData.size.z)
	
				});
	
				cloud.geometry.verticesNeedUpdate = true;
	
				if (aniDoneNum/aniDatas.length > 0.6 || timePass > 10000) {
					callback && callback(); callback = false;
				}
	
				cloud.rotation.x += 0.0005;
				cloud.rotation.y += 0.0005;
				cloud.rotation.z += 0.0005;
				if (aniDoneNum/aniDatas.length > 0.99) {
					//that.removeTick(aniTick);
				}
			});
		}
	
		// render 
		function render() {
			renderTick = that.addTick(function() {
				M3.renderer.render(M3.scene, camera);
			});
		}
	});
	
	module.exports = Welcome;
	
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(8)))

/***/ }

});
//# sourceMappingURL=1.index.js.map