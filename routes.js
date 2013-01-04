/**
 * Module dependencies.
 */
var page = require('./controllers/page');


exports = module.exports = function(app) {
  app.get('/', page.index);
  app.post('/',page.postIndex);
};