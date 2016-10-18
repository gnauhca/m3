/* 时间 */
var TIME = {

	// 所有时间body对象
	bodys : []
}

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
	var delta;
	return (function() { 

		delta = now - last;
		delta = delta > 500 ? 30 : (delta < 16? 16 : delta);

		//console.log(TIME.bodys);
		TIME.bodys.forEach(function(body) {
			if (!body.isStop) {
				body.ticks.forEach(function(tick) {
					tick.fn && tick.fn(delta); 
				});
			}
		});

		TWEEN.update();
	});	
})();

window.TIME = TIME;


/* 时间物体类，提供两个时机，帧更新，固定间隔更新，每一个有时间概念的物体，就继承 */
class Time {

	constructor() {
		TIME.addBody(this);
		this.ticks = [];
		this.tweens = [];
		this.isStop = false;
	}


	/**
	 * 该物体灭亡
	 */
	destory() {
		TIME.removeBody(this);
	}

	/** 
	 * 帧更新
	 * @param timegap 与上一帧的时间间隔
	 */
	addTick(fn) {
		var tick = {'fn': fn.bind(this)};

		tick.isStop = false;
		this.ticks.push(tick);
		return tick;
	}

	removeTick(tick) {
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
	addTween(tween) {
		this.tweens.push(tween);
	}

	/*
	 * tweenObj
	 */
	addTHREEObjTween(threeObj, target, dur, tweenObj) {		
		var that = this;
		var init = {};
		var dest = {};
	    
	    var attrs = ['x', 'y', 'z', 'r', 'g', 'b', 'opacity'];
		var separater = '_';

		function setInit(key) {
			if (key.indexOf('lookAt') === -1) {
				let keyArr = key.split('_');
				let subObj = threeObj;

				keyArr.forEach(function(subKey) { subObj = subObj[subKey]; });
				init[key] = subObj;
			} else {
				init[key] = dest[key]; // lookAt
			}
		}


		for (let key in target) {
			let destKey = key;

			if (/color/i.test(key) > 0 && !(target[key] instanceof THREE.Color)) {
				target[key] = new THREE.Color(target[key]);
			}
			if (typeof target[key] === 'object') {
				for (let cKey in target[key]) {
					destKey = key;
					if (attrs.indexOf(cKey) !== -1) {
						destKey += '_' + cKey;
						dest[destKey] = target[key][cKey];
						setInit(destKey);
					}
				}
			} else {
				dest[destKey] = target[key];
				setInit(destKey);
			}
		}


		// console.log(init,dest);

		var tween;
		tweenObj = tweenObj || {};
		tween = new TWEEN.Tween(init)
		tween.to(dest, dur)
			.easing(tweenObj.easing || TWEEN.Easing.Cubic.InOut)
			.onUpdate(function() {
				let current = this;
				for (let currentKey in current) {
					if (currentKey.indexOf('lookAt') !== -1) {
						let lookAt = current[currentKey];
						threeObj.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
					}
					let keyArr = currentKey.split('_');
					let last = keyArr.pop();
					let subObj = threeObj;
					keyArr.forEach(function(key) { subObj = subObj[key]; });
					subObj[last] = current[currentKey];
				}
				tweenObj.onUpdate && tweenObj.onUpdate.call(this);
			})
			.onComplete(function() {
				var completeRemove = true;
				if (tweenObj.onComplete) {
					if (tweenObj.onComplete() === false)
					completeRemove = false;
				}

				completeRemove && that.removeTween(tween);
			});

		this.tweens.push(tween);
		return tween;
	}

	removeTween(tween) {
		if (!tween) {
			// remove all
			this.tween = [];
			return;
		}

		var index = this.tweens.indexOf(tween);

		if (index !== -1) {
			//tween.stop();
			this.tweens.splice(index, 1);
		}
	}

	// stop 暂停时间
	stop() {
		this.isStop = true;
		this.tweens.forEach(function(tween) {
			tween.stop();
		});
	}

	start() {
		this.isStop = false;
		this.tweens.forEach(function(tween) {
			tween.start();
		});
	}
}

export default Time;








