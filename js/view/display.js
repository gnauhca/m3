import View from './view.js';
import MobileStage from '../stages/display-mobile.js';
// import DisplayContainerStage from '../stages/display-container.js';

class Display extends View {
	constructor() {
		super();
		this._lockTick;
		// this._containerStage; 
		this._progressView;

		this.name = 'display';
		this.isInit = false;
		this.active = false;

		// stages
		this._mobileStages = {}; // {pro6: xx, mx6: xx} for cache
		this._currentMobileStages = []; 
		this.stages = [];

		// UI
		this._$domWrap = $('#displayView');
		this._$domManager = $('.display-manager');

		this._$windowWrap = $('#displayWindowWrap');

		this._windowDoms = [];
		this._currentWindowDoms = [];

		this._progressView = M3.viewManager.getView('progress');
		// this._containerStage = new DisplayContainerStage();
		// this.stages.push(this._containerStage);
	}

	// data : {mobile: [pro5, mx6 ...]}
	activate(data) {
		// check self init
		if (!this.isInit) {
			this.init();
			// this._containerStage.init();
		}

		if (data) {
			var mobiles = $.extend(true, [], data.mobiles);
			this._currentMobileStages = [];
			mobiles.forEach(function(name, i) {
				if (!this._mobileStages[name]) {
					var mobileStage = new MobileStage(name);
					this._mobileStages[name] = mobileStage;
					this._currentMobileStages.push(mobileStage);
				}
			}.bind(this));

			// this._isload 如果检查到需要加载，会启动加载，并在加载完成之后调用回调
			if (!this._isLoad.bind(this)(this.activate.bind(this))) return;	
		}

		// all loaded 
		//this._containerStage.entry();// containerStage

		var sizePos = calculateSubWindowSize(this._currentMobileStages.length);
		var x = 0;
		var entryCount = 0;

		this._currentMobileStages.forEach(function(mobileStage, i, all) {
			var meshPos = new THREE.Vector3(x + (i - (all.length/2)) * 100, 0, 0);
			mobileStage.entry(meshPos, sizePos[i]).then(function() {
				entryCount++;
				if (entryCount === all.length) {
					// todo entry animate done
				}
			});
			that.stages.push(mobileStage);
		});
		this._createWindowUI();this._resizeWindows();

		// UI
		this._$domWrap.removeClass('none');

		this.active = true;
	}

	inActivate() {
		Object.keys(this.scene).forEach(function(o) { M3.scene.remove(that.scene[o]);});
		this.removeTick(sphereTick);

		this._$domWrap.addClass('none');
		this.activeWindows.forEach(function(activeWindow) {
			setTimeout(function() {activeWindow.inActivate();}, 0);
		});
		this.activeWindows.length = 0;

		// this._containerStage.leave();
		this.stages = [];
		this.active = false;
	}

	resize() {
		this._resizeWindows();
	}

	init() {
		var that = this;
		var $lockBtn = this._$domManager.find('.lock-btn');
		var $unlockBtn = this._$domManager.find('.unlock-btn');
		var $backBtn = this._$domManager.find('.back-btn');

		that.isInit = true;

		this._$domManager.on('click', '.setting-btn', function() {
			that._$domManager.addClass('show');
		});

		this._$domManager.on('click', '.lock-btn', function() {
			$lockBtn.addClass('none')
			$unlockBtn.removeClass('none');
			that._$domManager.removeClass('show');
			that.lock();
		});

		this._$domManager.on('click', '.unlock-btn', function() {
			$unlockBtn.addClass('none')
			$lockBtn.removeClass('none');
			that._$domManager.removeClass('show');
			that._unlock();
		});

		this._$domManager.on('click', '.back-btn', function() {
			that.inActivate();
			that.activateView('product-preview');
			that._$domManager.removeClass('show');
		});

		// windows
		this._$domWrap.on('click', '.reset-btn', function() {
			var index = $(this).parents('.display-window').index();
			that.resetWindow(index);
		});

		this._$domWrap.on('click', '.close-btn', function() { 
			var index = $(this).parents('.display-window').index();
			that._closeWindow(index);
		});

		this._$domWrap.on('click', '.color', function() {
			var index = $(this).parents('.display-window').index();
			var color = $(this).data('color');
			that._currentMobileStages[index].changeColor(color);
			$(this).addClass('selected').silbings().removeClass('selected');
		});
	}

	_isLoad(callback) {
		var unloadedCount = 0;
		var loaded = true;
		var loadingInfos = {};

		function loading() {
			var totalSize = 0;
			var loadedSize = 0;
			var progress;
			var loadingInfo;

			for (let name in loadingInfos) {
				loadingInfo = loadingInfos[name];
				totalSize += loadingInfo.size;
				loadedSize += loadingInfo.progress * loadingInfo.size;
			}

			progress = loadedSize/totalSize;
			this._showProgress(progress);
			if (unloadedCount === 0) {
				// loaded 
				callback(); this._progressView.inactivate();
			}
		}

		for (let name in this._mobileStages) {
			// loading
			if (!this._mobileStages[name].isInit) {
				loaded = false;
				unloadedCount++;
				loadingInfos[name] = {
					size: this._mobileStages[name].size,
					progress: 0
				};
				(function(_name) { 
					this._mobileStages[_name].init(function(progress) {
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
		if (!loaded) { this._progressView.activate(); }

		return loaded;
	}

	_showProgress(progress) {
		//console.log('display.js loading: ' + progress);
		this._progressView.setProgress(progress);
	} 

	_createWindowUI() {
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

		this._$windowWrap.html('');
		this._currentWindowDoms = [];
		this._currentMobileStages.forEach(function(mobileStage, i) {
			if (!this._windowDoms[i]) {
				this._windowDoms[i] = $(windowTemplate);
			}
			this._currentWindowDoms[i] = this._windowDoms[i];
			this._$windowWrap.append(this._currentWindowDoms[i]);

			colorHTML = '';
			mobileStage.getColors().forEach(function(color) {
				colorHTML += colorTemplate.replace(/\@color/g, color);
			});
			this._currentWindowDoms[i].find('.colors-control').empty().html(colorHTML);
		});
	}

	// 模型恢复初始状态
	resetWindow(index) {
		if (this._lockTick) {
			this._currentMobileStages[0].reset();
		} else {
			this._currentMobileStages[index].reset();
		}
	}

	_closeWindow(index) { 
		this._currentMobileStages[index].remove();
		this._currentMobileStages.splice(index, 1);

		// ui remove
		this._currentWindowDoms[index].remove();
		this._currentWindowDoms.splice(index, 1);
		this._resizeWindows();
	}

	_resizeWindows() {
		var sizePos = calculateSubWindowSize(this._currentMobileStages.length);

		// stage resize
		this._currentMobileStages.forEach(function(mobileStage, i) {
			mobileStage.resizeWindow(sizePos[i]);
		});

		// ui resize
		sizePos = $.extend(true, [], sizePos);
		sizePos.forEach(function(item) {
			for (let pos in item) {
				item[pos] *= 100; item[pos] += '%'; 
			}
		});

		this._currentWindowDoms.forEach(function($windowDom, i) { 
			$windowDom.animate(sizePos[i], 1000); 
		});
	}

	_lock() {
		this._currentMobileStages.forEach(function(mobileStage, i) {
			mobileStage.lock(i === 0);
		});

		this._lockTick = that.addTick(function() {
			var sizeInfo = this._currentMobileStages[0].getSize();
			this._currentMobileStages.forEach(function(mobileStage, i) {
				if (i > 0) mobileStage.setSize(sizeInfo);
			});
		});
	}

	_unlock() {
		this._currentMobileStages.forEach(function(mobileStage, i) {
			mobileStage.unlock();
		});
		that.removeTick(this._lockTick); this._lockTick = null;
	}


}

export default Display;

