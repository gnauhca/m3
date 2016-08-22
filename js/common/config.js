var CONFIG = {
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
var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];
var _products = [];

products.forEach(function(product, i) {
	_products[i] = {
		'name': product,
		'previewImg': './assets/preview/'+product+'_logo@2x.png',
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


/*'pro5': {

	'models': [
		{url: xx, size: xx},
		{url: xx, size: xx},
		{url: xx, size: xx}
	],

	materials: {url: xx, size: xx},

	map: [
		{url: xx, size: xx},
		{url: xx, size: xx}
	]
}*/









