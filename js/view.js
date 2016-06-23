var TimeBody = require('./time.js');
var views = [];

var View = TimeBody.extend(function() {
    this.constructor = function() {
        this._id = parseInt(Math.random() * 100000000);
        views[this._id] = this;
        this.super();
    }

    this.gotoView = function(viewId, data) {
        views[viewId].activate(data);
    }

    this.activate = function(data) {

    }

    this.getViewId = function() {
        return this._id;
    }

    this.distroy = function() {
        this.super.distroy();
        delete views[this._id];
    }

});

module.exports = View;





































