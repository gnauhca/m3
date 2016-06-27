var View = require('./view.js');
var Loader = require('./loader.js');
var loader = new Loader();

var List = View.extend(function() {
	var that = this;
	var assetsLoaded = false; // 资源是否已加载

	var logoUrl = CONFIG.MEIZU_LOGO;

	var productCfg = []; // 产品配置信息 from config.products
	var col = 4; // 一列展示的产品数量


	this.constructor = function() {
		this.super();
		productCfg = $.extend(true, [], CONFIG.products);
		
	}

	// 激活当前视图， data 激活附带参数
	this.activate = function(data) {

		// 下载资源
		if (!assetsLoaded) {
			loadAssets();
			return;
		}

		// 精灵动画
		init();
	}

	function init() {
		that.activateView('welcome');
	}


	// 加载资源
	function loadAssets() {
		var loadConfigs = [];

		productCfg.forEach(function(item, i) {
			loadConfigs[i] = {
				type: 'img',
				params: { 'url': item.previewImg }
			};
		});

		loadConfigs.push({
			type: 'img',
			params: { 'url': logoUrl }
		});

		loader.load(loadConfigs, function(progress) {
			// 进度显示	
			console.log('list progress', progress);
		}, function(res) {
			// 成功回调	
			assetsLoaded = true;
			if (!that.isActive) {
				that.activate();
			}
		});
	}	

});


module.exports = List;