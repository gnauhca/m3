var Time = require('time');

var View = Time.extend(function() {
    this.active = false;
    this.stages; // 3d 对象

    this.constructor = function() {
        this.super();
    }

    // 激活视图，data 为接受的参数
    this.activate = function(data) {}

    // 冻结视图，data 为接受的参数
    this.inactivate = function(data) {}

    // 窗口大小变化的操作
    this.resize = function() {}

    this.distroy = function() {
        this.super.distroy();
        delete views[this.name];
    }

});

module.exports = View;





































