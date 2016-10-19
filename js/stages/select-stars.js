import Time from 'time.js';
import Stage from './stage.js';
import selectCfg from 'select-conf.js';

class Star extends Time {

}

class Line extends Time {

}

class SelectStars extends Stage {
	constructor() {
		super();

		this.init = false;

		this._gridSize = 10;
		this._starCount = 50;
		this._range = 10; // 边长

		this.stars;

	}
	init() {
		this._build();
	}

	_build() {
		var startCrood;
		var isValidCrood = false;

		while(this.stars.length < this._starCount) {

			startCrood = new THREE.Vector3(
				this._range * this._gridSize * Math.random(), 
				this._range * this._gridSize * Math.random(), 
				this._range * this._gridSize * Math.random()
			);

			isValidCrood = this.stars.every(function(star) {
				return (new THREE.Vector3).subVectors(startCrood, star.mesh.position).length() > this._gridSize * 2;
			});

			if (isValidCrood) {
				this.stars.push(new Star());
			}
		}


	}
}

export default SelectStars;





