var CONFIG = {
	MEIZU_LOGO: './assets/logo.png',
	products: [
		{
			'name': 'pro6',
			'imgUrl': './assets/pro6/phone-silver.jpg',
			'modelUrl': './assets/pro6/pro6.dae',
			'title': 'PRO 6',
			'desc' : 'PRO 6 was produced in 2016'
		}
	]
};

// test 
var products = ['mx5', 'pro5', 'pro6', 'm2', 'm2note', 'm3', 'm3note', 'm3s', 'router', 'm8', 'm10', 'mx4', 'mx4pro'];
var _products = [];

products.forEach(function(product, i) {
	_products[i] = {
		'name': product,
		'previewImg': './assets/pro6/phone-silver.jpg',
		'model': {
			type: 'dae',
			geometry: './assets/pro6/pro6.dae',
			textures: {
				'white': './assets/pro6/pro6-white.jpg',
				'black': './assets/pro6/pro6-black.jpg',
				'red': './assets/pro6/pro6-red.jpg'
			},
		},
		'modelPos': {x: (i) * 30, y: 0, z: 0},
		'title': 'PRO 6',
		'desc' : 'PRO 6 was produced in 2016'

	}
});
CONFIG.products = _products;


module.exports = CONFIG;