import View from './view.js';
import SelectStage from '../stages/select-table.js';
import SelectCube from '../stages/select-cube.js';
import selectCfg from 'select-conf.js';


class SelectView extends View {

	constructor() {
		super();
		this._selectStage = new SelectStage();
		this._selectCubeStage = new SelectCube();
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
		if (!this._selectCubeStage.isInit) {
			this._selectCubeStage.init();
		}

		// select animation
		this._selectStage.entry()
		this._selectCubeStage.entry()
	}

	inactivate() { }
}

export default SelectView;