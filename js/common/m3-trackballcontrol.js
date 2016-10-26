/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 */

var TrackballControls = function () {

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

	this.domElement = document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };
	this.fullScreen = false;

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = true;
	this.noRoll = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;



	// internals
	this.targetMesh;
	this.target = new THREE.Vector3();
	this.target0 = this.target.clone();
	this.position0; //this.camera.position.clone();
	this.up0; //= this.camera.up.clone();

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotation,

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();



	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start'};
	var endEvent = { type: 'end'};


	// methods
	
	initEvent();

	this.init = function(camera, targetMesh) {

		this.camera = camera;
		this.cameraUp = camera.up.clone();
		this.targetMesh = targetMesh;

		_rotation = new THREE.Quaternion();
		_rotation.setFromEuler(targetMesh.rotation.clone());
		// for reset 
		this.target = this.targetMesh.position.clone();
		this.target0 = this.target.clone();
		this.position0 = this.camera.position.clone();
		this.up0 = this.camera.up.clone();
	}

	this.changeTargetMesh = function(targetMesh) {
		this.targetMesh = targetMesh;
		this.target = this.targetMesh.position.clone();
	}

	this.handleResize = function (winSize) {
		var maxDisBase = 80;
		var minDisBase = 10;

		this.screen.left = winSize.left;
		this.screen.top = winSize.top;
		this.screen.width = winSize.width;
		this.screen.height = winSize.height;

		this.maxDistance = maxDisBase;
		this.minDistance = minDisBase;
	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	var getMouseOnScreen = ( function () {

		var vector = new THREE.Vector2();

		return function ( pageX, pageY ) {

			vector.set(
				( pageX - _this.screen.left ) / _this.screen.width,
				( pageY - _this.screen.top ) / _this.screen.height
			);

			return vector;
		};

	}() );

	var getMouseProjectionOnBall = function(offsetX, offsetY) {

		var radio = 0.5;
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                offsetY * (Math.PI / 180) * radio,
                offsetX * (Math.PI / 180) * radio,
                0,
                'XYZ'
            ));
        
        _this.targetMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, _this.targetMesh.quaternion);
	};


	this.rotateTarget = function() { 
		
		//this.targetMesh.rotation.setFromQuaternion(_rotation, 'XYZ'); 
	}

	this.zoomCamera = function () {

		if ( _state === STATE.TOUCH_ZOOM_PAN ) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = (function(){

		var mouseChange = new THREE.Vector2(),
			cameraUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function () {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

				pan.copy( _eye ).cross( _this.camera.up ).setLength( mouseChange.x );
				pan.add( cameraUp.copy( _this.camera.up ).setLength( mouseChange.y ) );

				_this.camera.position.add( pan );
				_this.target.add( pan );

				if ( _this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

				}

			}
		}

	}());

	this.checkDistances = function () {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.camera.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.camera.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );

			}

		}

	};

	this.update = function () { 
		if (!this.enabled) return;  

		_eye.subVectors( _this.camera.position, _this.target );

		if ( !_this.noRotate ) {

			_this.rotateTarget();

		}

		if ( !_this.noZoom ) {

			_this.zoomCamera();

		}

		if ( !_this.noPan ) {

			_this.panCamera();

		}

		_this.camera.position.addVectors( _this.target, _eye );

		_this.checkDistances();

		_this.camera.lookAt( _this.target );

		if ( lastPosition.distanceToSquared( _this.camera.position ) > EPS ) {

			//_this.dispatchEvent( changeEvent );

			lastPosition.copy( _this.camera.position );

		}

	};

	this.resize = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy( _this.target0 );
		_this.camera.position.copy( _this.position0 );
		_this.camera.up.copy( _this.up0 );

		_eye.subVectors( _this.camera.position, _this.target );

		_this.camera.lookAt( _this.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.camera.position );

	};


	// event handle

	var mousePreX = 0;
	var mousePreY = 0;

	function isInScreen(x, y) {
		if ((x > _this.screen.left && x < _this.screen.left + _this.screen.width &&
			y > _this.screen.top && y < _this.screen.top + _this.screen.height) || _this.fullScreen) {
			return true;
		} else {
			return false;
		}
	}

	function mousedown( event ) {  

		if ( _this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {
			_state = event.button;
		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {
			mousePreX = event.pageX;
			mousePreY = event.pageY;

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_zoomEnd.copy(_zoomStart);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			_panEnd.copy(_panStart)

		}

		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );

		//_this.dispatchEvent( startEvent );

	}


	// event handle
	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			getMouseProjectionOnBall( event.pageX - mousePreX, event.pageY - mousePreY) ;

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd.copy( getMouseOnScreen( event.pageX, event.pageY ) );

		}
		mousePreX = event.pageX;
		mousePreY = event.pageY;

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
		//_this.dispatchEvent( endEvent );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		//_this.dispatchEvent( startEvent );
		//_this.dispatchEvent( endEvent );

	}

	function touchstart( event ) {

		if ( _this.enabled === false || !isInScreen(event.pageX, event.pageY)) return;

		switch ( event.touches.length ) {

			case 1:
				mousePreX = event.touches[ 0 ].pageX;
				mousePreY = event.touches[ 0 ].pageY;
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

			default:
				_state = STATE.NONE;

		}
		//_this.dispatchEvent( startEvent );
	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				getMouseProjectionOnBall( event.touches[ 0 ].pageX - mousePreX, event.touches[ 0 ].pageY - mousePreY);
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				break;

			default:
				_state = STATE.NONE;

		}
		mousePreX = event.touches[ 0 ].pageX;
		mousePreY = event.touches[ 0 ].pageY;
	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_rotateEnd.copy( getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				_rotateStart.copy( _rotateEnd );
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( getMouseOnScreen( x, y ) );
				_panStart.copy( _panEnd );
				break;

		}

		_state = STATE.NONE;
		//_this.dispatchEvent( endEvent );
	}

	function initEvent() {
		_this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

		_this.domElement.addEventListener( 'mousedown', mousedown, false );

		_this.domElement.addEventListener( 'mousewheel', mousewheel, false );
		_this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

		_this.domElement.addEventListener( 'touchstart', touchstart, false );
		_this.domElement.addEventListener( 'touchend', touchend, false );
		_this.domElement.addEventListener( 'touchmove', touchmove, false );		
	}
}


module.exports = TrackballControls;