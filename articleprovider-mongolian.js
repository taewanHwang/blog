var Mongolian = require("mongolian");
var fs = require('fs');
var path = require('path');
var util = require('util');

ArticleProvider = function(host, port,dbname) {
	
	var server = new Mongolian
	this.db = server.db(dbname);
	this.article = this.db.collection("article");
	// Drop Database for debug
	// dropDatabase();
};

function dropDatabase(){
	this.db.dropDatabase(function(err,value){
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

ArticleProvider.prototype.saveFile = function(filepath,callback) {
};

exports.ArticleProvider = ArticleProvider;
