
/*
 * GET home page.
 */
var ArticleProvider = require('../articleprovider-mongodb').ArticleProvider;
var articleProvider = new ArticleProvider('localhost', 27017);
var fs = require('fs');
var path = require('path');

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
		    }, function( error, docs) {
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
exports.fileUpload = function(req,res){
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = path.join(path.resolve(__dirname,'..'),'images',req.files.thumbnail.name);
	console.log(tmp_path+'&'+target_path);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
	
}

/*
// we need the fs module for moving the uploaded files
*/