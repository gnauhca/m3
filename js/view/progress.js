var View = require('./view.js');

var ProgressView = View.extend(function() {
	var _$progressWrap = $('#progressView');
	var _$progressVal = $('#progressVal');
	var _$water = $('.water');
	var _$waterDivs = _$water.find('div');

	this.constructor = function() {
		this.super();
		this.setProgress(0);
	}

	this.activate = function() { 
		_$progressWrap.show();
	}

	this.inactivate = function() {
		setTimeout(function() {
			_$progressWrap.hide();
		}, 1000);
	}

	this.setProgress = function(percent) {
		var initColor = [246, 11, 55];
		var finalColor = [16, 121, 125];
		var opacity = 0.3;
		var currentColor;

		currentColor = finalColor.map(function(colorVal, i) {
			return initColor[i] + (colorVal - initColor[i]) * percent|0;
		});

		_$waterDivs.css('backgroundColor', 'rgba(' + currentColor.join(',') + ',' + opacity + ')');

		_$progressVal.html( (percent*100 | 0) + '%');
		percent *= 0.999;
		_$water.css('transform', 'scaleY(' + percent.toFixed(2) + ')');
	}
});

module.exports = ProgressView;