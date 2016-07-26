/* 时间 */
var TIME = {

	// 所有时间body对象
	bodys : []
}

;(function() {

stop = false;
TIME.addBody = function(timeBody) {
	this.bodys.push(timeBody);
}

TIME.removeBody = function(timeBody) {
	var index = this.bodys.indexOf(timeBody);

	if (index !== -1) {
		this.bodys.splice(index, 1);
	}
}

TIME.tick = function() {
	TIME.handleFrame();

	if (!stop) {
		requestAnimationFrame(TIME.tick);
		//setTimeout(TIME.tick, 20);
	}
}

TIME.start = function() {
	stop = false;
	this.tick();
}

TIME.stop = function() {
	stop = true;
}

TIME.handleFrame = (function() { 
	var now = (new Date()).getTime();
	var last = now;
	var detal;
	return (function() {

		detal = now - last;
		detal = detal > 500 ? 30 : (detal < 16? 16 : detal);

		//console.log(TIME.bodys);
		TIME.bodys.forEach(function(body) {
			body.ticks.forEach(function(tick) {
				tick.fn && tick.fn(detal);
			});
		});

		TWEEN.update();
	});	
})();

})();

TIME.tick();


/* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
var TimeBody = Class.extend(function TimeBody() {
	var that = this;

	this.ticks = [];
	this.tweens = [];
	this.stop = false;

	this.constructor = function() {
		TIME.addBody(this);
	}

	/**
	 * 该物体灭亡
	 */
	this.destory = function() {
		TIME.removeBody(this);
	}

	/** 
	 * 帧更新
	 * @param timegap 与上一帧的时间间隔
	 */
	this.addTick = function(fn) {
		var tick = {'fn': fn};

		this.ticks.push(tick);
		return tick;
	}

	this.removeTick = function(tick) {
		if (!tick) {
			// remove all
			this.ticks = [];
			return;
		}

		var index = this.ticks.indexOf(tick);

		if (index !== -1) {
			this.ticks.splice(index, 1);
		}
	}

	/** 
	 * tween
	 */
	this.addTween = function(tween) {
		this.tweens.push(tween);
	}

	this.addTween3 = function(THREEObject, to, dur) {

	}


	this.removeTween = function(tween) {
		if (!tween) {
			// remove all
			this.tween = [];
			return;
		}

		var index = this.tweens.indexOf(tween);

		tween.stop();
		if (index !== -1) {
			this.tweens.splice(index, 1);
		}
	}

	// sleep 暂停时间
	this.sleep = function() {
		this.stop = true;
		this.tweens.forEach(function(tween) {
			tween.stop();
		});
	}

	this.wake = function() {
		this.stop = false;
		this.tweens.forEach(function(tween) {
			tween.start();
		});
	}
});

module.exports = TimeBody;








