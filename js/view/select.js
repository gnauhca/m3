import View from './view.js';
import SelectStage from '../stages/select-table.js';
import selectCfg from 'select-conf.js';


class SelectView extends View {

	constructor() {
		super();
		this._selectStage = new SelectStage();
		this._products = selectCfg.products;
		this.init();
		this.stages.push(this._selectStage); // super
	}

	init() {
		
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
}

export default SelectView;