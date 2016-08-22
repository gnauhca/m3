var View = require('./view.js');

var DisplayContainerStage = require('../stages/display-container.js');
var DisplayStage = require('../stage/display-mobile.js');

var Display = View.extend(function() {
	var that = this;
	var _lockTick;
	var _containerStage; 

	this.name = 'display';
	this.isInit = false;
	this.active = false;

	this.displayStages = {}; // {pro6: xx, mx6: xx} for cache
	this.currentDisplayStage = []; 

	// 3d
	this.scene = {};

	var $domWrap = $('#displayView');
	var $domManager = $('.display-manager');

	this.constructor = function() {
		_containerStage = new DisplayContainerStage();
		this.stages.push(_containerStage);
		this.super();
	}

	this.activate = function(data) { 

		if (!this.isInit) {
			init();
			_containerStage.init();
		}

		// stage
		_containerStage.entry();

		// displaystage
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
		$domWrap.removeClass('none');

		this.active = true;
	}

	this.inActivate = function() {
		Object.keys(this.scene).forEach(function(o) { M3.scene.remove(that.scene[o]);});
		this.removeTick(sphereTick);

		$domWrap.addClass('none');
		this.activeWindows.forEach(function(activeWindow) {
			setTimeout(function() {activeWindow.inActivate();}, 0);
		});
		this.activeWindows.length = 0;

		_containerStage.leave();
		this.active = false;
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

	this.resize = function() {
		resetWindow();
	}

	function init() {
		setupUI();
	}

	function setupScene() {

	}

	function setupUI() {
		var $lockBtn = $domManager.find('.lock-btn');
		var $unlockBtn = $domManager.find('.unlock-btn');
		var $backBtn = $domManager.find('.back-btn');

		$domManager.on('click', '.setting-btn', function() {
			$domManager.addClass('show');
		});

		$domManager.on('click', '.lock-btn', function() {
			$lockBtn.addClass('none')
			$unlockBtn.removeClass('none');
			$domManager.removeClass('show');
			lock();
		});

		$domManager.on('click', '.unlock-btn', function() {
			$unlockBtn.addClass('none')
			$lockBtn.removeClass('none');
			$domManager.removeClass('show');
			unlock();
		});

		$domManager.on('click', '.back-btn', function() {
			that.inActivate();
			that.activateView('product-preview');
			$domManager.removeClass('show');
		});
	}


	function lock() {
		that.activeWindows.forEach(function(activeWindow, i) {
			var isMain = (i === 0);
			activeWindow.lock(isMain);
		});

		_lockTick = that.addTick(function() {
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

		that.removeTick(_lockTick);
	}

	function resetWindow() {
		var sizePos = calculateSubWindowSize(that.activeWindows.length);
		that.activeWindows.forEach(function(activeWindow, i) {
			activeWindow.resizeWindow(sizePos[i]);
		});
	}

});

module.exports = Display;



