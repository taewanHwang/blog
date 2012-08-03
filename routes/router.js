
/*
 * GET home page.
 */
var ArticleProvider = require('../articleprovider-mongolian').ArticleProvider;
var articleProvider = new ArticleProvider('localhost', 27017,'node-blog');
var fs = require('fs');
require("read-files");
var im = require('imagemagick');
var path = require('path');
var util = require('util');

exports.index = function(req, res){
    articleProvider.findAll( function(error,results){
        res.render('index.jade', { 
        	        title: 'Album List',
        	        results:results
        });
    })
};
exports.album = {
	new :{
		get:function(req,res){
		    res.render('album_new.jade', {
		        title: 'New Album',
				token:req.session._csrf
		    });
		},
		post:function(req,res){
			articleProvider.createAlbum({
		        title: req.param('title'),
		    }, function( err, docs) {
				if(err) throw err
		        res.redirect('/')
		    });
		}
	},
	id:function(req,res){
	    articleProvider.findById(req.params.id, function(error, result) {
			console.log(util.inspect(result)+" in index.js/id");
	        res.render('album_show.jade', {
				result:result,
				title:'Album',
				token: req.session._csrf,
	        });
	    });		
	},
	addPhoto: {
		get:function(req,res) {
		    res.render('add_photo.jade', {
		        title: 'Add Photo',
				token:req.session._csrf
		    });
		},
		post:function(req,res){
			articleProvider.addPhoto(req,function(err){
				if(err) throw err;
				res.redirect('/album/'+req.params.id);
			})
		}
	},
}
exports.removeAllAlbums = function(req,res){
	articleProvider.removeAllAlbums(function(err){
		if(err) throw err
		else{
			res.redirect('/');
		}
	})
}