window.M3 = {};
(function() {
	require('../css/common.scss');

	var ViewUpdate = require('./update-tip.js');
	var List = require('./list.js');
	var DisplayManager = require('./display-manager');

	// todo: webgl 检查
	if (false) {
		// ViewUpdate
		return;
	} else {
		document.getElementById('updateTips').style.display = 'none';
	}


	// 基本场景
	M3.renderer = new THREE.WebGLRenderer({ antialias: true });

	M3.scene = new THREE.Scene();
    document.body.appendChild(M3.renderer.domElement);
    M3.renderer.setClearColor(0x000000);

	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;

	M3.renderer.setSize(winWidth, winHeight);

	var list = new List();
	list.activate();	

	// var displayManager = new DisplayManager();
	// displayManager.activate({productDatas:CONFIG.products.slice(0,2),'cameraPos': new THREE.Vector3(0,0,0)});
})();
