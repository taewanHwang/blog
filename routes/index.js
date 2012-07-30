
/*
 * GET home page.
 */
var ArticleProvider = require('../articleprovider-mongodb').ArticleProvider;
var articleProvider = new ArticleProvider('localhost', 27017);
var fs = require('fs');
var im = require('imagemagick');
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
exports.fileUpload = function(req,res) {
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var raw_target_path = path.join(path.resolve(__dirname,'..'),'images','raw',req.files.thumbnail.name);
	var thumb_target_path = path.join(path.resolve(__dirname,'..'),'images','thumbnail','small_'+req.files.thumbnail.name);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, raw_target_path, function(err) {
        if (err) throw err;
		else{
	        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	        fs.unlink(tmp_path, function() {
	            if (err) throw err;
				else{
					im.resize({
						srcPath: raw_target_path,
						dstPath: thumb_target_path,
						width:256
					},function(err,stdout,stderr){
						if(err) throw err
						else{
				            res.send('Raw File uploaded to: ' + raw_target_path +'\n Thumbnail File uploaded to  '+ thumb_target_path+' - ' + req.files.thumbnail.size + ' bytes');							
						}
					})
				}
	        });			
			// make thumbnail image file
		}
    });
}
exports.gallery = function(req,res) {
	var base ='/Users/Macbook/Documents/NodeJS/blog/images'
	im.convert([path.join(base,'test.jpg'), '-resize', '25x120', path.join(base,'test-small.jpg')], 
	function(err, metadata){
	  if (err) throw err
	  res.send(metadata);
	})
	
		/*
	fs.readdir(base,function(err,files){
		if(err) throw err;
		else{
			res.send('hello gallery');
			console.log(files);
			for(var i in files){
				var filename = files[i];
				if(filename.indexOf('.jpg')!=-1){
					console.log(filename);
					res.send('helloWorld');
				}
			}
		}
	});
	im.resize({
	  srcPath: filePath,
	  width:   256,
	  height:256
	}, function(err, stdout, stderr){
	  if (err) throw err
        res.contentType("image/jpeg");
        res.end(stdout, 'binary');
	});
	*/
}
/*
// we need the fs module for moving the uploaded files
*/