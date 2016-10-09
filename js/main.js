(function() { 
require('../css/common.scss');//return;

window.M3 = {};
M3.viewManager = require('./view/view-manager.js');

// todo: webgl 检查
//

// 基本场景
M3.renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true});

M3.scene = new THREE.Scene();
document.body.appendChild(M3.renderer.domElement);
M3.renderer.setClearColor(0x2abced, 0);

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

M3.renderer.setSize(winWidth, winHeight);


M3.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

// main render tick
var Time = require('time');
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


/* helper */
var axisHelper = new THREE.AxisHelper( 100 );
M3.scene.add( axisHelper );

var size = 400;
var step = 10;

// var gridHelperX = new THREE.GridHelper( size, step, 0xff0000 );
// gridHelperX.rotation.z = Math.PI / 2;
// M3.scene.add( gridHelperX );

// var gridHelperY = new THREE.GridHelper( size, step, 0x00ff00 );
// M3.scene.add( gridHelperY );

// var gridHelperZ = new THREE.GridHelper( size, step, 0x0000ff );
// gridHelperZ.rotation.x = Math.PI / 2;
// M3.scene.add( gridHelperZ );



// M3.viewManager.activateView('index');
// M3.viewManager.activateView('display', {mobiles: ['pro5'/*, 'pro6', 'mx5', 'mx6'*/]});
M3.viewManager.activateView('select');

})();













