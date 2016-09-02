var CONFIG = {};

// test 
var products = ['pro6', 'pro5', 'mx5', 'mx6', 'meilan3s', 'meilan3', 'meilannote3'];
var _products = [];



var mobile = {
	'name': 'pro5',
	'models': [
		{url: './assets/pro5/metal.json', size: 200},
		{url: './assets/pro5/metal_reflect.json', size: 200},
		{url: './assets/pro5/glass.json', size: 129},
		{url: './assets/pro5/plastics.json', size: 54},
		{url: './assets/pro5/map.json', size: 3},
		{url: './assets/pro5/plane.json', size: 8}
	],

	materials: {
		'black': {url: './assets/pro5/black.json', size: 6},
		'red': {url: './assets/pro5/black.json', size: 6},
	},

	map: [
		{url: './assets/pro5/pro5uv.png', size: 75000},
	]
};

CONFIG.mobiles = [];

products.forEach(function(productName) {
	var m = $.extend({}, mobile);

	m.name = productName;
	CONFIG.mobiles.push(m);
});

module.exports = CONFIG;
