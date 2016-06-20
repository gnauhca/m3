var Loader = require('./loader.js');
var loader = new Loader();

var ViewList = View.extend(function() {

	var assetsLoaded = false;
	var productCfg = [];
	this.viewDisPlayManagerId;

	this.constructor = function() {
		productCfg = $.extend(true, {}, CONFIG.products);
	}

	this.activate = function(data) {
		if (!assetsLoaded) {
			this.loadAssets();
		}

		// 粒子动画
	}

	this.loadAssets = function() {
		var loadConfigs = [];
		var that = this;

		productCfg.forEach(function(item, i) {
			loadConfigs[i].type = 'img';
			loadConfigs[i].url = item.imgUrl;
		});

		loader.load(loadConfigs, function(progress) {
			// 进度显示	
		}, function(res) {
			// 成功回调	
			assetsLoaded = true;
			if (that.isActive) {
				that.activate();
			}
		});
	}	
});


module.exports = ViewList;