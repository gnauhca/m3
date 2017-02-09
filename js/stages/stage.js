import Time from '../common/time.js';

class Stage extends Time {

	constructor() {
		super();

		this.objects = {};
		this.state; // unload, loading, setup, animate
		this.isInit = false;
		this.scene;

		// 如果不使用默认的 M3 scene 重写constructor 设置新的scene
		this.scene = M3.scene;
		this.camera = M3.camera;
	}

	// 加载，接受 进度回调， 成功回调
	load(onProgress, onSuccess) {

	}

	// 装载 3d 对象
	init(onProgress, onSuccess) {
		
	}

	resize() {
		
	}

	// 从 M3.scene 中移除
	remove() {
		for (var name in this.objects) {
			this.scene.remove(this.objects[name]);
		}
	}

	destory() {
		super.destory(); // remove tick of time
		this.remove();
		for (var name in this.objects) {
			delete this.objects[name];
		}
	}
}

export default Stage;