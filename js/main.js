import ViewManager from './view/view-manager.js';
import Time from 'time.js';
import Loader from 'loader.js';
import {ASSETS} from 'config.js'

require('../css/common.scss');//return;

// require('../assets/mobiles/pro5/pro5.js');
(function() { 

window.M3 = {};
M3.viewManager = new ViewManager();

// todo: webgl 检查
// ...
var loader = new Loader();
var progressView = M3.viewManager.getView('progress');
progressView.activate();
loader.load(ASSETS, function(percent) {
	progressView.setProgress(percent);
}).then(function(assets) {
	M3.assets = assets;
	progressView.inactivate();
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

	// main render tick
	var m3Time = new Time();

	M3.tick = m3Time.addTick(function() {
		M3.renderer.render(M3.scene, M3.camera);
	});


	window.addEventListener('resize', function() {
		winWidth = window.innerWidth;
		winHeight = window.innerHeight;
		M3.camera.aspect = winWidth / winHeight;
		M3.camera.updateProjectionMatrix();
		M3.renderer.setSize(winWidth, winHeight);
	});




	/* fog */
	var fog = new THREE.Fog(0x000000, 0, 2000);
	// M3.scene.fog = fog;

	var size = 400;
	var step = 10;

 	var spotLight = new THREE.SpotLight(0xffffff);
 	spotLight.intensity = 0.8;
 	spotLight.position.set(-300, 500, 200);
 	spotLight.lookAt(new THREE.Vector3); 
	M3.scene.add(spotLight);

	/* helper */
	var axisHelper = new THREE.AxisHelper( 100 );
	M3.scene.add( axisHelper );
	/* grid helper */
	// var gridHelperX = new THREE.GridHelper( size, step, 0xff0000 );
	// gridHelperX.rotation.z = Math.PI / 2;
	// M3.scene.add( gridHelperX );

	// var gridHelperY = new THREE.GridHelper( size, step, 0x00ff00 );
	// M3.scene.add( gridHelperY );

	var gridHelperZ = new THREE.GridHelper( size, step, 0x0000ff );
	gridHelperZ.rotation.x = Math.PI / 2;
	M3.scene.add( gridHelperZ );



	// M3.viewManager.activateView('index');
	// M3.viewManager.activateView('display', {mobiles: ['pro5', 'pro6'/*, 'mx5', 'mx6'*/]});
	M3.viewManager.activateView('select');	
}

})();













