import Time from 'time.js';
import selectCfg from 'select-conf.js';


class ExplodeParticles extends Time {
    constructor() {
        super();
        this.particleSystem;
        this.initPos = new THREE.Vector3(0,-500,0);
        this.finalPos = new THREE.Vector3(0,0,0);
    } 

    init() {

    }

    build() {
        var that = this;
        var logoImg;
        var particleMap;

        return new Promise(function(loaded) {
            logoImg = new Image();
            logoImg.src = selectCfg.logoImg;
            logoImg.onload = function() {
                (new THREE.TextureLoader).load(selectCfg.particleMap, function(texture) {
                    particleMap = texture;
                    loaded();
                });
            };
        }).then(function() {
            var imgData = getImageData(logoImg, 0, 0, 0);
            var maxR = 300; // 旋转飞起最大半径
            var zRandom = 200;
            var yOffset = -500;
            var geom = new THREE.Geometry();
            var material = new THREE.ParticleBasicMaterial({
                map: particleMap,
                size: 10,
                transparent: true,
                opacity: 1,

                sizeAttenuation: true,
                color: 0xffffff,
                blending: THREE.AdditiveBlending
            });

            imgData.forEach(function(pixel) {
                let v3 = new THREE.Vector3(
                    pixel.size.x,
                    pixel.size.y + yOffset,
                    (Math.random() - 0.5) * 2 * zRandom
                );
                v3.ix = v3.x; v3.iy = v3.y; v3.iz = v3.z;
                geom.vertices.push(v3);
            });
            that.particleSystem = new THREE.ParticleSystem(geom, material); 
            // M3.scene.add(that.particleSystem);
            // console.log(that.particleSystem);
        }).catch(e => console.error(e.stack));
        //M3.scene.add(that.particleSystem);
    }

    lightUp() {
        let that = this;
        let tween = new TWEEN.Tween({z: 1}).to({z: 0.2}, 2000);
        
        tween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {
            let z = this.z;
            that.particleSystem.geometry.verticesNeedUpdate = true;

            // console.log(z);
            that.particleSystem.geometry.vertices.forEach(function(v3) {
                v3.z = v3.iz * z;
            }.bind(this));
        }).start();
        this.addTween(tween);
    }

    rise() {

    }

    explode() {

    }

    
}

export default ExplodeParticles;