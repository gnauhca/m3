import View from './view.js';
import SelectTable from '../stages/select-table.js';
import SelectCube from '../stages/select-cube.js';
import SelectStars from '../stages/select-stars.js';
import selectCfg from 'select-conf.js';


class SelectView extends View {

	constructor() {
		super();
		// this._selectTable = new SelectTable();
		// this._selectCubeStage = new SelectCube();
		
		this._selectStarsStage = new SelectStars();

		this._products = selectCfg.products;
		this.init();
		
		// this.stages.push(this._selectTable); // super
	}

	init() {

	}

	activate() { 
		// stage init
		// if (!this._selectTable.isInit) {
		// 	this._selectTable.init();
		// }
		// this._selectTable.entry()

		// if (!this._selectCubeStage.isInit) {
		// 	this._selectCubeStage.init();
		// }
		// this._selectCubeStage.entry()


		if (!this._selectStarsStage.isInit) {
			this._selectStarsStage.init();
		}
		this._selectStarsStage.entry()

		// select animation
		
	}

	inactivate() { }
}

export default SelectView;