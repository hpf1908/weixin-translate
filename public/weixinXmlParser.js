var xml = require("node-xml");

// var test = ['<xml><ToUserName><![CDATA[gh_d5e2b9686541]]></ToUserName>',
//             '<FromUserName><![CDATA[oHIX3jkq0SZEPDKV93VHugL6ah1c]]></FromUserName>',
//             '<CreateTime>1357315554</CreateTime>',
//             '<MsgType><![CDATA[text]]></MsgType>',
//             '<Content><![CDATA[vvg]]></Content>',
//             '</xml>'].join('');

exports.parseString = function (content , parseCallback) {

  var result = {};
  var elmKeyStack = [];

  var parser = new xml.SaxParser(function(cb) {
    cb.onStartDocument(function() {
        
    });
    cb.onEndDocument(function() {
        parseCallback && parseCallback(0 , result);
    });
    cb.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
        // util.log("=> Started: " + elem + " uri="+uri +" (Attributes: " + JSON.stringify(attrs) + " )");
    });
    cb.onEndElementNS(function(elem, prefix, uri) {
        // util.log("<= End: " + elem + " uri="+uri + "\n");
           if(elem) {
              var value = elmKeyStack.pop();
              if(value) {
                result[elem] = value;
              }
           }
           parser.pause();// pause the parser
           setTimeout(function (){parser.resume();}, 100); //resume the parser
    });
    cb.onCharacters(function(chars) {
        elmKeyStack.push(chars);
        // util.log('<CHARS>'+chars+"</CHARS>");
    });
    cb.onCdata(function(cdata) {
        elmKeyStack.push(cdata);
        // util.log('<CDATA>'+cdata+"</CDATA>");
    });
    cb.onComment(function(msg) {
        // util.log('<COMMENT>'+msg+"</COMMENT>");
    });
    cb.onWarning(function(msg) {
        // util.log('<WARNING>'+msg+"</WARNING>");
    });
    cb.onError(function(msg) {
        parseCallback && parseCallback(-1 , '<ERROR>'+JSON.stringify(msg)+"</ERROR>");
    });
  });

  parser.parseString(content);

}