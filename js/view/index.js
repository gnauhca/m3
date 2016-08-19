var View = require('./view.js');



var IndexView = View.extend(function() {
	var _welcomeStage;
	this.stages;

	this.constructor = function() {
		this.super();
		var WelcomeStage = require('../stages/welcome.js');
		_welcomeStage = new WelcomeStage();
		this.stages.welcomeStage = _welcomeStage;
	}

	this.activate = function() {
		if (this.stages.every(function() { return this.setup; })) {
			// loaded
			
		} else {
			this.stages.forEach(function(stage) {
				if (!stage.setup && !stage.loading) {
					stage.load(function() {});
				}
			});

		}
	}

	this.inactivate = function() {

	}

});

module.exports = IndexView;