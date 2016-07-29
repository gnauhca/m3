/*
	ExtendJS 0.2.3
	More info at http://extendjs.org
	Copyright (c) 2013+ ChrisBenjaminsen.com
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
(function(global){
    "use strict";
	//Helper method for creating an super copied object clone
	function initialize(method){
		//Recursivly execute parent methods.
		if(method.parent instanceof Function){
			initialize.apply(this,[method.parent]);
			this.super = cloneCopy(this,
				superCopy(this,this.constructor)
			);
		}
		method.apply(this, arguments);
	}

	//Helper method which allows for super referances.
	function cloneCopy(from, to){
		for(var x in from){
			if(	
				x !== "super" && //Never clone the super referance
				from[x] instanceof Function && //Only overwrite functions
				!(from[x].prototype instanceof Class) //Never overwrite referances to classes
			){
				//Never create circular super referances.
				to[x] = from[x].super || superCopy(from, from[x]);
			}
		}
		return to;
	}

	function superCopy(scope, method){
		var scopeSuper = scope.super;
		return method.super = function(){
			scope.super = scopeSuper;
			return method.apply(scope, arguments);
		}
		return method;
	}

	//Create Class object
	global.Class = function(){};
	global.Class.extend = function ext(to){
		function child(){
			//Prevent the prototype scope set executing the constructor.
			if(initialize !== arguments[0]){
				//Create inhereted object
				initialize.apply(this,[to]);
				//Setup scope for class instance method calls
				cloneCopy(this,this);
				this.constructor.apply(this,arguments);
				if(this.initializer instanceof Function)
					this.initializer.apply(this);
			}
		}

		//Set prototype and constructor enabeling propper type checking.
		child.prototype = new this(initialize);
		child.prototype.constructor = child;

		//Return expected result from toString
		child.toString = function(){
			return to.toString()
		}

		//Allow the child to be extended.
		child.extend = function(target){
			//Create parent referance and inherentence path.
			target.parent = to;
			return ext.apply(child,arguments);
		}
	
		return child
	}
	//Bootstrap Class by inheriting itself with empty constructor.
	global.Class = global.Class.extend(function() {
        this.constructor=function(){}
    });
})(this);




var extend = (function() { 
    var copyIsArray, 
        toString = Object.prototype.toString, 
        hasOwn = Object.prototype.hasOwnProperty; 
  
    class2type = { 
        '[object Boolean]' : 'boolean', 
        '[object Number]' : 'number', 
        '[object String]' : 'string', 
        '[object Function]' : 'function', 
        '[object Array]' : 'array', 
        '[object Date]' : 'date', 
        '[object RegExp]' : 'regExp', 
        '[object Object]' : 'object' 
    }, 
  
    type = function(obj) { 
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"; 
    }, 
  
    isWindow = function(obj) { 
        return obj && typeof obj === "object" && "setInterval" in obj; 
    }, 
  
    isArray = Array.isArray || function(obj) { 
        return type(obj) === "array"; 
    }, 
  
    isPlainObject = function(obj) { 
        if (!obj || type(obj) !== "object" || obj.nodeType || isWindow(obj)) { 
            return false; 
        } 
  
        if (obj.constructor && !hasOwn.call(obj, "constructor") 
                && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) { 
            return false; 
        } 
  
        var key; 
        for (key in obj) { 
        } 
  
        return key === undefined || hasOwn.call(obj, key); 
    }, 
  
    extend = function(deep, target, options) { 
        for (name in options) { 
            src = target[name]; 
            copy = options[name]; 
  
            if (target === copy) { continue; } 
  
            if (deep && copy 
                    && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) { 
                if (copyIsArray) { 
                    copyIsArray = false; 
                    clone = src && isArray(src) ? src : []; 
  
                } else { 
                    clone = src && isPlainObject(src) ? src : {}; 
                } 
  
                target[name] = extend(deep, clone, copy); 
            } else if (copy !== undefined) { 
                target[name] = copy; 
            } 
        } 
  
        return target; 
    }; 
  
    return extend; 
})(); 

// t: current time, b: begInnIng value, c: change In value, d: duration
var easing= {
	def: 'easeOutQuad',
	swing: function (t, b, c, d) {
		//alert(easing.default);
		return easing[easing.def](x, t, b, c, d);
	},
	easeInQuad: function (t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (t, b, c, d) {
		return c - easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (t, b, c, d) {
		if (t < d/2) return easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};

;(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());



var calculateSubWindowSize = (function() {
	var r13 = 1/3;
	var r23 = 2/3;

	var windowSizes = {
		'strip': [
			[{ left: 0, top: 0, width: 1, height: 1}],

			[{ left: 0, top: 0, width: 1, height: 0.5},
			 { left: 0, top: 0.5, width: 1, height: 0.5}],

			[{ left: 0, top: 0, width: 1, height: r13},
			 { left: 0, top: r13, width: 1, height: r13},
			 { left: 0, top: r23, width: 1, height: r13}],
			
			[{ left: 0, top: 0, width: 1, height: 0.25},
			 { left: 0, top: 0.25, width: 1, height: 0.25},
			 { left: 0, top: 0.5, width: 1, height: 0.25},
			 { left: 0, top: 0.75, width: 1, height: 0.25}],
		], 
		'square': [
			[{ left: 0, top: 0, width: 1, height: 1}],

			[{ left: 0, top: 0, width: 0.5, height: 1},
			 { left: 0.5, top: 0, width: 0.5, height: 1}],

			[{ left: 0, top: 0, width: 0.5, height: 1},
			 { left: 0.5, top: 0,width: 0.5, height: 0.5},
			 { left: 0.5, top: 0.5,width: 0.5, height: 0.5}],
			
			[{ left: 0, top: 0, width: 0.5, height: 0.5},
			 { left: 0.5, top: 0,width: 0.5, height: 0.5},
			 { left: 0, top: 0.5,width: 0.5, height: 0.5},
			 { left: 0.5, top: 0.5,width: 0.5, height: 0.5}]
		],
		'flat': [
			[{ left: 0, top: 0, width: 1, height: 1}],

			[{ left: 0, top: 0, width: 0.5, height: 1},
			 { left: 0.5, top: 0, width: 0.5, height: 1}],

			[{ left: 0, top: 0, width: r13, height: 1},
			 { left: r13, top: 0, width: r13, height: 1},
			 { left: r23, top: 0, width: r13, height: 1}],
			
			[{ left: 0, top: 0, width: 0.25, height: 1},
			 { left: 0.25, top: 0, width: 0.25, height: 1},
			 { left: 0.5, top: 0, width: 0.25, height: 1},
			 { left: 0.75, top: 0, width: 0.25, height: 1}],
		]
	};

	return function (windowNum) {
		var sizes = [];
		var winWidth = window.innerWidth;
		var winHeight = window.innerHeight;

		var ratio = winWidth/winHeight;
		var windowType = 'square';

		if ( (windowNum===2&&ratio<1) ||
			 (windowNum===3&&ratio<0.75) ||
			 (windowNum===4&&ratio<0.4)
			) {
			windowType = 'strip';
		} else if ( (windowNum===2&&ratio>1) ||
		 (windowNum===3&&ratio>1.25) ||
		 (windowNum===4&&ratio>1.6)
		) {
			windowType = 'flat';
		}
		
		return windowSizes[windowType][windowNum-1];
	}
})();



