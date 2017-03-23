import Time from '../common/time.js';


class ExplodeParticles extends Time {
    constructor() {
        super();
        this.particleSystem;
        this.initPos = new THREE.Vector3(0, 0, 0);
        this.finalPos = new THREE.Vector3(0, 0, 0);
    } 

    init() {

    }

    build() {
        let that = this;
        let logoImg = M3.assets.logoImg.img;
        let particleMap = new THREE.TextureLoader().load(M3.assets.particleMap.src); 
        // let particleMap = M3.assets.particleMap.texture;
        // particleMap.image = M3.assets.particleMap;

        let imgData = getImageData(logoImg, 0, 0, 0);
        let zRandom = 200;
        let yOffset = 0;//-500;
        let geom = new THREE.Geometry();
        let material = new THREE.PointsMaterial({
            map: particleMap,
            size: 3,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
            color: 0xffffff,
            blending: THREE.AdditiveBlending,
            // vertexColors: THREE.FaceColors
        });

        imgData.forEach(function(pixel) {
            let v3 = new THREE.Vector3(
                pixel.size.x * 1,
                pixel.size.y * 1 + yOffset,
                0
            );
            v3.initV = v3.clone(); // for lightUp
            v3.lightupZ = (Math.random() - 0.5) * 5 * zRandom
            v3.z = v3.lightupZ;

            
            v3.exAngle = Math.random() * Math.PI * 2; // for explode
            v3.exAngleY = (Math.random() - 0.5) * Math.PI * 1; // for explode
            v3.rPercent = Math.random() * 2 + 1
            geom.vertices.push(v3);
            // geom.vertices.push(v3);
        });
        that.particleSystem = new THREE.Points(geom, material); 
            // M3.scene.add(that.particleSystem);
            // console.log(that.particleSystem);
    }

    lightUp(dur = TIME_4000) {
        let that = this;
        let cameraTween;

        return new Promise(function(resolve) {
            // particle ani
            let particleTween = new TWEEN.Tween({z: 1}).to({z: 0}, dur * 1.2);
            particleTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {
                let z = this.z;
                that.particleSystem.geometry.verticesNeedUpdate = true;
                that.particleSystem.geometry.vertices.forEach(function(v3) {
                    v3.z = v3.lightupZ * z;
                });
            }).onComplete(()=>resolve()).start();
            that.addTween(particleTween);
        });
    }

    gather(dur = TIME_2000) {
        let that = this;
        let gatherTween = new TWEEN.Tween({p: 1}).to({p: -1}, dur);

        this.addTween(gatherTween);  
        return new Promise(function(resolve) {
            gatherTween.easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {

                // 聚集
                let p = this.p > 0 ? this.p : 0;
                that.particleSystem.geometry.verticesNeedUpdate = true;
                that.particleSystem.geometry.vertices.forEach(function(v3) {
                    v3.setLength(v3.initV.length() * p);
                });
            }).onComplete(resolve).start();
        });
    }

    explode(dur = TIME_4000) {
        let that = this;
        let explodeTween = new TWEEN.Tween({r: 0, size: 3}).to({r: 1000, size: 20}, dur);

        this.addTween(explodeTween); 
        return new Promise(function(resolve) {
            explodeTween.easing(TWEEN.Easing.Cubic.Out).onUpdate(function() {
                // explode
                let r = this.r;
                let planeR;
                that.particleSystem.material.size = this.size;
                that.particleSystem.material.needsUpdate = true;

                that.particleSystem.geometry.verticesNeedUpdate = true;
                that.particleSystem.geometry.vertices.forEach(function(v3) {
                    planeR = r * v3.rPercent * Math.cos(v3.exAngleY);
                    v3.y = r * v3.rPercent * Math.sin(v3.exAngleY);
                    v3.x = planeR * Math.cos(v3.exAngle);
                    v3.z = planeR * Math.sin(v3.exAngle);
                });
            }).onComplete(resolve).start();
        });
    }
}

export default ExplodeParticles;