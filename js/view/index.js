var View = require('./view.js');



var IndexView = View.extend(function() {
	var _welcomeStage;
	this.stages;

	this.constructor = function() {
		this.super();
		var WelcomeStage = require('../stages/welcome.js');
		_welcomeStage = new WelcomeStage();
		this.stages.push(_welcomeStage);
	}

	this.activate = function() {
		// stage setup
		if (!_welcomeStage.setup) {
			welcomeStage.setup(this.activate.bind(this));
			return;
		}

		// welcome animation
		_welcomeStage.playEntryAnimation().then(function() {
			// welcome animation over
		}).catch(function(e) { console.log(e.stack);});
	}

	this.inactivate = function() {

	}

});

module.exports = IndexView;