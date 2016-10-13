var View = require('./view.js');



var IndexView = View.extend(function() {
	var _welcomeStage;
	this.stages;

	this.constructor = function() {
		super();
		var WelcomeStage = require('../stages/welcome.js');
		_welcomeStage = new WelcomeStage();
		this.stages.push(_welcomeStage);
	}

	this.activate = function() { 
		// stage init
		if (!_welcomeStage.isInit) {
			_welcomeStage.init(this.activate.bind(this));
			return;
		}

		// welcome animation
		_welcomeStage.entry().then(function() {
			// welcome animation over
		}).catch(function(e) { console.log(e.stack);});
	}

	this.inactivate = function() {

	}

});

module.exports = IndexView;