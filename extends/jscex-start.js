var Jscex = require("jscex");

require("jscex-jit").init(Jscex);
require("jscex-async").init(Jscex);
require("./jscex-async-powerpack").init(Jscex);

//做一个支持
Jscex.Unjscexify = {
    toRequestHandler: function (fn) {
        return function (req, res, next) {
            fn(req, res).addEventListener("failure", function () {
                next(this.error);
            }).start();
        }
    },
    toRequestApiHandler: function (fn) {
        return function (req, res, next) {
            fn(req, res).addEventListener("failure", function () {
                res.sendApi(req, 500,  this.error);
            }).start();
        }
    }
}

module.exports = Jscex;

