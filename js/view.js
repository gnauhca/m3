var views = [];

var View = Class.extend(function() {
    this.constructor  function() {
        this._id = parseInt(Math.random() * 100000000);
        views[this._id] = this;
    }

    this.changeView = function(viewname, data) {
        views[viewname].activate(data);
    }

    this.activate = function(data) {
        
    }

    this.getViewId = function() {
        return this._id;
    }

    this.distroy = function() {
        delete views[this._id];
    }

});

module.exports = View;





































