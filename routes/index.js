
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
    articleProvider.findAll( function(error,docs){
        res.render('index.jade', { 
        	        title: 'Blog',
        	        articles:docs
        });
    })
};
exports.blog = {
	new :{
		get:function(req,res){
		    res.render('blog_new.jade', {
		        title: 'New Post',
				token:req.session._csrf
		    });
		},
		post:function(req,res){
			articleProvider.save({
		        title: req.param('title'),
		        body: req.param('body')
		    }, function( err, docs) {
				if(err) throw err
		        res.redirect('/')
		    });
		}
	},
	id:function(req,res){
	    articleProvider.findById(req.params.id, function(error, article) {
	        res.render('blog_show.jade', {
	            title: article.title,
	            article:article,
				token: req.session._csrf,
	        });
	    });		
	},
	addComment:function(req,res){
    	articleProvider.addCommentToArticle(req.param('_id'), {
	        person: req.param('person'),
	        comment: req.param('comment'),
	        created_at: new Date()
	        } , function( error, docs) {
	             res.redirect('/blog/' + req.param('_id'))
            });
		}
}
exports.fileUpload = function(req,res) {
}
exports.gallery = function(req,res) {
}