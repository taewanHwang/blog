// var Db = require('mongodb').Db;
// var Connection = require('mongodb').Connection;
// var Server = require('mongodb').Server;
// var BSON = require('mongodb').BSON;
// var ObjectID = require('mongodb').ObjectID;
var Mongolian = require("mongolian");

ArticleProvider = function(host, port,dbname) {
	
	var server = new Mongolian
	var db = server.db(dbname);

	// Set some collections
	this.article = db.collection("article");
	// Drop Database for debug
	//dropDatabase(db);
};

function dropDatabase(db){
	db.dropDatabase(function(err,value){
		if(err) throw err;
		else console.log(value);
	})
}
ArticleProvider.prototype.findAll = function(callback) {
	this.article.find().toArray(function(err,results){
		if(err) callback(err)
		else callback(null,results);
	})
};


ArticleProvider.prototype.findById = function(id, callback) {
	this.article.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
		if( error ) callback(error)
		else callback(null, result)
	});
};

ArticleProvider.prototype.save = function(articles, callback) {
	if( typeof(articles.length)=="undefined")
	  articles = [articles];

	for( var i =0;i< articles.length;i++ ) {
	article = articles[i];
	article.created_at = new Date();
	if( article.comments === undefined ) article.comments = [];
		for(var j =0;j< article.comments.length; j++) {
			article.comments[j].created_at = new Date();
		}
	}

	this.article.insert(articles);
	callback(null);
};
ArticleProvider.prototype.addCommentToArticle = function(articleId, comment, callback) {
	this.article.update(
		{_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
		{"$push": {comments: comment}},
		function(error, article){
			if( error ) callback(error);
			else callback(null, article)
		});
};

exports.ArticleProvider = ArticleProvider;
