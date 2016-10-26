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
        "opacity": 0.37398338317871094, 
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

