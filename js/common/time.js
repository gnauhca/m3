
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
			if (!body.isStop) {
				body.ticks.forEach(function(tick) {
					tick.fn && tick.fn(detal); 
				});
			}
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
	this.isStop = false;

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

		tick.isStop = false;
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

	/*
	 * tweenObj
	 */
	this.addTHREEObjTween = function(threeObj, target, dur, tweenObj) {		
		var that = this;
		var init = {};
		var des = {};

        var keys = ['position', 'rotation', 'scale'];
        var attrs = ['x', 'y', 'z'];
		var des = [];

		keys.forEach(function(key) {
			if (target[key]) {
				attrs.forEach(function(attr) {
					init[key + '___' + attr] = threeObj[key][attr];
					des[key + '___' + attr] = target[key][attr];
				});			
			}
		});
		if (target.lookAt) {
			var lookAt = new THREE.Vector3(0, 0, -1);
        		
        	lookAt.applyEuler(threeObj.rotation, threeObj.eulerOrder);
        	lookAt.add(threeObj.position);
			attrs.forEach(function(attr) {
				init['lookAt___' + attr] = lookAt[attr];
				des['lookAt___' + attr] = target['lookAt'][attr];
			});		
		}

		var tween;
		var tKeys = ['easing', 'onUpdate', 'onComplete'];

		tweenObj = tweenObj || {};
		tween = new TWEEN.Tween(init)
		tween.to(des, dur)
			.easing(tweenObj.easing||TWEEN.Easing.Cubic.InOut)
			.onUpdate(function() {
				var current = this;
				var lookAt = {};
				var k;
				var a;
				for (var key in current) {
					if (key.indexOf('___') > 0) {
						k = key.split('___')[0];
						a = key.split('___')[1];
						if (k === 'lookAt') {
							lookAt.a = current[key];
						} else {
							threeObj[k][a] = current[key];
						}
					}
				}
				if (lookAt.x) {
					threeObj.lookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z));
				}
				tweenObj.onUpdate && tweenObj.onUpdate();
			})
			.onComplete(function() {
				that.removeTween(tween);
				tweenObj.onComplete && tweenObj.onComplete();
			});

		this.tweens.push(tween);
		return tween;
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

		//tween.stop();
		if (index !== -1) {
			this.tweens.splice(index, 1);
		}
	}

	// stop 暂停时间
	this.stop = function() {
		this.isStop = true;
		this.tweens.forEach(function(tween) {
			tween.stop();
		});
	}

	this.start = function() {
		this.isStop = false;
		this.tweens.forEach(function(tween) {
			tween.start();
		});
	}
});

module.exports = TimeBody;








