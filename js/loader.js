/*
 * loaderconfig format {type: img/model, url: xxx}
 */

var Loader = Class.extend(function() {
	sizeInfo = {
		IMG_SIZE: 1,
		MODEL_SIZE: 3	
	}


	this.constructor = function() {

	}

	this.load = function(loadConfigs, progressCallback, successCallback) {
		var totalSize = 0;
		var loadedSize = 0;
		var loadedReses = [];
		var loadConfig;

		for (var i = 0; i < loadConfigs.length; i++) {
			loadConfig = loadConfigs[i];

			totalSize += sizeInfo[loadConfig['type']];

			loadMethod[loadConfig['type']](loadConfig['url'], (function(type, _i) {
				return function(res) {
					loadedSize += sizeInfo[type];

					loadedReses[_i] = res;

					// 进度回调
					progressCallback(loadedSize/totalSize, loadedReses);

					// 成功回调
					if (loadedSize/totalSize === 1) {
						successCallback(loadedReses);
					}
				}
			})(loadConfig['type']), i);
		}
	}
});

var loadMethod = {

	// 下载图片
	'img': function(url, callback) {
		var img = new Image();
		img.onload = function() {
			callback(img);
		}
		img.src = url;
	},

	// 下载模型
	'model': function(url, callback) {
		//
	}
}