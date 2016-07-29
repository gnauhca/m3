var TimeBody = require('./time.js');
var views = [];

var viewConstructors;

var View = TimeBody.extend(function() {
    this.active = false;
    this.getName = function() {
        if (!this.name) {
            this.name = 'm3view' + parseInt(Math.random() * 100000);
        }
        return this.name;
    }

    this.constructor = function() {
        this.getName();
        views[this.name] = this;
        this.super();

        viewConstructors = {
            'welcome': require('./welcome.js'),
            'product-preview': require('./product-preview.js'),
            'display-manager': require('./display-manager.js'),
            'display-window': require('./display-window.js'),
            'display-room': require('./display-room.js'),
            'list': require('./list.js')
        };
    }

    this.activateView = function(name, data) {
        if (!views[name]) {
            views[name] = new viewConstructors[name]();
            views[name].name = name;
        }
        views[name].activate(data);
        
    }

    this.inactivateView = function(name, data) {
        if (!views[name]) {
            views[name] = new viewConstructors[name]();
        }
        views[name].inactivate(data);
    }

    this.getView = function(name) {
        if (!views[name]) {
            views[name] = new viewConstructors[name]();
        }
        return views[name];
    }

    this.activate = function(data) {}

    this.inactivate = function() {}

    this.resize = function() {}

    this.distroy = function() {
        this.super.distroy();
        delete views[this.name];
    }

});

View.addConstructor = function(name, _constructor) {
    viewConstructors[name] = _constructor
}




window.onresize = (function() {

    var winWidth;
    var fontSize;
    var htmlElem = document.querySelector('html');


    function r() {
        winWidth = window.innerWidth;
        fontSize = winWidth/100;
        fontSize = fontSize > 10 ? 10 : (fontSize < 5 ? 5 : fontSize);
        htmlElem.style.fontSize = fontSize + 'px';

        for (var name in views) {
            views[name].active && views[name].resize();
        }        
    }
    r();
    return r;
})();

module.exports = View;





































