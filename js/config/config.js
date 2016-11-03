const BUILDPATH = './build/'; 
const CONFIG = {};
const ASSETS = {
    //libjs: BUILDPATH + '/presets.js',

    // select
    logoImg: {url: BUILDPATH + require("assets/logo.png"), size: 10},
	particleMap: {url: BUILDPATH + require("assets/select/particle-map.png"), size: 10}
}

export {CONFIG, ASSETS};