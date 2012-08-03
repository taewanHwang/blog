var Mongolian = require("mongolian");
var fs = require('fs');
var path = require('path');
var util = require('util');
var im = require('imagemagick');

ArticleProvider = function(host, port,dbname) {
	
	var server = new Mongolian
	this.db = server.db(dbname);
	this.article = this.db.collection("article");
};

function dropDatabase(){
	this.db.dropDatabase(function(err,value){
		if(err) throw err;
		else console.log(value);
	})
}

ArticleProvider.prototype.removeAllAlbums = function(){
	this.article.drop(function(err,callback){
		if(err) throw err;
		else{
			callback(null);
		}
	});
}
ArticleProvider.prototype.createAlbum = function(req,callback) {
	var album={
		title:req.params('title'),
		photos:[],
	}
	this.article.insert([album]);
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

ArticleProvider.prototype.saveFile = function(req,callback) {
	var tmp_path = path.join(path.resolve(__dirname),req.files.thumbnail.path)
	var filename = req.files.thumbnail.name;
	var raw_target_path = path.join(path.resolve(__dirname),'public/images/upload/raw',filename);
	var thumb_target_path = path.join(path.resolve(__dirname),'public/images/upload/thumbnail','thumbnail_'+filename);
	fs.rename(tmp_path, raw_target_path, function(err) {
		if(err) throw err
		else{
			fs.unlink(tmp_path, function() {
				if (err) throw err;
				else{
					im.resize({
						srcPath:raw_target_path,
						dstPath:thumb_target_path,
						width:256,
					},function(err,stdout,stderr){
						if(err) throw err;
						else{
							callback(null);
						}
					})
				}
			})
		}
	});
}

exports.ArticleProvider = ArticleProvider;
