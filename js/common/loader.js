// 下载缓存
let loadedCache = {};

class Loader {
	constructor() {}

	calculateSize(loadParams) {
		let totalSize = 0;
		let loadTasks = this._getLoadTasks(loadParams);

		for (let i = 0; i < loadTasks.length; i++) {
			totalSize += loadTasks[i].size;
		}
		return totalSize;
	}

	// Params 下载任务格式 {url: xx, size: xx}
	load(loadParams, onProgress) {
		let that = this;
		return new Promise(function(onLoad, reject) {
			let loadedCount = 0;
			let totalSize = 0; // 总大小
			let loadedSize = 0; // 已经下载大小
			let loadTasks = [];
			let loadTask;

			loadTasks = that._getLoadTasks(loadParams); 

			function getLoadedSize() {
				let loadedSize = 0;
				loadTasks.forEach(function(_loadTask) { 
					loadedSize += _loadTask.loaded
				});
				return loadedSize;
			}
			for (let i = 0; i < loadTasks.length; i++) {
				loadTask = loadTasks[i];
				loadTask.loaded = 0;
				totalSize += loadTask.size;

				if (loadedCache[loadTask.url]) {
					loadedCount++;
					loadTask.loaded = loadTask.size;
					continue;
				}
				(function(loadTask) {
					loadMethod[loadTask.type](loadTask.url, function(res) {
						loadedCount++;
						loadedCache[loadTask.url] = res;
						loadTask.loaded = loadTask.size;

						// console.log(loadTasks[0].loaded, loadTasks[1].loaded);
						// 成功回调
						if (getLoadedSize() / totalSize === 1 && loadedCount === loadTasks.length) {
							// console.log(that._getResults(loadParams));
							onLoad(that._getResults(loadParams));
						}
					}, function(progress) {
						loadTask.loaded = loadTask.size * progress;
						onProgress(getLoadedSize() / totalSize);
					});
				})(loadTask);
			}			
		});

	}

	// 获取下载类型
	_getLoaderType(ext) {
		let typeExtMap = {
			'img': /(jpg|jpeg|gif|png)/,
			'json': /json/,
			'js': /js/
		};

		for (let type in typeExtMap) {
			if (typeExtMap[type].test(ext)) {
				return type;
			}
		}
	}

	// 收集下载参数里的 url
	_getLoadTasks(_params) { 
		let urlRegx = /.+\.(\w{1,6})$/;
		let sizeDefault = {
			'img': 100,
			'json': 100	
		};
		let that = this;

		function _getLoadTasks(params) {
			let urls = [];
			let type;

			if (Object.prototype.toString.call(params) === '[object Array]') {
				params.forEach(function(param) {
					urls = urls.concat(_getLoadTasks(param));
				});
			} else if (typeof params === 'object' && !params.url){
				for (let key in params) {
					urls = urls.concat(_getLoadTasks(params[key]));
				}
			} else if (typeof params === 'object' && params.url) {
				// 符合资源格式 {url: xx, size: xx}
				type = params.url.match(urlRegx)[1];

				urls.push({
					'url': params.url,
					'size': (params.size || sizeDefault[type] || 1),
					'type': params.type || that._getLoaderType(type)
				});
			}
			return urls;
		}
		return _getLoadTasks(_params);
	}

	// 遍历下载参数里的 url， 替换成下载结果缓存
	_getResults(_params) {
		let params = $.extend(true, {}, _params);

		function _getResults(params) {
			if (Object.prototype.toString.call(params) === '[object Array]') {
				return (params.map(function(param) {
					return _getResults(param);
				}));
			} else if (typeof params === 'object' && !params.url) {
				for (let key in params) {
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
}


/*
 * 下载 URL等配置在loadconfig.params 中
 * loadMethod 根据不同type 应用相应策略下载资源缓存在 loaded cache 中
 * img直接缓存 url 
 */
let loadMethod = {

	// 下载图片
	'img': function(url, onload, onProgress) {
		let imgLoader = new THREE.ImageLoader();
		imgLoader.load(url, function(img) {
			img.dataset.src = url;
			onload(img);
		}, function(xhr) {
			return onProgress(xhr.loaded / xhr.total);
		});
	},

	// 下载 模型
	'json': function(url, onload, onProgress) {
		let xhrLoader = new THREE.XHRLoader();
		xhrLoader.load(url, onload, function(xhr) {
			return onProgress(xhr.loaded / xhr.total);
		});
	},

	// model 
	'model': function(url, onload, onProgress) {
		let xhrLoader = new THREE.XHRLoader();
		xhrLoader.load(url, function(str) {
			onload(str.replace(/module\.exports\s*=\s*/, ''));
		}, function(xhr) {
			return onProgress(xhr.loaded / xhr.total);
		});
	},

	// 下载 script 
	'js': function(url, onload, onProgress) {

		let req = new XMLHttpRequest();

		// report progress events
		req.addEventListener("progress", function(xhr) {
		    if (xhr.lengthComputable) {
		        onProgress(xhr.loaded / xhr.total);
		    }
		}, false);

		// load responseText into a new script element
		req.addEventListener("load", function(event) {
		    let e = event.target;
		    let s = document.createElement("script");
		    s.innerHTML = e.responseText;
		    // or: s[s.innerText!=undefined?"innerText":"textContent"] = e.responseText
		    document.documentElement.appendChild(s);
			onload();
		    /*s.addEventListener("load", function() {
		    	console.log(1);
		        
		    });*/
		}, false);

		req.open("GET", url);
		req.send();
	}
}

export default Loader;