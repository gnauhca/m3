var Time = require('time');

var Stage = Time.extend(function() {
	this.objects = {};
	this.state; // unload, loading, setup, animate

	this.scene;

	this.constructor = function() {
		this.super();
		this.scene = M3.scene;
		// 如果不使用默认的 M3 scene 重写constructor 设置新的scene
	}

	// 加载，接受 进度回调， 成功回调
	this.load = function(onProgress, onSuccess) {

	}

	this.setup = function() {
		// 装载 3d 对象
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