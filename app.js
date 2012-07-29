/**
 * Module dependencies.
 */

var express = require('express'),
	path = require('path');
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());
  // using csrf
  app.use(express.cookieParser());
  app.use(express.session({ secret: "secret" }));

  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  //csrf
  app.use(express.csrf());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var articleProvider = new ArticleProvider('localhost', 27017);
// Routes

app.get('/', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade', { 
	        title: 'Blog',
	        articles:docs
        });
    })
});

app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', {
        title: 'New Post',
		token:req.session._csrf
    });
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade', {
            title: article.title,
            article:article,
			token: req.session._csrf,
        });
    });
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});
// we need the fs module for moving the uploaded files
var fs = require('fs');
app.post('/file-upload', function(req, res) {
    // get the temporary location of the file
    var tmp_path = req.files.thumbnail.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = path.join(__dirname,'images',req.files.thumbnail.name);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
        });
    });
});
app.listen(3000);