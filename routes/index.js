
/*
 * GET home page.
 */
var articleProvider = require('./articleprovider-memory.js').ArticleProvider;
exports.index = function(req, res){
	console.log(articleProvider);
	console.log("testValue"+articleProvider.testValue);
	articleProvider.findAll(function(error,docs){
		rss.render('index')
	})
};