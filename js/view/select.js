import View from './view.js';
import SelectStage from '../stages/select-table.js';

class SelectView = View.extend(function() {

	constructor() {
		this.super();
		this._selectStage = new SelectStage();
		this.stages.push(this._selectStage); // super
	}

	activate() { 
		// stage init
		if (!this._selectStage.isInit) {
			this._selectStage.init();
		}

		// select animation
		this._selectStage.entry()/*.then(function() {
			// select animation over
		}).catch(function(e) { console.log(e.stack);});*/
	}

	inactivate() { }
});

 export default SelectView;