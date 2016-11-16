const BUILDPATH = './build/'; 
const CONFIG = {};
const ASSETS = {
    //libjs: BUILDPATH + '/presets.js',


    // envmap
    envPosZ: {url:  BUILDPATH + require("assets/texture/front.jpg"), size: 20},
    envNegZ: {url:  BUILDPATH + require("assets/texture/back.jpg"), size: 20},
    envPosX: {url:  BUILDPATH + require("assets/texture/right.jpg"), size: 20},
    envNegX: {url:  BUILDPATH + require("assets/texture/left.jpg"), size: 20},
    envPosY: {url:  BUILDPATH + require("assets/texture/top.jpg"), size: 20},
    envNegY: {url:  BUILDPATH + require("assets/texture/bottom.jpg"), size: 20},

    // select
    logoImg: {url: BUILDPATH + require("assets/logo.png"), size: 10},
	particleMap: {url: BUILDPATH + require("assets/select/particle-map.png"), size: 10}
}

export {CONFIG, ASSETS};