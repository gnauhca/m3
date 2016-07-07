var View = require('./view.js');
var DisplayWindow = require('./display-window.js');

var DisplayManager = View.extend(function() {
	var that = this;
	this.name = 'display-manager';
	this.displayWindows = [];
	this.activeWindows = [];

	this.$domWrap = $('#displayView');

	this.constructor = function() {
		this.super();
	}

	this.setup = function() {

	}

	this.activate = function(data) { 
		var productDatas = $.extend(true, [], data.productDatas);
		var sizePos = calculateSubWindowSize(productDatas.length);

		productDatas.forEach(function(productData, i) {

			var displayWindowData = {
				'productData': productData,
				'cameraPos': data.cameraPos,
				'windowSize': sizePos[i],
			};
			var displayWindow;

			if (that.displayWindows.length) {
				displayWindow = that.displayWindows.pop();
			} else {
				displayWindow = new DisplayWindow();
			}

			displayWindow.activate(displayWindowData);
			that.activeWindows.push(displayWindow);
		});

		// UI
		this.$domWrap.show();
	}

	this.inActivate = function() {}

	this.removeWindow = function(displayWindow) {
		this.activeWindows.some(function(activeWindow, i) {
			if (activeWindow === displayWindow) {
				that.displayWindows.push(activeWindow);
				that.activeWindows.splice(i, 1);
				return true;
			} 
		});
		

		resetWindow();
	}

	function addWindow() {

	}

	function resetWindow() {
		var sizePos = calculateSubWindowSize(that.activeWindows.length);
		that.activeWindows.forEach(function(activeWindow, i) {
			activeWindow.resizeWindow(sizePos[i]);
		});
	}

});

module.exports = DisplayManager;



