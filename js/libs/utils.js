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