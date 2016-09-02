// 下载缓存
loadedCache = {};

var Loader = Class.extend(function() {
	var that = this;

	this.calculateSize = function(loadParams) {
		var totalSize = 0;
		var loadTasks = getLoadTasks(loadParams);

		for (var i = 0; i < loadTasks.length; i++) {
			totalSize += loadTasks[i].size;
		}
		return totalSize;
	}

	this.load = function(loadParams, onProgress) {
		return new Promise(function(onLoad, reject) {
			var totalSize = 0; // 总大小
			var loadedSize = 0; // 已经下载大小
			var loadTasks = [];
			var loadTask;

			loadTasks = getLoadTasks(loadParams); 

			function getLoadedSize() {
				var loadedSize = 0;
				loadTasks.forEach(function(_loadTask) { 
					loadedSize += _loadTask.loaded
				});
				return loadedSize;
			}
			for (var i = 0; i < loadTasks.length; i++) {
				loadTask = loadTasks[i];
				loadTask.loaded = 0;
				totalSize += loadTask.size;

				if (loadedCache[loadTask.url]) {
					loadTask.loaded = loadTask.size;
					continue;
				}

				(function(loadTask) {
					loadMethod[loadTask.type](loadTask.url, function(res) {
						loadedCache[loadTask.url] = res;
						loadTask.loaded = loadTask.size;

						// 成功回调
						if (getLoadedSize() / totalSize === 1) {
							onLoad(getResults(loadParams));
						}
					}, function() {
						loadTask.loaded = loadTask.size * progress;
						onProgress(getLoadedSize() / totalSize);
					});
				})(loadTask);
			}			
		});

	}

	// 获取下载类型
	function getLoaderType(ext) {
		var typeExtMap = {
			'img': /(jpg|jpeg|gif|png)/,
			'json': /json/
		};

		for (var type in typeExtMap) {
			if (typeExtMap[type].test(ext)) {
				return type;
			}
		}
	}

	// 收集下载参数里的 url
	function getLoadTasks(_params) { 
		var urlRegx = /.+\.(\w{1,6})$/;
		var sizeDefault = {
			'img': 100,
			'json': 100	
		};

		function _getLoadTasks(params) {
			var urls = [];
			var type;

			if (Object.prototype.toString.call(params) === '[object Array]') {
				params.forEach(function(param) {
					urls = urls.concat(_getLoadTasks(param));
				});
			} else if (typeof params === 'object' && !params.url){
				for (var key in params) {
					urls = urls.concat(_getLoadTasks(params[key]));
				}
			} else if (typeof params === 'object' && params.url) {
				// 符合资源格式 {url: xx, size: xx}
				type = params.url.match(urlRegx)[1];

				urls.push({
					'url': params.url,
					'size': (params.size || sizeDefault[type] || 1),
					'type': getLoaderType(type)
				});
			}
			return urls;
		}
		getLoadTasks = _getLoadTasks;
		return _getLoadTasks(_params);
	}

	// 遍历下载参数里的 url， 替换成下载结果缓存
	function getResults(_params) {
		var params = $.extend(true, {}, _params);

		function _getResults(params) {
			console.log(params);
			if (Object.prototype.toString.call(params) === '[object Array]') {
				return (params.map(function(param) {
					return _getResults(param);
				}));
			} else if (typeof params === 'object' && !params.url) {
				for (var key in params) {
					params[key] =  _getResults(params[key]);
				}
				return params;
			} else if (typeof params === 'object' && params.url) {
				return loadedCache[params.url];
			} else {
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
var imgLoader = new THREE.ImageLoader();
var xhrLoader = new THREE.XHRLoader();

var loadMethod = {

	// 下载图片
	'img': function(url, onLoad, onProgress) {
		imgLoader.load(url, function() {
			onLoad(url);
		}, function(xhr) {
			return (xhr.load / xhr.total);
		});
	},

	// 下载 dae 模型
	'json': function(url, onLoad, onProgress) {
		xhrLoader.load(url, onLoad, function(xhr) {
			return (xhr.load / xhr.total);
		});
	}
}

module.exports = Loader;