import View from './view.js';

class ProgressView extends View {

	constructor() {
		super();

		this._$progressWrap = $('#progressView');
		this._$progressVal = $('#progressVal');
		this._$water = $('.water');
		this._$waterDivs = this._$water.find('div');
		this.setProgress(0);
	}

	activate() { 
		this._$progressWrap.show();
	}

	inactivate() {
		setTimeout(function() {
			this._$progressWrap.hide();
		}, 1000);
	}

	setProgress(percent) {
		var initColor = [246, 11, 55];
		var finalColor = [16, 121, 125];
		var opacity = 0.3;
		var currentColor;

		currentColor = finalColor.map(function(colorVal, i) {
			return initColor[i] + (colorVal - initColor[i]) * percent|0;
		});

		this._$waterDivs.css('backgroundColor', 'rgba(' + currentColor.join(',') + ',' + opacity + ')');

		this._$progressVal.html( (percent*100 | 0) + '%');
		percent *= 0.999;
		this._$water.css('transform', 'scaleY(' + percent.toFixed(2) + ')');
	}
}

export default ProgressView;