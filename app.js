/*!
 * nodeclub - app.js
 */

/**
 * Module dependencies.
 */

var path = require('path');
var express = require('express');
var routes = require('./routes');

var app = express.createServer();

//扩展response对象支持json和jsonp
require('./extends/jsonApi');

// configuration in all env
app.configure(function() {
	
	var viewsRoot = path.join(__dirname, 'views');
	
	app.set('view engine', 'html');
	app.set('views', viewsRoot);
	app.register('.html', require('ejs'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	
	app.use(function(req , res , next){
        var buf = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk){ buf += chunk });
        req.on('end', function(){
            try {
                req.rawData = buf;
                next();
            } catch (err){
                next(err);
            }
        });
	});
	
	// set default layout, usually "layout"
	app.set('view options', {
		layout: 'layouts/default',
			open: '<<',
			close: '>>'
	});

	routes(app);	

});

// set static, dynamic helpers
app.helpers({
	site : {
		title:'weixin hello world'
	}
});

var static_dir = path.join(__dirname, 'public');

app.configure('development', function(){
	app.use(express.static(static_dir));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	var maxAge = 3600000 * 24 * 30;
	app.use(express.static(static_dir, { maxAge: maxAge }));
	app.use(express.errorHandler()); 
	app.set('view cache', true);
});

// Example 404 page via simple Connect middleware
app.use(function(req, res){
    res.render('404');
});  
  
// Example 500 page
app.error(function(err, req, res){
	res.render('500');
});

var port = 8024;

app.listen(port);

console.log("app listening on port %d in %s mode", port, app.settings.env);