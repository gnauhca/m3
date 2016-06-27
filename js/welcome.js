var View = require('./view.js');
var Welcome = View.extend(function() {
	this.name = 'welcome';
	this.isInit = false;

	var that = this;
	var logoUrl = CONFIG.MEIZU_LOGO;
	var particleDatas = [];
	var camera; // 自身创建 camera
	var cloud;
	var baseCrood = new THREE.Vector3(0, 0, 0);
	var renderTick;

	this.constructor = function() {
		this.super();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

		M3.scene.add(camera);
	}

	this.activate = function() {
		if (!particleDatas.length) {
			var img = new Image();
			img.src = logoUrl;
			img.onload = function() {
				particleDatas = getParticlesData(img);
				createParticle();
				init();
			}
		} else {
			init();		
		}
	}

	this.inactivate = function() {
		//this.removeTick(renderTick); // 移除renderTick 
	}

	this.reset = function() {

		camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

		camera.position.set(0, 0, 250);
		camera.lookAt(baseCrood);
	}


	function init() {
		that.reset();
		playEntryAnimation(function() {
			that.activateView('product-preview');
		});	
		render();
	} 

	function getParticlesData(img) {
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
		        	'size': {'x': x, 'y': y}
		        });
		    }
		}

		// 动画相关设置
		var circleNum = 4;
		var angleV = Math.PI * 2 / 3000; // 每秒转一圈, 转速
		var radiusV = 50; // 每旋转一圈半径增长长度

		particleDatas.forEach(function(particleData, i) {

			particleData.radiusV = radiusV;
			particleData.angleV = angleV * (0.8 + Math.random() * 0.4);
			particleData.percent = 0;
			particleData.delay = 2000 + (particleData.size.x * particleData.size.y) / 1;
			particleData.initRadius = Math.sqrt(particleData.size.x * particleData.size.x + particleData.size.y * particleData.size.y);
			particleData.angleY = Math.acos(particleData.size.y * Math.random()/particleData.initRadius); // 与 Y 轴夹角

			particleData.initAngle = particleData.size.x < 0 ? Math.PI : 0;
			particleData.currentAngle = particleData.initAngle;
			particleData.finalAngle = (circleNum + Math.random()) * Math.PI * 2// * (Math.random() > 0.5 ? 1 : -1);
			particleData.dur = (particleData.finalAngle - particleData.initAngle) / particleData.angleV;

		});

		return particleDatas;
	}

	function createParticle() {

        var geom = new THREE.Geometry();
        var material = new THREE.PointCloudMaterial({
            size: 1,
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
        M3.scene.add(cloud);
	}

	function playEntryAnimation(callback) {
		var timePass = 0;
		var aniDatas = $.extend(true, [], particleDatas);
		//aniDatas = [/*$.extend(true, [], particleDatas)[0], */aniDatas[aniDatas.length-1]];
		var aniDoneNum = 0;

		var aniTick = that.addTick(function(detal) {
			timePass += detal;
			aniDoneNum = 0;

			aniDatas.forEach(function(aniData, i) {
				if (timePass < aniData.delay || aniData.percent === 1) { if (aniData.percent === 1) aniDoneNum++; return; };
				aniData.percent = (timePass - aniData.delay) / aniData.dur;
				aniData.percent = aniData.percent > 1 ? 1 : aniData.percent;

				aniData.currentAngle = easing.easeInOutCubic(timePass - aniData.delay, aniData.initAngle, aniData.finalAngle, aniData.dur);

				aniData.currentRadius = Math.abs((aniData.currentAngle - aniData.initAngle) / (Math.PI * 2)) * aniData.radiusV + aniData.initRadius;

				aniData.size.y = aniData.currentRadius * Math.cos(aniData.angleY);
				aniData.size.x = aniData.currentRadius * Math.abs(Math.sin(aniData.angleY)) * Math.cos(aniData.currentAngle);
				aniData.size.z = aniData.currentRadius * Math.abs(Math.sin(aniData.angleY)) * Math.sin(aniData.currentAngle);

				cloud.geometry.vertices[i].set(aniData.size.x, aniData.size.y, aniData.size.z)

			});

			cloud.geometry.verticesNeedUpdate = true;

			if (aniDoneNum/aniDatas.length > 0.6 || timePass > 5000) {
				callback && callback(); callback = false;
			}

			cloud.rotation.x += 0.0005;
			cloud.rotation.y += 0.0005;
			cloud.rotation.z += 0.0005;
			if (aniDoneNum/aniDatas.length > 0.99) {
				//that.removeTick(aniTick);
			}
		});
	}

	// render 
	function render() {
		renderTick = that.addTick(function() {
			M3.renderer.render(M3.scene, camera);
		});
	}
});

module.exports = Welcome;


