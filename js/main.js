import ViewManager from './view/view-manager.js';
import Time from 'time.js';
import Loader from 'loader.js';
import {ASSETS} from './config/config.js'

require('../css/m3.scss');//return;
require('../css/ionicons/css/ionicons.css');
// require('../assets/mobiles/pro5/pro5.js');


(function() { 

window.M3 = {};
M3.viewManager = new ViewManager();

// todo: webgl 检查
// ...
let loader = new Loader();
let progressView = M3.viewManager.getView('progress');
progressView.activate();



// let textureCube = THREE.ImageUtils.loadTextureCube( urls );

loader.load(ASSETS, function(percent) {
	// console.log(percent);
	progressView.setProgress(percent);
}).then(function(assets) {
	progressView.setProgress(1);
	
	
	M3.assets = assets;
	// excute preset.js
	let script = document.createElement('script');
	script.src = M3.assets.presetjs.src;
	script.onload = ()=>{
		appInit();
		progressView.inactivate();
	};
	document.body.appendChild(script);
});

// appInit();

function appInit() {
	window.TIME.start();
	// 基本场景
	M3.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});

	M3.scene = new THREE.Scene();
	document.body.appendChild(M3.renderer.domElement);
	M3.renderer.setClearColor(0x2abced, 0);

	let winWidth = window.innerWidth;
	let winHeight = window.innerHeight;

	M3.renderer.setSize(winWidth, winHeight);


	let urls = [
		M3.assets.envPosX.src,
		M3.assets.envNegX.src,
		M3.assets.envPosY.src,
		M3.assets.envNegY.src,
		M3.assets.envPosZ.src,
		M3.assets.envNegZ.src
	];
	let textureCube = new THREE.CubeTextureLoader().load(urls);
	textureCube.mapping = THREE.CubeReflectionMapping;
	M3.assets.envMap = textureCube;
	// console.log(M3.assets.envMap);



	M3.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);


	/* fog */
	let fog = new THREE.Fog(0x666666, 0, 2000);
	// M3.scene.fog = fog;

 	let spotLight = new THREE.SpotLight(0xffffff);
 	spotLight.intensity = 0.8;
 	spotLight.position.set(-100, 500, 200);
 	spotLight.lookAt(new THREE.Vector3); 
	M3.scene.add(spotLight);

	let light = new THREE.AmbientLight( 0x666666 ); // soft white light
	M3.scene.add( light );


	function resize() {
		winWidth = window.innerWidth;
		winHeight = window.innerHeight;
		M3.camera.setFovAndAspect(winWidth / winHeight);
		M3.renderer.setSize(winWidth, winHeight);
	}
	resize();
	window.addEventListener('resize', resize);



	/* helper */
	// let size = 400;
	// let step = 10;
	// let axisHelper = new THREE.AxisHelper( 100 );
	// M3.scene.add( axisHelper );
	/* grid helper */
	// let gridHelperX = new THREE.GridHelper( size, step, 0xff0000 );
	// gridHelperX.rotation.z = Math.PI / 2;
	// M3.scene.add( gridHelperX );

	// let gridHelperY = new THREE.GridHelper( size, step, 0x00ff00 );
	// M3.scene.add( gridHelperY );

	// let gridHelperZ = new THREE.GridHelper( size, step, 0x0000ff );
	// gridHelperZ.rotation.x = Math.PI / 2;
	// M3.scene.add( gridHelperZ );

	function initStats() {

		let stats = new Stats();

		stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.zIndex = 100000;
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		// document.body.appendChild(stats.domElement);
		return stats;
	}
	let stats = initStats();

	// main render tick
	let m3Time = new Time();

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













