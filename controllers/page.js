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

exports.index = Unjscexify.toRequestSendHandler(index);

request.getAsync = Jscexify.fromStandard(request.get);
request.postAsync = Jscexify.fromStandard(request.post);
weixinParser.parseStringAsync = Jscexify.fromStandard(weixinParser.parseString);

var postIndex = eval(Jscex.compile("async", function (req, res) {

    if(req.rawData) {
        var weiXinResult = $await(weixinParser.parseStringAsync(req.rawData));
        var query = encodeURIComponent(weiXinResult.Content);

        var requestUrl = 'http://openapi.baidu.com/public/2.0/bmt/translate?client_id=oaYlA8gnUfwtGC19ewQMMKxE&q='+ query + '&from=auto&to=auto';
        var translate = $await(request.postAsync(requestUrl));
        var transResult = JSON.parse(translate.body);
        var baiduDst = transResult.trans_result[0].dst;

        if(transResult.to == 'zh') {
            requestUrl = 'http://translate.google.cn/translate_a/t?client=t&text=' + query + '&hl=zh-CN&sl=en&tl=zh-CN&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=3&tsel=6&sc=1';
        } else {
            requestUrl = 'http://translate.google.cn/translate_a/t?client=t&text=' + query + '&hl=zh-CN&sl=zh-CN&tl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=2&ssel=3&tsel=6&sc=1';
        }

        translate = $await(request.getAsync({
                            url: requestUrl
                        }));
        try {
            var str = eval('(' + translate.body + ')');
            var googleDst = str[0][0][0];
            var content = 'baidu:' + baiduDst + ' ';
            content += 'google:' + googleDst + '\n';
            var returnObj = {
                ToUserName   : weiXinResult.FromUserName,
                FromUserName : weiXinResult.ToUserName,
                content      : content
            }
            var returnXml = weixinGenerator.generateMsgTextXml(returnObj);
            res.send(returnXml);
        } catch(e) {
            console.log(e);
            res.send("");
        }
    } else {
        res.send('');
    }
}));

exports.postIndex = Unjscexify.toRequestSendHandler(postIndex);
