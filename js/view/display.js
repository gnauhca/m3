var View = require('./view.js');

var DisplayContainerStage = require('../stages/display-container.js');
var MobileStage = require('../stage/display-mobile.js');

var Display = View.extend(function() {
	var that = this;
	var _lockTick;
	var _containerStage; 

	this.name = 'display';
	this.isInit = false;
	this.active = false;

	this.mobileStages = {}; // {pro6: xx, mx6: xx} for cache
	this.currentMobileStage = []; 

	// 3d
	this.scene = {};

	var $domWrap = $('#displayView');
	var $domManager = $('.display-manager');

	this.constructor = function() {
		_containerStage = new DisplayContainerStage();
		this.stages.push(_containerStage);
		this.super();
	}


	// data : {mobile: [pro5, mx6 ...]}
	this.activate = function(data) { 
		if (!this.isInit) {
			init();
			_containerStage.init();
		}

		// display mobile
		var mobiles = $.extend(true, [], data.mobiles);

		this.currentMobileStage = [];
		mobiles.forEach(function(name, i) {
			if (!this.mobileStages[name]) {
				var mobileStage = new MobileStage('name');
				this.mobileStages[name] = mobileStage;
				this.currentMobileStage.push(mobileStage);
			}
		});

		if (!isLoad.bind(this)()) return;

		// loaded 
		_containerStage.entry();// containerStage

		var sizePos = calculateSubWindowSize(mobiles.length);
		var x = 0;
		var entryCount = 0;

		this.currentMobileStage.forEach(function(mobileStage, i, all) {
			var meshPos = new Vector3(x + (i - (all.length/2)) * 100, 0, 0);
			mobileStage.entry(meshPos, sizePos[i]).then(function() {
				entryCount++;
				if (entryCount === all.length) {
					// todo entry animate done
				}
			});
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

	function isLoad() {
		var loaded = true;
		var loadingInfos = {};

		function loading() {
			var totalSize = 0;
			var loadedSize = 0;
			var progress;
			var loadingInfo;

			for (var name in loadingInfos) {
				loadingInfo = loadingInfos[name];
				totalSize += loadingInfo.size;
				loadedSize += loadingInfo.progress * loadingInfo.size;
			}

			progress = loadedSize/totalSize;
			showProgress(progress);
			if (progress === 1) {
				// loaded 
				this.activate();
			}
		}

		for (var name in this.mobileStages) {
			// loading
			if (!this.mobileStages[name].isInit) {
				loaded = false;
				loadingInfos[name] = {
					size: this.mobileStages[name].size,
					progress: 0
				}
				(function(_name) {
					this.mobileStages[_name].init(function(progress) {
						loadingInfos[_name].progress = progress;
						loading();
					}.bind(this)).then(function() {
						loadingInfos[_name].progress = 1;
						loading();
					}.bind(this));
				})(name);
			}
		}
		return loaded;
	}

	function showProgress(progress) {
		console.log('display.js loading: ' + progress);
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



