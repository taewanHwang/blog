var Mongolian = require("mongolian");
var fs = require('fs');
var ObjectId =  require('mongolian').ObjectId;
var path = require('path');
var util = require('util');
var im = require('imagemagick');
var async = require('async');
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
ArticleProvider.prototype.createAlbum = function(data,callback) {
	var album={
		title:data.title,
		photos:[],
		created_at: new Date()
	}
	this.article.insert([album]);
	callback(null);
}
ArticleProvider.prototype.findAll = function(callback) {
	this.article.find().toArray(function(err,results){
		if(err) callback(err)
		else{
			// console.log(util.inspect(results)+" in provider.js/findAll");
			callback(null,results)
		};
	})
};


ArticleProvider.prototype.findById = function(id, callback) {
	this.article.findOne({_id: new ObjectId(id)}, function(error, result) {
		if( error ) callback(error)
		else {
			// console.log(util.inspect(result)+" in provider.js/findByID");
			callback(null, result);
		}
	});
};
function isArray(a)
{
	return Object.prototype.toString.apply(a) === '[object Array]';
}
ArticleProvider.prototype.addPhoto = function(req,callback) {
	var files=req.files.thumbnail;
	var article = this.article;
	var count=0;
	if(!isArray(files)) files=[files];
	async.forEachSeries(files,
		function(file,callback){
			var tmp_path = path.join(path.resolve(__dirname),file.path)
			var filename = file.name;
			var raw_target_path = path.join(path.resolve(__dirname),'public/images/upload/raw',filename);
			var thumb_target_path = path.join(path.resolve(__dirname),'public/images/upload/thumbnail','thumbnail_'+filename);
			fs.rename(tmp_path, raw_target_path, function(err) {
				if(err) throw err
				fs.unlink(tmp_path, function() {
					if (err) throw err;
					im.resize({
						srcPath:raw_target_path,
						dstPath:thumb_target_path,
						width:256,
					},function(err,stdout,stderr){
						if(err) throw err;
						var albumId = new ObjectId(req.params.id);
						article.update(
							{_id:albumId},
							{"$push":{photos:filename}},
							function(err,result){
								if(err) throw err;
								callback();
							});
					});
				});
			});
		},function(err){
			if(err) throw err;
			callback(null);
		}
	);	
}
exports.ArticleProvider = ArticleProvider;
