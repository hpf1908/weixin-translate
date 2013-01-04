/**
 * 简单扩展response返回方法
 */

/**
 * Module dependencies.
 */

var path = require('path')
  , http = require('http')
  , res = http.ServerResponse.prototype;
  
var formatResult = function(ret, msg, data, view){
	var result={
		ret: ret,
		msg: msg
	};  
	
	if(data)
		result.data = data;
	if(view)
		result.view = view;	  
	  
	return result;
}

res.sendJson = function(ret, msg, data, view){
	var result = formatResult(ret, msg, data, view);
	return this.send(JSON.stringify(result));
};

res.sendJsonp = function(cb, ret, msg, data, view){
	var result = formatResult(ret, msg, data, view);
	var str = cb + '(' + JSON.stringify(result) + ')';
  	return this.send(str);
};

res.sendApi = function(req , ret, msg, data, view){
	if(req.param('cb')){
		this.sendJsonp(req.param('cb'), ret, msg, data, view);
	} else {
		this.sendJson(ret, msg, data, view);
	}
}