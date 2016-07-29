require('../css/common.scss');

window.M3 = {};
(function() {
	var View = require('./view.js');


	var ViewUpdate = require('./update-tip.js');



	// todo: webgl 检查
	if (false) {
		// ViewUpdate
		return;
	} else {
		document.getElementById('updateTips').style.display = 'none';
	}

	// 基本场景
	M3.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});

	M3.scene = new THREE.Scene();
    document.body.appendChild(M3.renderer.domElement);
    M3.renderer.setClearColor(0x2abced, 0);

	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;

	M3.renderer.setSize(winWidth, winHeight);

	var MainView = View.extend(function() {
		this.active;
		this.constructor = function() {
			this.super();
		}
		this.activate = function() {
			this.active = true;
			this.activateView('display-manager', {productDatas:CONFIG.products.slice(0,4),'cameraPos': new THREE.Vector3(0,0,0)});

			//this.activateView('display-room');
			// this.activateView('list');
		}
		this.resize = function() {
			var winWidth = window.innerWidth;
			var winHeight = window.innerHeight;

			M3.renderer.setSize(winWidth, winHeight);
		}
	});
	var mainView = new MainView;
	mainView.activate();

})();

