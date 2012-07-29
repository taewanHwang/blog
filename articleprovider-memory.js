var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var articleCounter = 1;

ArticleProvider = function(host,port){
	this.db = new Db('node-mongo-blog',new Server(host,port, {auth_reconnect:true},{}));
	this.db.open(function(){});
};
ArticleProvider.prototype.getCollection = function (callback) {
	this.db.collection('articles', function(error, article_collection){
		if(error) callback(error);
		else callback(null,article_collection);
	})
}

ArticleProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error,article_collection){
		if(error) callback(error)
		else {
			article_collection.find().toArray(function(error,results){
				if(error) callback(error)
				else callback(null,results)
			});
		}
	});
};

ArticleProvider.prototype.findById = function(id, callback) {
	this.getCollection(function(error,article_collection){
		if(error) callback(error)
		else{
			article_collection.findOne({_id:article_collection.db.bson_serializeer.ObjectID.createFromHexString(id)},function(error,result){
				if(error) callback(error)
				else callback(null,result)
			})
		}
	});
};

ArticleProvider.prototype.save = function(articles, callback) {
	this.getCollection(function(error,article_collection){
		if(error) callback(error)
		else{
			console.log('gate1:'+typeof(articles.length)+'\n'+articles)
			console.log('gate1:'+articles.title+' '+articles.body);
			if(typeof(articles.length)=="undefined")
				articles =[articles];
			for(var i=0;i<articles.length;i++){
				article = articles[i];
				console.log('gate2:'+article.title);
				article.created_at = new Date();
			    if(article.comments === undefined) article.comments =[];
				for(var j=0;j<article.comments.length;j++){
				  article.comments[j].created_at = new Date();
			    }
			}
			article_collection.insert({
				title:'manual insert title',
				body:'manual insert body'
			},function(errors,){
				callback(null,articles);
			});
		}
	});
};

exports.ArticleProvider = ArticleProvider;