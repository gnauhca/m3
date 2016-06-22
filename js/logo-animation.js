var Time = require('./time.js');

var Logo = Time.extend(function() {
	var that = this;
	var logoUrl = './assets/logo.png';
	var particleDatas = [];

	var scene;
	var cloud;

	this.constructor = function(_scene) {
		this.super();

		scene = _scene;

		var img = new Image();
		img.src = logoUrl;
		img.onload = function() {
			particleDatas = that.getParticlesData(img);
			createParticle();
		}
	}

	this.init = function() {
		initAni();
	}

	this.getParticlesData = function(img) {
		var particleDatas = [];
		var width = img.width;
		var height = img.height;

		// 从canvas 读取颜色信息，创建粒子
		var cvs = document.createElement('canvas');
		cvs.width = width;
		cvs.height = height;
		var ctx = cvs.getContext('2d');

		ctx.drawImage(img, 0, 0);	

		var pixs = ctx.getImageData(0, 0, width, height).data;

		for (var i = 0; i < pixs.length; i += 4) {
		    var r = pixs[i],
		        g = pixs[i + 1],
		        b = pixs[i + 2],
		        a = pixs[i + 3];

		    if (b > 50) {
		        var x = (i % (4 * width)) / 4 - width/2;
		        var y = -(parseInt(i / (4 * width)) - height/2);

		        particleDatas.push({
		        	'color': 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')',
		        	//'color': '#abcdef',
		        	'size': {'x': x/5, 'y': y/5}
		        });
		    }
		}

		// 动画相关设置
		var circleNum = 2;
		var angleV = Math.PI * 2 / 3000; // 每秒转一圈, 转速
		var radiusV = 10; // 每旋转一圈半径增长长度

		particleDatas.forEach(function(particleData) {

			particleData.radiusV = radiusV;
			particleData.angleV = angleV * (0.8 + Math.random() * 0.4);
			particleData.percent = 0;
			particleData.delay = Math.random() * 3000;
			particleData.initRadius = Math.sqrt(particleData.size.x * particleData.size.x + particleData.size.y * particleData.size.y);
			particleData.angleY = Math.acos(particleData.size.y * Math.random()/particleData.initRadius); // 与 Y 轴夹角

			particleData.initAngle = particleData.size.x < 0 ? Math.PI : 0;
			particleData.currentAngle = particleData.initAngle;
			particleData.finalAngle = (circleNum + Math.random()) * Math.PI * (Math.random() > 0.5 ? 1 : -1);
			//particleData.finalAngle = particleData.initAngle + Math.PI * 2;
			particleData.dur = (particleData.finalAngle - particleData.initAngle) / particleData.angleV;

		});

		return particleDatas;
	}

	function createParticle() {

        var geom = new THREE.Geometry();
        var material = new THREE.PointCloudMaterial({
            size: 1/5,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,

            sizeAttenuation: true,
            color: 0xffffff
        });

		particleDatas.forEach(function(particleData) {
			var particle = new THREE.Vector3(particleData.size.x, particleData.size.y, 0);
			geom.vertices.push(particle);

			var color = new THREE.Color(particleData.color);
			geom.colors.push(color);
		});

        cloud = new THREE.PointCloud(geom, material);
        cloud.name = "particles";
        scene.add(cloud);
	}

	function initAni() {
		var timePass = 0;
		var aniDatas = $.extend(true, [], particleDatas);
		//aniDatas = [/*$.extend(true, [], particleDatas)[0], */aniDatas[aniDatas.length-1]];
		var aniDone;

		var aniTick = that.addTick(function(detal) {
			timePass += detal;
			aniDone = true;

			aniDatas.forEach(function(aniData, i) {
				aniDone = aniData.percent !== 1 ? false : aniDone;
				if (timePass < aniData.delay || aniData.percent === 1) return;
				aniData.percent = (timePass - aniData.delay) / aniData.dur;
				aniData.percent = aniData.percent > 1 ? 1 : aniData.percent;

				aniData.currentAngle = easing.easeInOutCubic(timePass - aniData.delay, aniData.initAngle, aniData.finalAngle, aniData.dur);

				aniData.currentRadius = ((aniData.currentAngle - aniData.initAngle) / (Math.PI * 2)) * aniData.radiusV + aniData.initRadius;

				aniData.size.y = aniData.currentRadius * Math.cos(aniData.angleY) * (1 + aniData.percent*3);
				aniData.size.x = aniData.currentRadius * Math.abs(Math.sin(aniData.angleY)) * Math.cos(aniData.currentAngle);
				aniData.size.z = aniData.currentRadius * Math.abs(Math.sin(aniData.angleY)) * Math.sin(aniData.currentAngle);

				cloud.geometry.vertices[i].set(aniData.size.x, aniData.size.y, aniData.size.z)

				//console.log(aniData.size.x, aniData.size.y, aniData.size.z, aniData.currentRadius);
			});

			cloud.geometry.verticesNeedUpdate = true;

			if (aniDone) {
				that.removeTick(aniTick);
			}
		});
	}

});

module.exports = Logo;


