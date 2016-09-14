var View = require('./view.js');

var SelectView = View.extend(function() {
	var _selectStage;
	this.stages;

	this.constructor = function() {
		this.super();
		var WelcomeStage = require('../stages/select-cube.js');
		_selectStage = new WelcomeStage();
		this.stages.push(_selectStage);
	}

	this.activate = function() { 
		// stage init
		if (!_selectStage.isInit) {
			_selectStage.init();
		}

		// select animation
		_selectStage.entry().then(function() {
			// select animation over
		}).catch(function(e) { console.log(e.stack);});
	}

	this.inactivate = function() {

	}
});

module.exports = SelectView;