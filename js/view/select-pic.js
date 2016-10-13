var View = require('./view.js');

var ProductsPreview = View.extend(function() {
	this.name = 'product-preview';

	var that = this;
	var $domWrap;

	var gridNumHor;
	var gridNumVer;
	var gridWidthPercent;
	var gridHeightPercent;

	var productDatas = [];
	var productSelected = [];
	var itemElems = [];

	var maxSelect = 4; // 最多选择个数

	this.constructor = function() {
		super();
		this.init();
	}

	this.init = function() {
		productDatas = $.extend(true, [], CONFIG.products);
		$domWrap = $('#listView');
		//create();
		initEvent();
	}

	this.activate = function() {
		this.active = true;
		productSelected.length = 0;
		$domWrap.show().find('.list-wrap').html('');
		create();
		$domWrap.removeClass('inactive active choosed')
		setTimeout(function() {
			$domWrap.addClass('active');
		}, 50);
	}

	this.inactivate = function() {
		this.active = false;
		$domWrap.addClass('inactive');
		setTimeout(function() {$domWrap.hide();}, 1000);
	}

	// 重置大小，位置
	this.resize = function() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		var gridWidth = 300;
		var gridHeight = 300;

		gridNumHor = Math.round(winWidth/gridWidth);
		gridNumVer = Math.round(winHeight/gridHeight);

		gridWidthPercent = 100 / (gridNumHor === 0 ? 1 : gridNumHor);
	 	gridHeightPercent = 100 / (gridNumVer === 0 ? 1 : gridNumVer);


		var left;
		var top;
	 	if (itemElems.length) {
	 		var max = Math.max(productDatas.length, gridNumHor * gridNumVer);

	 		for (var i = 0; i < max; i++) {
		 		left = (i % gridNumHor) * gridWidthPercent;
		 		top = Math.floor(i / gridNumHor) * gridHeightPercent;

		 		if (!itemElems[i]) {
		 			itemElems[i] = $('<li data-preview-index="' + i + '"><div></div></li>')[0];
		 			$domWrap.find('ul').append(itemElems[i]);
		 		}

	 			$(itemElems[i]).css({
	 				left: left + '%',
	 				top: top + '%',
	 				width: gridWidthPercent + '%',
	 				height: gridHeightPercent + '%'
	 			});
	 		}
	 		itemElems.length = max;
	 		$domWrap.find('.list-wrap li:gt(' + (max - 1) + ')').remove();
	 	}
	}

	this.getSelected = function() {
	}

	function create() {
		var htmlStr = '';

	 	productDatas.forEach(function(productData, i) {
	 		htmlStr += '<li data-preview-index="' + i + '"><div><img src="' + productData.previewImg + '" alt=""></div></li>'
	 	});	
	 	htmlStr = htmlStr;
	 	$domWrap.find('.list-wrap').html(htmlStr);

	 	itemElems = [];
	 	Array.prototype.push.apply(itemElems,$domWrap.find('li'));
	 	that.resize();
	}

	function initEvent() {
		function selectProducts(indexes) {
			var $li = $domWrap.find('.list-wrap li');
			$li.removeClass('selected');

			if (indexes)
			indexes.forEach(function(index) {
				$li.eq(index).addClass('selected');
			});

			if (indexes && indexes.length) {
				$domWrap.addClass('show-control');
			} else {
				$domWrap.removeClass('show-control');
			}
		}

		$domWrap.on('click', 'li:lt(' + productDatas.length + ')', function() {
			var previewIndex = $(this).data('previewIndex');

			var productData = productDatas[previewIndex];

			if (productSelected.indexOf(productData) < 0) {
				productSelected.push(productData);
				if (productSelected.length > maxSelect) {
					productSelected.shift();
				}
			} else {
				productSelected = productSelected.filter(function(product) {
					return product !== productData;
				});
			}

			selectProducts(productSelected.map(function(product) {
				return productDatas.indexOf(product);
			}));
		});

		$domWrap.on('click', '#clear', function() {
			productSelected.length = 0;
			selectProducts();
		});
		$domWrap.on('click', '#go', function() {
			goDisplay();
		});
	}

	function goDisplay() {
		$domWrap.removeClass('show-control').addClass('choosed');
		var $li = $domWrap.find('.list-wrap li');
		var selectedPos = calculateSubWindowSize(productSelected.length);
		var selectedPosCSSes = $.extend(true, [], selectedPos);
		var index = 0;

		selectedPosCSSes.forEach(function(selectedPosCSS) {
			for (var key in selectedPosCSS) {
				selectedPosCSS[key] = selectedPosCSS[key] * 100 + '%';
			}			
		});

		console.log(selectedPosCSSes);

		productDatas.forEach(function(product, i) {
			if (index > productSelected.length - 1) return false;
			if (productSelected.indexOf(product) != -1) {
				console.log(selectedPosCSSes[index]);
				$li.eq(i).css(selectedPosCSSes[index]);
			    index++;			
			}
		});

		setTimeout(function() {
			that.inactivate();
			that.inactivateView('welcome');
			that.activateView('display-manager', {'productDatas': productSelected, 'cameraPos': new THREE.Vector3(0,0,0)});
		}, 1000);
	}
});

module.exports = ProductsPreview;

