var Time = require('time');

var Stage = Time.extend(function() {
	this.objects = {};
	this.state; // unload, loading, setup, animate
	this.isInit = false;
	this.scene;

	this.constructor = function() {
		this.super();

		// 如果不使用默认的 M3 scene 重写constructor 设置新的scene
		this.scene = M3.scene;
		this.camera = M3.camera;
	}

	// 加载，接受 进度回调， 成功回调
	this.load = function(onProgress, onSuccess) {

	}

	// 装载 3d 对象
	this.init = function(onProgress, onSuccess) {
		
	}

	this.resize = function() {
		
	}

	// 从 M3.scene 中移除
	this.remove = function() {
		for (var name in this.objects) {
			this.scene.remove(this.objects[name]);
		}
	}

	this.destory = function() {
		this.super(); // remove tick of time
		this.remove();
		for (var name in this.objects) {
			delete this.objects[name];
		}
	}
});

module.exports = Stage;