
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser());
  app.use(express.session({ secret: "changeme" }));
  app.use(express.csrf());
});
app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var articleProvider= new ArticleProvider('localhost',27017);

app.get('/', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('index.jade',{
            title: 'Blog',
            articles:docs
        });
    })
});
app.get('/blog/new', function(req, res){
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
app.get('/blog/:id',function(req,res){
	articleProvider.findById(req,params.id,function(error,article){
		res.render('blog_show.jade',
		{locals:{
			title:article.title,
			article:article
		}}
		);
	})
})
app.post('/blog/addComment',function(req,res){
	articleProvider.addCommentToArticle(req.params('_id'),{
		person:req.params('person'),
		comment:req.params('comment'),
		created_at:new Date()
	},function(error,docs){
		res.redirect('/blog/'+req.params('_id'))
	})
})
//console.log("express server listening on port %d in %s mode",app.address().port,app.setting.env);