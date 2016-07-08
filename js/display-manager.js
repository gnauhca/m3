var View = require('./view.js');
var DisplayWindow = require('./display-window.js');

var DisplayManager = View.extend(function() {
	var that = this;
	var initialized = false;
	var lockTick;

	this.name = 'display-manager';
	this.displayWindows = [];
	this.activeWindows = [];

	var $domWrap = $('#displayView');
	var $domManager = $('.display-manager');

	this.constructor = function() {
		this.super();
	}

	this.setup = function() {

	}

	this.activate = function(data) { 

		active = true;
		if (!initialized) {
			init();
		}

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
		$domWrap.show();
	}

	this.inActivate = function() {
		$domWrap.hide();
	}

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



	function init() {
		setupUI();
	}

	function setupUI() {
		var $lockBtn = $domManager.find('.lock-btn');
		var $unlockBtn = $domManager.find('.unlock-btn');
		var $backBtn = $domManager.find('.back-btn');

		$domManager.on('click', '.setting-btn', function() {
			$domManager.addClass('show');
		});

		$domManager.on('click', '.lock-btn', function() {
			$lockBtn.hide();
			$unlockBtn.show();
			$domManager.removeClass('show');
			lock();
		});

		$domManager.on('click', '.unlock-btn', function() {
			$unlockBtn.hide();
			$lockBtn.show();
			$domManager.removeClass('show');
			unlock();
		});

		$domManager.on('click', '.backBtn', function() {
			that.inActivate();
		});
	}


	function lock() {
		that.activeWindows.forEach(function(activeWindow, i) {
			var isMain = (i === 0);
			activeWindow.lock(isMain);
		});

		lockTick = that.addTick(function() {
			var sizeInfo = that.activeWindows[0].getSize();
			//console.log(sizeInfo);
			that.activeWindows.forEach(function(activeWindow, i) {
				if (i > 0)
				activeWindow.setSize(sizeInfo);
			});
		});
	}

	function unlock() {
		that.activeWindows.forEach(function(activeWindow, i) {
			activeWindow.unlock();
		});

		that.removeTick(lockTick);
	}

	function resetWindow() {
		var sizePos = calculateSubWindowSize(that.activeWindows.length);
		that.activeWindows.forEach(function(activeWindow, i) {
			activeWindow.resizeWindow(sizePos[i]);
		});
	}

});

module.exports = DisplayManager;



