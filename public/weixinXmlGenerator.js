

exports.generateMsgTextXml = function(obj) {

    var toUser   = obj.ToUserName,
        fromUser = obj.FromUserName,
        content  = obj.content;

    return ['<xml>',
             '<ToUserName><![CDATA[' + toUser + ']]></ToUserName>',
             '<FromUserName><![CDATA[' + fromUser + ']]></FromUserName>',
             '<CreateTime>' + new Date().getTime() + '</CreateTime>',
             '<MsgType><![CDATA[text]]></MsgType>',
             '<Content><![CDATA['+ content + ']]></Content>',
             '<FuncFlag>0</FuncFlag>',
            '</xml>'].join('');
}