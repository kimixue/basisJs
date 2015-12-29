/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
(function(root,factory){
	'use strict';
	//Node, CommonJS
	if (typeof module === "object" && typeof module.exports === "object"){
		module.exports = root.document ?
			factory(root, true) :
			function(w) {
				if (!w.document) {
					throw new Error( "d requires a window with a document" );
				}
				return factory(w);
			};
	//AMD
	}else if(typeof define === 'function' && define.amd) {
		define(factory);
	//ROOT
	}else {
		root.d = factory(root);
	};
}(window !== 'undefined' ? window : this,function(){
	var isFunc = function(f){
        return typeof f === 'function'; 
    };

	var doc = window.document,
		version = '1.0.0',
		className = doc.getElementsByClassName ? true: false,
    	ifJquery = doc.querySelectorAll ? true: false,
    	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    	userAgent = window.navigator.userAgent.toLowerCase();

	var d = function(selector,tag){
		return new d.fn.init(selector,tag);
	};


	d.fn = d.prototype = {
		init:function(selector,tag){
			if ( !selector ) {
				return this;
			};

			if(typeof selector === 'string'){
				var _id = selector.split(',');

				this.returnArray = [];
				for(var i=0;i<_id.length;i++){
					match = rquickExpr.exec(_id[i]);

					if(match[3]){   //class
						var tagClass = this.getClass(match[3],tag);
						if(tagClass) {
		                    for(var j = 0; j < tagClass.length; j++) {
		                        this.returnArray.push(tagClass[j]);
		                    }
		                }
					}else{          //id
						var tagId = this.getId(match[1]);
						this.returnArray.push(tagId);
					}
				};
			};
		},
		getId: function(id) {
	        return document.getElementById(id);
	    },
	    getClass: function(searchClass,tag) {
	    	tag = tag ? tag : '*';
	    	if(className){
	    		var elem = document.getElementsByClassName(searchClass),
	    			result = [];
	    		for(var i = 0 ; i < elem.length; i++) {
	                result.push(elem[i]);
	            }

	    		return result;
	    	}else if(ifJquery){
	    		var elem = document.querySelectorAll('.' + searchClass),
	    			result = [];
	    		for(var i = 0 ; i < elem.length; i++) {				
	                result.push(elem[i]);
	            };
	            return result;
	    	}else{
	    		// for IE
	    		var elem = document.getElementsByTagName(tag),
	    			result = [];
	            for(var i = 0 ; i < elem.length; i++) {
	            	if(elem[i].className === searchClass){
	            		result.push(elem[i]);
	            	}
	            }
	            return result;
	    	};
	    },
	    elemVal:function(txt){
	    	for (var i=0;i<this.returnArray.length;i++){
				this.returnArray[i].innerHTML = txt;
			};
			return this;
	    },
		html:function(txt){
			return this.elemVal.call(this,txt);
		},
		css:function(styles){
			var numargs = arguments.length,
				x;
			for(var i=0;i<this.returnArray.length;i++){
				if(numargs === 2){
					this.returnArray[i].style[arguments[0]] = arguments[1];
				}else{
					for(x in styles){
						this.returnArray[i].style[x] = styles[x];
					}
				};
			};

			return this;
		},
		on:function(event,callback){
			for(var i=0;i<this.returnArray.length;i++){
				if(typeof window.addEventListener != 'undefined'){
					this.returnArray[i].addEventListener(event,callback);
				}else{
					this.returnArray[i].attachEvent('on' + event,callback);
				}
			};
		}
	};


	d.fn.extend = d.extend = function(){
		var target = arguments[0] || {};

		if(arguments.length === 1){
			for (key in arguments[0]) {
                this[key] || (this[key] = arguments[0][key]);
            };
            return true;
		}
	};

	function strToJson(str){
		var json = (new Function("return " + str))(); 
		return json; 
	};

	d.extend({
		ajax:function(_data){
			var xhr = null;
			if(window.XMLHttpRequest){
				xhr = new XMLHttpRequest();
			}else{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			};

			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status == 200){
						if(_data.dataType == 'json'){
							responseText = strToJson(xhr.responseText)
						};
						_data.success(responseText);
					}else{
						if(_data.error){
							_data.error();
						}
					}
				}else{
					if(_data.beforeSend){
						_data.beforeSend();
					}
				}
			};

			xhr.open(_data.type,_data.url,true);
			xhr.send(_data.data);
		},
		get:function(url,dataType,success){
			return this.ajax({
				type:'GET',
				dataType:dataType,
				url:url,
				success:success
			});
		},
		getScript:function(url,callback){
			var head = document.getElementsByTagName('head'),
				js = document.createElement('script');

			js.setAttribute('type', 'text/javascript'); 
	        js.setAttribute('src', url); 

	        head.appendChild(js);

	        var callbackFn = function(){
	        	if(isFunc(callback)){
	        		callback();
	        	}
	        };

	        if(document.all){
	        	js.onreadystatechange = function(){
	        		if(js.readyState == 'loaded' || js.readyState == 'complete'){
	        			callbackFn();
	        		}
	        	}
	        }else{
	        	js.onload = function(){
	        		callbackFn();
	        	}
	        };
		},
		post:function(url,data,success){			
			return this.ajax({
				type:'POST',
				dataType:dataType,
				url:url,
				data:data,
				success:success
			});
		},
		browserData:{
			'version': (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
	        'safari': /webkit/.test(userAgent),
	        'opera': /opera/.test(userAgent),
	        'msie': /msie/.test(userAgent) && !/opera/.test(userAgent),
	        'mozilla': /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
		}
	});

	d.prototype.init.prototype = d.prototype;

	return window.$ = d;

}));