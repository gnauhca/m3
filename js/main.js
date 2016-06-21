(function() {
	var ViewUpdate = require('./update-tip.js');
	var ViewList = require('./view-list.js');
	var ViewDisplayManager = require('./view-display-manager');


	// todo: webgl 检查
	if (false) {
		// ViewUpdate
		return;
	} else {
		document.getElementById('updateTips').style.display = 'none';
	}


	// 基本场景
	var renderer = new THREE.WebGLRenderer();
	var scene = new THREE.Scene();
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x000);
	/*var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;
	renderer.setSize(winWidth, winHeight);






    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);

	camera.position.set(0, 0, 50);
	camera.lookAt(new THREE.Vector3(0,0,0));

	scene.add(camera); 

    var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.rotation.y = -0.2 * Math.PI;


    // add the cube to the scene
    scene.add(cube);
    renderer.render(scene, camera);*/


	var viewDisPlayManager = new ViewDisplayManager(renderer, scene);
	var viewList = new ViewList(renderer, scene);

	viewDisPlayManager.viewListId = viewList.getViewId();
	viewList.viewDisPlayManagerId = viewDisPlayManager.getViewId();

	viewList.activate();	
})();
