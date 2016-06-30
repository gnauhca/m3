var View = require('./view.js');
var DisplayWindow = require('./display-window.js');

var DisplayManager = View.extend(function() {
	var that = this;
	this.name = 'display-manager';
	this.displayWindows = [];

	this.$domWrap = $('#displayView');

	this.constructor = function() {
		
	}

	this.activate = function(data) { 
		var productDatas = $.extend(true, [], data.productDatas);
		var sizePos = calculateSubWindowSize(productDatas.length);

		productDatas.forEach(function(productData, i) {
			var displayWindowData = {
				'productData': productData,
				'cameraPos': data.cameraPos,
				'windowSize': sizePos[i],
			}

			that.displayWindows[i] = $.extend(that.displayWindows[i], displayWindowData);

			if (!that.displayWindows[i].displayView) {
				that.displayWindows[i].displayView = new DisplayWindow();
			}
			that.displayWindows[i].displayView.activate(displayWindowData);
		});

		// UI
		this.$domWrap.show();
	}


	this.removeWindow = function(displayWindows) {

	}

	function addWindow() {

	}

	function createDisplayView() {

	}
});

module.exports = DisplayManager;