// 模型是 webpack Chunk，需要知道webpack 处理之后的路径
var buildPath = './build'; 

var mobile = {
	'models': {url: buildPath + 'assets/pro5/pro5.json', size: 300}
	
	// 贴图，file-loader 获取路径
	'map': [
		'default': ''
	]
};

