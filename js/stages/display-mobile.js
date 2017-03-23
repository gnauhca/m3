import Stage from './stage.js';
import Mobile from './mobile.js';
import TrackballControls from 'm3-trackballcontrol.js';

class DisplayMobile extends Stage {

	constructor(mobileName, position) {
		super();
		this._windowSize; // for px calculate
		this._winSizePX; // for render 

		// 3D 资源
		this._camera;
		this._mobile;

		this.name; // pro5?
		this.size;
		this.isInit = false;

		this.trackball;
		this.objects = {};
		this.target = position.clone();

		// 模型位置，旋转等信息
		this.objectSizes = {
			model : {position: null, rotation: null},
			camera : {position: null, lookAt: null}
		};

		// 状态
		this.state;

		this.color;

		this.locked = false;
		this.active = false;

		this.name = mobileName;
		this._mobile = new Mobile(this.name);
		this.size = this._mobile.size;
	}

	load(onProgress) {
		return this._mobile.load(onProgress);
	}

	init(onProgress) {
		var that = this;
		return this.load(onProgress).then(function() {
			return new Promise(function(resolve, reject) {
				// init
				that.objects.mesh = that._mobile.mesh;
				that._setupScene();
				that.isInit = true;
				resolve();
			});
		}).catch(function(e) { console.log(e.stack); });;
	}

	entry(windowSize) {
		this._windowSize = windowSize;

        this.objects.mesh.position.copy(this.target);
		
        this.objects.mesh.rotation.copy(new THREE.Euler(-Math.PI/6, -0.4, -0.2, 'XYZ' ));
        this._camera.up.copy(M3.camera.up);
        this._camera.position.copy(M3.camera.position);
		this._camera.position.z += 40;
		this._camera.lookAt(THREE.THREEUtil.getLookAt(M3.camera));

		// light
        this.objects.spotLight.position.copy(this.target);
        this.objects.spotLight.position.y += 200;
        this.objects.spotLight.position.x += 200;
        this.objects.spotLight.position.z += 100;
        this.objects.spotLight.lookAt(this.target); 

		// light2
        this.objects.spotLight2.position.copy(this.target);
        this.objects.spotLight2.position.y -= 200;
        this.objects.spotLight2.position.x -= 300;
        this.objects.spotLight2.position.z -= 100;
        this.objects.spotLight2.lookAt(this.target); 



		// initial size info
		this.objectSizes = {mesh: {}, camera: {}};
		this.objectSizes.mesh.position = this.objects.mesh.position.clone();
		this.objectSizes.mesh.rotation = this.objects.mesh.rotation.clone();

		this.objectSizes.camera.position = this.objects.mesh.position.clone();
		this.objectSizes.camera.position.z += 50;
		this.objectSizes.camera.lookAt = this.objects.mesh.position.clone();

		// 添加到场景
		Object.keys(this.objects).forEach(function(o) { M3.scene.add(this.objects[o]);}.bind(this));
		
		this.resize();

		this._changeColor();
		this.addTick(this._render.bind(this));

		return this._playEntryAnimation();
	}

	// 窗口关闭
	leave() {

		// 移除模型
		console.log(Object.keys(this.objects));
		Object.keys(this.objects).forEach(function(o) { M3.scene.remove(that.objects[o]);});
		// render();
		this.$domElem.remove();
		this.getView('display-manager').removeWindow(this);
		this.removeTween();
		this.removeTick();
		this.active = false;
	}

	// 窗口重置
	resize() {
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		this._winSizePX = {};
		this._winSizePX['left'] = parseInt(winWidth * this._windowSize['left']);
		this._winSizePX['width'] = parseInt(winWidth * this._windowSize['width']);
		this._winSizePX['top'] = parseInt(winHeight * this._windowSize['top']);
		this._winSizePX['height'] = parseInt(winHeight * this._windowSize['height']);

		this._winSizePX['bottom'] = winHeight - this._winSizePX['height'] - this._winSizePX['top'];

		this._camera.setFovAndAspect(this._winSizePX['width'] / this._winSizePX['height']);
		this.trackball.handleResize(this._winSizePX);
	}

	resizeWindow(windowSize) {
		var that = this;
		var initSize = this._windowSize;
		var finalSize = windowSize;

		this.setState('animate');
		var resizeTween = new TWEEN.Tween(initSize).easing(TWEEN.Easing.Cubic.InOut).to(finalSize, 1000).onUpdate(function() {
			that._windowSize = this;
			that.resize();
		}).onComplete(function() {
			that.removeTween(resizeTween);
			that.setState('handle');
		}).start();
	}

	setState(state) { 
		this.state = state;
		if (state === 'handle') { 
			this.trackball.init(this._camera, this.objects.mesh);
			this.resize(); 
			!this.locked && this.trackball && (this.trackball.enabled = true);
		} else {
			!this.locked && this.trackball && (this.trackball.enabled = false);
		}
	}

	// 获取模型旋转信息，相机相对信息，用于设置其他 displayWindow 使表现一致；
	getSize() {
		var size = {};

		size.modelRotation = this.objects.mesh.rotation.clone();
		size.cameraRotation = this._camera.rotation.clone();
		size.cameraUp = this._camera.up.clone();
		size.eye = (new THREE.Vector3).subVectors(this._camera.position, this.objects.mesh.position);

		return size;
	}

	setSize(size) {
		this.objects.mesh.rotation.copy(size.modelRotation);
		// this._camera.rotation.copy(size.cameraRotation);
		// this._camera.up = size.cameraUp;
		this._camera.position.addVectors(this.objects.mesh.position, size.eye);
		this._camera.lookAt(this.objects.mesh);
	}

	lock(isMain) {
		this.locked = true;
		if (isMain) {
			this.trackball.enabled = true;
			this.trackball.fullScreen = true;
		} else {
			this.trackball.enabled = false;
		}
		this.reset();
	}

	unlock() {
		this.locked = false;

		this.trackball.enabled = true;
		this.trackball.fullScreen = false;
		this.reset();
	}

	getColors() {
		if (this._mobile) {
			return this._mobile.getColors();
		}
	}

	/*
	 * 从scene 中移除模型
	 */
	remove() {
		super.remove();
		this.removeTick();
	}

	// model，trackball 重置
	reset() { 
		//console.log(this.objectSizes.mesh.position);
		this.setState('animate');
		
		var initModelRotation = this.objectSizes.mesh.rotation;
		var initCameraPosition = this.objectSizes.camera.position;
		var initCameraLookAtPosition = this.objectSizes.camera.position;

		this.objects.mesh.animate({
        	rotation: initModelRotation
        }, 1000);
		
		this._camera.animate({
        	position: initCameraPosition,
        	lookAt: initCameraLookAtPosition
        }, 1000, 0, {
        	onComplete: function() {
        		this.setState('handle');
        	}.bind(this)
        });   
	}

	_setupScene() {

		// 3D 相关资源创建
 		this.objects.spotLight = new THREE.SpotLight(0xeeeeee);
 		this.objects.spotLight.intensity = 1.5;

 		this.objects.spotLight2 = new THREE.SpotLight(0xeeeeee);
 		this.objects.spotLight2.intensity = 1.0;
		 
		this._camera = new THREE.PerspectiveCamera(53, window.innerWidth / window.innerHeight, 0.1, 1000);


        this.trackball = new TrackballControls(this._camera);
        // this.trackball.enabled = false;
	}

	_changeColor(color) {
		this._mobile.changeColor(color);
	}

	/* 动画 */
	_playEntryAnimation() {
		var that = this;
		return new Promise(function(resolve, reject) {
			that.setState('animate');

			var initModelRotation = that.objectSizes.mesh.rotation;
			var initCameraPosition = that.objectSizes.camera.position;

			that.objects.mesh.rotation.copy(initModelRotation);
			that.objects.mesh.rotation.x -= Math.PI * 0.5;
			that.objects.mesh.rotation.z += Math.PI * 1.2;
			that.objects.mesh.animate({
				rotation: initModelRotation
			}, 2000);

			that._camera.animate({
				position: initCameraPosition
			}, 2000, 0, {
				onComplete: function() {
					that.setState('handle');
					resolve();
				}
			});
		});
	}

	_render() {

		M3.renderer.setViewport(this._winSizePX['left'], this._winSizePX['bottom'], this._winSizePX['width'], this._winSizePX['height']);
		M3.renderer.setScissor(this._winSizePX['left'], this._winSizePX['bottom'], this._winSizePX['width'], this._winSizePX['height']);
		M3.renderer.setScissorTest(true);
		this._camera.aspect = this._winSizePX['width'] / this._winSizePX['height'];
		this._camera.updateProjectionMatrix();
		M3.renderer.render( M3.scene, this._camera );	
		this.trackball.update();		
	}
}

export default DisplayMobile;
