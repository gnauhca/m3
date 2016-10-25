// 模型是 webpack Chunk，需要知道webpack 处理之后的路径
var buildPath = './build/'; 

var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];

var mobile = {
	'models': {url: buildPath + require('assets/mobiles/pro5/pro5.js'), size: 300, 'type': 'model'},
	
	// 贴图，file-loader 获取路径
	'map': {
		'default': {url: require('assets/mobiles/pro5/pro5uv.png'), size: 3000}
	}
};

var mobiles = [];

products.forEach(function(productName) {
	mobiles.push(
		{"name": productName, mobile: mobile}
	);
});

export default mobiles;