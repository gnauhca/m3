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
	M3.renderer = new THREE.WebGLRenderer();
	M3.scene = new THREE.Scene();
    document.body.appendChild(M3.renderer.domElement);
    M3.renderer.setClearColor(0x000000);



	var list = new List();
	list.activate();	
})();
