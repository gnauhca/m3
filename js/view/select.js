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
		// ui
		var $selectProducts = $('.select-products');
		var selectHTML = '';
		selectCfg.products.forEach(function(product) {
			selectHTML += `<li data-product-name="${product.name}">${product.name}</li>`;
		});
		$selectProducts.html(selectHTML);
		this._initEvent();
	}

	_initEvent() {
		let that = this;
		let $selectView = $('#selectView');
		let $ok = $('.select-confirm');
		let $productItems = $('#selectView .select-products li');
		$('#selectView').on('click', '.select-products li', function() {
			if (!that.activate) return;
			let productName = $(this).data('productName');

			that._selectStarsStage.toggle(productName);
			that._selectStarsStage.getSelected()
		});

		that._selectStarsStage.addListener('selected-change', function(_selecteds) {
			$productItems.removeClass('selected');
			_selecteds.forEach((selected)=>$productItems.filter(`[data-product-name=${selected.name}]`).addClass('selected'));
			$productItems.filter('.selected').length?$ok.addClass('selected'):$ok.removeClass('selected');
		});
		$('#selectView').on('click', '.select-confirm.selected', function() {
			// go to display
			that.activeView('display', {
				mobiles: that._selectStarsStage.getSelected(),
				camera: that._selectStarsStage.camera
			});
		});
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
		this._selectStarsStage.entry();
		this._selectStarsStage.interacted = true;

		// select animation
		
	}

	inactivate() { }

}

export default SelectView;