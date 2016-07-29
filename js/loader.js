// 下载缓存
loadedCache = {};

var Loader = Class.extend(function() {
	var that = this;
	var sizeInfo = {
		'img': 1,
		'dae': 2	
	};

	this.load = function(loadParams, progressCallback, successCallback) {
		var totalSize = 0; // 总大小
		var loadedSize = 0; // 已经下载大小
		var loadUrls = [];
		var loadUrl;
		var resType;

		loadUrls = getUrls(loadParams);

		for (var i = 0; i < loadUrls.length; i++) {
			loadUrl = loadUrls[i];
			resType = getLoaderType(loadUrl.match(/\.(\w+)$/)[1]); 
			totalSize += sizeInfo[resType];
			loadMethod[resType](loadUrl, (function(type, url) {
				
				return function(res) {
					loadedSize += sizeInfo[type];

					loadedCache[url] = res;

					// 进度回调
					progressCallback && progressCallback(loadedSize/totalSize);

					// 成功回调
					if (loadedSize/totalSize === 1) {
						successCallback(getResults(loadParams));
					}
				}
			})(resType, loadUrl));
		}
	}

	// 获取下载类型
	function getLoaderType(ext) {
		var typeExtMap = {
			'img': /(jpg|jpeg|gif|png)/,
			'dae': /dae/
		};

		for (var type in typeExtMap) {
			if (typeExtMap[type].test(ext)) {
				return type;
			}
		}
	}

	// 收集下载参数里的 url
	function getUrls(_params) { 
		var urlRegx = /.+\.\w{1,6}$/;

		function _getUrls(params) {
			var urls = [];

			if (typeof params === 'string') {
				urlRegx.test(params) && urls.push(params);
			} else if (Object.prototype.toString.call(params) === '[object Array]') {
				params.forEach(function(param) {
					urls = urls.concat(_getUrls(param));
				});
			} else if (typeof params === 'object'){
				for (var key in params) {
					urls = urls.concat(_getUrls(params[key]));
				}
			}
			return urls;
		}

		return _getUrls(_params);
	}

	// 遍历下载参数里的 url， 替换成下载结果缓存
	function getResults(_params) {
		var params = $.extend(true, {}, _params);
		var urlRegx = /.+\.\w{1,6}$/;

		function _getResults(params) {
			if (typeof params === 'string') {
				return (loadedCache[params] || params);
			} else if (Object.prototype.toString.call(params) === '[object Array]') {
				return (params.map(function(param) {
					return loadedCache[param];
				}));
			} else {
				for (var key in params) {
					params[key] =  _getResults(params[key]);
				}
				return params;
			}
		}
		return _getResults(params);
	}
});


/*
 * 下载 URL等配置在loadconfig.params 中
 * loadMethod 根据不同type 应用相应策略下载资源缓存在 loaded cache 中
 * img直接缓存 url 
 */
var loadMethod = {

	// 下载图片
	'img': function(url, success) {
		var img = new Image();
		img.onload = function() {
			success(url);
		}
		img.src = url;
	},

	// 下载 dae 模型
	'dae': function(url, callback) {
		var loader = new THREE.ColladaLoader();
        loader.load(url, function (result) {
            mesh = result.scene.children[0].children[0].clone();
            callback(mesh.geometry);
        });
	}
}


module.exports = Loader;


