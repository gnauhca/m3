var TimeBody = require('./time.js');
var views = [];

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
    }

    this.activateView = function(name, data) {
        if (!views[name]) {
            var viewConstructors = {
                'welcome': require('./welcome.js'),
                'product-preview': require('./product-preview.js'),
                'display-manager': require('./display-manager.js'),
                'display-window': require('./display-window.js'),
                'list': require('./list.js')
            };
            views[name] = new viewConstructors[name]();
        }
        views[name].activate(data);
        
    }

    this.inactivateView = function(name, data) {
        if (!views[name]) {
            views[name] = new viewConstructors[name]();
        }
        views[name].inactivate(data);
    }

    this.activate = function(data) {}

    this.inactivate = function() {}

    this.reset = function() {}

    this.distroy = function() {
        this.super.distroy();
        delete views[this.name];
    }

});

View.addConstructor = function(name, _constructor) {
    viewConstructors[name] = _constructor
}

window.onresize = function() {
    for (var name in views) {
        views[name].active && views[name].reset();
    }
}

module.exports = View;





































