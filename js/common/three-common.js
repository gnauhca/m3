THREE.THREEUtil = {

	getLookAt: function (mesh) {
		var lookAt = new THREE.Vector3(0, 0, -1);
		var euler = new THREE.Euler( 0, 0, 0, 'XYZ' )

		euler.copy(mesh.rotation);

		lookAt.applyEuler(euler);
		lookAt.add(mesh.position);
		return lookAt;
	},

}

// Object3DAnimate
var threeTime = new Time();
THREE.Object3D.prototype.animate = function(target, dur, delay=0, tweenObj) {
	var object3D = this;
	var init = {};
	var dest = {};
	
	var attrs = ['x', 'y', 'z', 'r', 'g', 'b', 'opacity'];
	var separater = '_';

	function setInit(key) {
		let keyArr = key.split('_');
		let subObj = object3D;

		keyArr.forEach(function(subKey) { subObj = subObj[subKey]; });
		init[key] = subObj;
	}

	if (object3D instanceof THREE.Vector3 && target instanceof THREE.Vector3) {
		// 向量
		['x', 'y', 'z'].forEach(function(pos) {
			init[pos] = object3D[pos];
			dest[pos] = target[pos];
		});
	} else {
		// object3d or material
		for (let key in target) {
			let destKey = key;

			if (key === 'lookAt') {
				let initLookAt = object3D.userData.lookAt || THREE.THREEUtil.getLookAt(object3D);
				['x','y','z'].forEach(function(lookAtKey) {
					init['lookAt_' + lookAtKey] = initLookAt[lookAtKey];
					dest['lookAt_' + lookAtKey] = target['lookAt'][lookAtKey];
				});
			} else {
				if (/color/i.test(key) > 0 && !(target[key] instanceof THREE.Color)) {
					target[key] = new THREE.Color(target[key]);
				}
				if (typeof target[key] === 'object') {
					for (let cKey in target[key]) {
						destKey = key;
						if (attrs.indexOf(cKey) !== -1) {
							destKey += '_' + cKey;
							dest[destKey] = target[key][cKey];
							setInit(destKey);
						}
					}
				} else {
					dest[destKey] = target[key];
					setInit(destKey);
				}
			}
		}
	}

	// console.log(init,dest);
	return new Promise(function(resolve) {
		var tween;
		tweenObj = tweenObj || {};
		tween = new TWEEN.Tween(init)
		tween.to(dest, dur)
			.easing(tweenObj.easing || TWEEN.Easing.Cubic.InOut)
			.onUpdate(function() {
				let current = this;
				for (let currentKey in current) {
					if (currentKey.indexOf('lookAt') === -1) {
						let keyArr = currentKey.split('_');
						let last = keyArr.pop();
						let subObj = object3D;
						keyArr.forEach(function(key) { subObj = subObj[key]; });
						subObj[last] = current[currentKey];
					}
				}

				if (current.lookAt_x) {
					object3D.lookAt(
						new THREE.Vector3(current.lookAt_x, current.lookAt_y, current.lookAt_z)
					);
				}
				tweenObj.onUpdate && tweenObj.onUpdate.call(this);
			})
			.onComplete(function() {
				var completeRemove = true;
				if (tweenObj.onComplete) {
					if (tweenObj.onComplete() === false)
					completeRemove = false;
				}

				object3D.userData.tweens = object3D.userData.tweens.filter(_tween=>_tween!==tween)
				completeRemove && threeTime.removeTween(tween);
				resolve();
			});

		object3D.userData = object3D.userData || {};
		object3D.userData.tweens =  object3D.userData.tweens||[];
		object3D.userData.tweens.push(tween);

		threeTime.tweens.push(tween);
		setTimeout(()=>tween.start(), delay);
	});
}

function stopAnimate() {
	if (this.userData && this.userData.tweens) {
		this.userData.tweens.forEach(tween=>threeTime.removeTween(tween));
		delete this.userData.tweens;
	}
	return this;
}

THREE.Material.prototype.animate = THREE.Object3D.prototype.animate;
THREE.Vector3.prototype.animate = THREE.Object3D.prototype.animate;
THREE.Object3D.prototype.stopAnimate = stopAnimate;
THREE.Material.prototype.stopAnimate = stopAnimate;
THREE.Vector3.prototype.stopAnimate = stopAnimate;

// custom material
THREE.GlowMaterial = (function() {
	var defaults = {
		c: 0.35,
		p: 5,
		o: 1,
		color: new THREE.Color,
		v: new THREE.Vector3,
		transparent: true,
		side: THREE.FrontSide
	};	
	var vertexShaderCode = document.getElementById('glowVertexShader').textContent;
	var fragmentShaderCode = document.getElementById('glowFragmentShader').textContent;

	return function(options) {
		options = $.extend({}, defaults, options);
		options.color = new THREE.Color(options.color);

		return new THREE.ShaderMaterial({
		    uniforms: {
		        "c": { type: "f", value: options.c },
		        "p": { type: "f", value: options.p },
		        "o": { type: "f", value: options.o },
		        glowColor: { type: "c", value: options.color },
		        viewVector: { type: "v3", value: options.v }
		    },
		    vertexShader: vertexShaderCode,
		    fragmentShader: fragmentShaderCode,
		    side: options.side,
		    blending: THREE.AdditiveBlending,
		    transparent: options.transparent
		});
	}


})();

THREE.CustomMaterial = {};
var materialsJSON = {
    "uvs": [[]], 
    "faces": [], 
    "vertices": [], 
    "materials": [{
        "opacity": 0.57398338317871094, 
        "specularCoef": 37.46666717529297, 
        "blending": "NormalBlending", 
        "depthTest": true, 
        "colorDiffuse": [0.0, 0.0, 0.0], 
        "vertexColors": false, 
        "colorSpecular": [0.5470054149627686, 0.5470054149627686, 0.5470054149627686], 
        "shading": "Phong", 
        "transparent": true, 
        "depthWrite": true, 
        "DbgName": "glass", 
        "reflectivity": 1.0
    }]
};
var materials = (new THREE.JSONLoader).parse(materialsJSON).materials;
materials.forEach(function(material) {
    THREE.CustomMaterial[material['name']] = material;
});



// geometry
THREE.SVGGemetry = function(svgString, options) {
	var shape = transformSVGPathExposed(svgString);
	var defaultOptions = {
		amount: 5,
		bevelThickness: 0,
		bevelSize: 0,
		bevelSegments: 12,
		bevelEnabled: false,
		curveSegments: 80,
		steps: 1
	};
	var svgGemo;

	try {
		options = $.extend({}, defaultOptions, options);
		svgGemo = new THREE.ExtrudeGeometry(shape, options)
		svgGemo.center();	
		svgGemo.rotateX(Math.PI);
	} catch(e) {}
	return svgGemo;
}

