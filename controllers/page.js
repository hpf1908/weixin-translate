/**
 * 首页
 */
var Jscex = require('../extends/jscex-start'),
    request = require('request'),
    Async = Jscex.Async,
    Task = Async.Task,
    Jscexify = Async.Jscexify,
    Unjscexify = Jscex.Unjscexify,
    weixinGenerator = require('../public/weixinXmlGenerator'),
    weixinParser = require('../public/weixinXmlParser'),
    request = require('request');

var index = eval(Jscex.compile("async", function (req, res) {
    res.send(req.param('echostr'));     
}));

exports.index = Unjscexify.toRequestHandler(index);

var postIndex = eval(Jscex.compile("async", function (req, res) {
    if(req.rawData) {
        weixinParser.parseString(req.rawData , function(err , result) {
            if(err == 0) {
                request.get({
                     url: 'http://translate.google.cn/translate_a/t?client=t&text='+ result.Content + '&hl=zh-CN&sl=auto&tl=zh-CN&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=3&tsel=6&uptl=zh-CN&alttl=en&sc=1'
                }, function (e, r, body) {
                    if(e) {
                        var testObj = {
                            ToUserName   : result.FromUserName,
                            FromUserName : result.ToUserName,
                            content      : '拉取google翻译失败'
                        }
                        var returnXml = weixinGenerator.generateMsgTextXml(testObj);
                        res.send(returnXml);
                    } else {
                        var str = eval('(' + body + ')');

                        var testObj = {
                            ToUserName   : result.FromUserName,
                            FromUserName : result.ToUserName,
                            content      : str[0][0][0]
                        }
                        var returnXml = weixinGenerator.generateMsgTextXml(testObj);
                        res.send(returnXml);
                    }
                });
            } else {
                var testObj = {
                    ToUserName   : result.FromUserName,
                    FromUserName : result.ToUserName,
                    content      : '不好意思，没接到数据'
                }
                var returnXml = weixinGenerator.generateMsgTextXml(testObj);
                res.send(returnXml);
            }
        });
    } else {
        res.send('');
    }
}));

exports.postIndex = Unjscexify.toRequestHandler(postIndex);
