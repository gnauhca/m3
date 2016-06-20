var ViewUpdate = require('./update-tip.js');
var ViewList = require('./view-list.js');
var ViewDisplayManager = require('./view-display-manager');


// todo: webgl 检查
if (false) {
	// ViewUpdate
	return;
} else {
	document.getElementById('updateTips').style.display = 'none';
}


var viewDisPlayManager = new ViewDisplayManager();
var viewList = new ViewList();

viewDisPlayManager.viewListId = viewList.getViewId();
viewList.viewDisPlayManagerId = viewDisPlayManager.getViewId();