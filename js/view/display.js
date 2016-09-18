var View = require('./view.js');
var DisplayContainerStage = require('../stages/display-container.js');
var MobileStage = require('../stages/display-mobile.js');

var Display = View.extend(function() {
	var that = this;
	var _lockTick;
	var _containerStage; 
	var _progressView;

	this.name = 'display';
	this.isInit = false;
	this.active = false;

	// stages
	var _mobileStages = {}; // {pro6: xx, mx6: xx} for cache
	var _currentMobileStages = []; 
	this.stages = [];

	// UI
	var _$domWrap = $('#displayView');
	var _$domManager = $('.display-manager');

	var _$windowWrap = $('#displayWindowWrap');

	var _windowDoms = [];
	var _currentWindowDoms = [];

	this.constructor = function() {
		_progressView = M3.viewManager.getView('progress');
		_containerStage = new DisplayContainerStage();
		this.stages.push(_containerStage);
		this.super();
	}

	// data : {mobile: [pro5, mx6 ...]}
	this.activate = function(data) {
		// check self init
		if (!this.isInit) {
			init();
			_containerStage.init();
		}

		if (data) {
			var mobiles = $.extend(true, [], data.mobiles);
			_currentMobileStages = [];
			mobiles.forEach(function(name, i) {
				if (!_mobileStages[name]) {
					var mobileStage = new MobileStage(name);
					_mobileStages[name] = mobileStage;
					_currentMobileStages.push(mobileStage);
				}
			}.bind(this));

			// isload 如果检查到需要加载，会启动加载，并在加载完成之后调用回调
			if (!isLoad.bind(this)(this.activate.bind(this))) return;	
		}

		// all loaded 
		//_containerStage.entry();// containerStage

		var sizePos = calculateSubWindowSize(_currentMobileStages.length);
		var x = 0;
		var entryCount = 0;

		_currentMobileStages.forEach(function(mobileStage, i, all) {
			var meshPos = new THREE.Vector3(x + (i - (all.length/2)) * 100, 0, 0);
			mobileStage.entry(meshPos, sizePos[i]).then(function() {
				entryCount++;
				if (entryCount === all.length) {
					// todo entry animate done
				}
			});
			that.stages.push(mobileStage);
		});
		createWindowUI();resizeWindows();

		// UI
		_$domWrap.removeClass('none');
		this.stages.push(_containerStage);

		this.active = true;
	}

	this.inActivate = function() {
		Object.keys(this.scene).forEach(function(o) { M3.scene.remove(that.scene[o]);});
		this.removeTick(sphereTick);

		_$domWrap.addClass('none');
		this.activeWindows.forEach(function(activeWindow) {
			setTimeout(function() {activeWindow.inActivate();}, 0);
		});
		this.activeWindows.length = 0;

		_containerStage.leave();
		this.stages = [];
		this.active = false;
	}

	this.resize = function() {
		resizeWindows();
	}

	function init() {
		var $lockBtn = _$domManager.find('.lock-btn');
		var $unlockBtn = _$domManager.find('.unlock-btn');
		var $backBtn = _$domManager.find('.back-btn');

		that.isInit = true;

		_$domManager.on('click', '.setting-btn', function() {
			_$domManager.addClass('show');
		});

		_$domManager.on('click', '.lock-btn', function() {
			$lockBtn.addClass('none')
			$unlockBtn.removeClass('none');
			_$domManager.removeClass('show');
			lock();
		});

		_$domManager.on('click', '.unlock-btn', function() {
			$unlockBtn.addClass('none')
			$lockBtn.removeClass('none');
			_$domManager.removeClass('show');
			unlock();
		});

		_$domManager.on('click', '.back-btn', function() {
			that.inActivate();
			that.activateView('product-preview');
			_$domManager.removeClass('show');
		});

		// windows
		_$domWrap.on('click', '.reset-btn', function() {
			var index = $(this).parents('.display-window').index();
			resetWindow(index);
		});

		_$domWrap.on('click', '.close-btn', function() { 
			var index = $(this).parents('.display-window').index();
			closeWindow(index);
		});

		_$domWrap.on('click', '.color', function() {
			var index = $(this).parents('.display-window').index();
			var color = $(this).data('color');
			_currentMobileStages[index].changeColor(color);
			$(this).addClass('selected').silbings().removeClass('selected');
		});
	}/**/

	function isLoad(callback) {
		var unloadedCount = 0;
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
			if (unloadedCount === 0) {
				// loaded 
				callback(); _progressView.inactivate();
			}
		}

		for (var name in _mobileStages) {
			// loading
			if (!_mobileStages[name].isInit) {
				loaded = false;
				unloadedCount++;
				loadingInfos[name] = {
					size: _mobileStages[name].size,
					progress: 0
				};
				(function(_name) { 
					_mobileStages[_name].init(function(progress) {
						loadingInfos[_name].progress = progress;
						loading();
					}).then(function() {
						unloadedCount--;
						loadingInfos[_name].progress = 1;
						loading();
					}).catch(function(e) { console.error(e.stack); });
				}.bind(this))(name);
			}
		}
		if (!loaded) { _progressView.activate(); }

		return loaded;
	}

	function showProgress(progress) {
		//console.log('display.js loading: ' + progress);
		_progressView.setProgress(progress);
	} 

	function createWindowUI() {
		var windowTemplate = 
			'<div class="display-window">' + 
				'<div class="window-control">' + 
					'<i class="btn reset-btn icon ion-ios-reload"></i>' + 
					'<i class="btn close-btn icon ion-ios-close-empty"></i>' + 			
				'</div>' + 
				'<div class="colors-control"></div>' + 
			'</div>';
		var colorTemplate = '<i class="color @color" data-color="@color"></i>';
		var colorHTML = '';

		_$windowWrap.html('');
		_currentWindowDoms = [];
		_currentMobileStages.forEach(function(mobileStage, i) {
			if (!_windowDoms[i]) {
				_windowDoms[i] = $(windowTemplate);
			}
			_currentWindowDoms[i] = _windowDoms[i];
			_$windowWrap.append(_currentWindowDoms[i]);

			colorHTML = '';
			mobileStage.getColors().forEach(function(color) {
				colorHTML += colorTemplate.replace(/\@color/g, color);
			});
			_currentWindowDoms[i].find('.colors-control').empty().html(colorHTML);
		});
	}

	// 模型恢复初始状态
	function resetWindow(index) {
		if (_lockTick) {
			_currentMobileStages[0].reset();
		} else {
			_currentMobileStages[index].reset();
		}
	}

	function closeWindow(index) { 
		_currentMobileStages[index].remove();
		_currentMobileStages.splice(index, 1);

		// ui remove
		_currentWindowDoms[index].remove();
		_currentWindowDoms.splice(index, 1);
		resizeWindows();
	}

	function resizeWindows() {
		var sizePos = calculateSubWindowSize(_currentMobileStages.length);

		// stage resize
		_currentMobileStages.forEach(function(mobileStage, i) {
			mobileStage.resizeWindow(sizePos[i]);
		});

		// ui resize
		sizePos = $.extend(true, [], sizePos);
		sizePos.forEach(function(item) {
			for (var pos in item) {
				item[pos] *= 100; item[pos] += '%'; 
			}
		});

		_currentWindowDoms.forEach(function($windowDom, i) { 
			$windowDom.animate(sizePos[i], 1000); 
		});
	}

	function lock() {
		_currentMobileStages.forEach(function(mobileStage, i) {
			mobileStage.lock(i === 0);
		});

		_lockTick = that.addTick(function() {
			var sizeInfo = _currentMobileStages[0].getSize();
			_currentMobileStages.forEach(function(mobileStage, i) {
				if (i > 0) mobileStage.setSize(sizeInfo);
			});
		});
	}

	function unlock() {
		_currentMobileStages.forEach(function(mobileStage, i) {
			mobileStage.unlock();
		});
		that.removeTick(_lockTick); _lockTick = null;
	}


});

module.exports = Display;

