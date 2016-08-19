var ViewManager = Class.extend(function() {
    var _viewConstructors = {
        'index': require('./index.js'),
        'select': require('./product-preview.js'),
        'display': require('./display.js'),
    };

	var _views = {};

	this.constructor = function() {

		// 所有 view 及其管理的 stages 相应窗口变化
		window.addEventListener('resize', (function() {
		    var winWidth;
		    var fontSize;
		    var htmlElem = document.querySelector('html');
		    function resize() {
		        winWidth = window.innerWidth;
		        fontSize = winWidth / 100;
		        fontSize = fontSize > 10 ? 10 : (fontSize < 5 ? 5 : fontSize);
		        htmlElem.style.fontSize = fontSize + 'px';

		        for (var name in _views) {
		            _views[name].active && _views[name].resize();
		            _views[stages].forEach(function(stage) {
		            	stage.resize && stage.resize();
		            });
		        }
		    }
		    resize();
		    return resize;
		})());
	}

    this.activateView = function(name, data) {
        var view = this.getView(name);
        view.activate(data);
    }

    this.inactivateView = function(name, data) {
        var view = this.getView(name);
        view.inactivate(data);
    }

    this.getView = function(name) {
        if (!_views[name]) {
            _views[name] = new _viewConstructors[name]();
        }
        return _views[name];
    }

});

module.exports = new ViewManager;


