import Progress from './progress.js';
// import Index from './index.js';
import Select from './select.js';
// import Display from './display.js';

var _viewConstructors = {
    'progress': Progress,
    'index': Index,
    'select': Select,
    'display': Display,
};

var _views = {};


class ViewManager {

	constructor() {
		this.init();
	}

	init() {
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

		        for (let name in _views) {
		        	if (_views[name].active) { 
			            _views[name].resize();
			            _views[name].stages && _views[name].stages.forEach(function(stage) {
			            	stage.resize && stage.resize();
			            });		        		
		        	}

		        }
		    }
		    resize();
		    return resize;
		})());		
	}

    activateView(name, data) {
        var view = this.getView(name);
        view.activate(data);
    }

    inactivateView(name, data) {
        var view = this.getView(name);
        view.inactivate(data);
    }

    getView(name) {
        if (!_views[name]) {
            _views[name] = new _viewConstructors[name](this);
        }
        return _views[name];
    }

    removeView(view) {
    	delete views[view.name];
    }

});

export default ViewManager;


