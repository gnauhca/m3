import ViewManager from './view/view-manager.js';
import Time from 'time.js';
import Loader from 'loader.js';
import {ASSETS} from 'config.js'

require('../css/m3.scss');//return;

// require('../assets/mobiles/pro5/pro5.js');
(function() { 

window.M3 = {};
M3.viewManager = new ViewManager();

// todo: webgl 检查
// ...
var loader = new Loader();
var progressView = M3.viewManager.getView('progress');
progressView.activate();



//        var textureCube = THREE.ImageUtils.loadTextureCube( urls );



loader.load(ASSETS, function(percent) {
	progressView.setProgress(percent);
}).then(function(assets) {
	M3.assets = assets;
	progressView.inactivate();

	// envMap
	M3.assets.envMap = new THREE.CubeTexture(
		[
			M3.assets.envPosX.texture,
			M3.assets.envNegX.texture,
			M3.assets.envPosY.texture,
			M3.assets.envNegY.texture,
			M3.assets.envPosZ.texture,
			M3.assets.envNegZ.texture
		],
		THREE.CubeReflectionMapping
	);

	var urls = [
		ASSETS.envPosX.url,
		ASSETS.envNegX.url,
		ASSETS.envPosY.url,
		ASSETS.envNegY.url,
		ASSETS.envPosZ.url,
		ASSETS.envNegZ.url
	];
	var textureCube = THREE.ImageUtils.loadTextureCube(urls,  THREE.CubeReflectionMapping);
	M3.assets.envMap = textureCube;
	// console.log(M3.assets.envMap);
	
	
	appInit();


});

// appInit();

function appInit() {
	window.TIME.start();
	// 基本场景
	M3.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});

	M3.scene = new THREE.Scene();
	document.body.appendChild(M3.renderer.domElement);
	M3.renderer.setClearColor(0x2abced, 0);

	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;

	M3.renderer.setSize(winWidth, winHeight);


	M3.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);


	/* fog */
	var fog = new THREE.Fog(0x666666, 0, 2000);
	// M3.scene.fog = fog;

 	var spotLight = new THREE.SpotLight(0xffffff);
 	spotLight.intensity = 0.8;
 	spotLight.position.set(-300, 500, 200);
 	spotLight.lookAt(new THREE.Vector3); 
	M3.scene.add(spotLight);



	window.addEventListener('resize', function() {
		winWidth = window.innerWidth;
		winHeight = window.innerHeight;
		M3.camera.aspect = winWidth / winHeight;
		M3.camera.updateProjectionMatrix();
		M3.renderer.setSize(winWidth, winHeight);
	});



	/* helper */
	// var size = 400;
	// var step = 10;
	// var axisHelper = new THREE.AxisHelper( 100 );
	// M3.scene.add( axisHelper );
	/* grid helper */
	// var gridHelperX = new THREE.GridHelper( size, step, 0xff0000 );
	// gridHelperX.rotation.z = Math.PI / 2;
	// M3.scene.add( gridHelperX );

	// var gridHelperY = new THREE.GridHelper( size, step, 0x00ff00 );
	// M3.scene.add( gridHelperY );

	// var gridHelperZ = new THREE.GridHelper( size, step, 0x0000ff );
	// gridHelperZ.rotation.x = Math.PI / 2;
	// M3.scene.add( gridHelperZ );

	function initStats() {

		var stats = new Stats();

		stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.zIndex = 100000;
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild(stats.domElement);
		return stats;
	}
	var stats = initStats();

	// main render tick
	var m3Time = new Time();

	M3.time = new Time();
	M3.time.addTick(function() {
		stats.update();
		M3.renderer.render(M3.scene, M3.camera);
	});


	// M3.viewManager.activateView('index');
	// M3.viewManager.activateView('display', {mobiles: [
	// 	{'name': 'pro5', 'position': new THREE.Vector3(0, 0, 0)},
	// 	{'name': 'pro6', 'position': new THREE.Vector3(100, 0, 0)},
	// 	{'name': 'mx6', 'position': new THREE.Vector3(200, 0, 0)}
	// ]});
	M3.viewManager.activateView('select');	
}

})();













