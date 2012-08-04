
/**
 * Module dependencies.
 */

var express = require('express'),
	router = require('./routes/router');
var util=require('util');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.limit('100mb'));//make limit in provider ....js
  app.use(express.bodyParser({uploadDir:'./uploads'}));
  app.use(express.methodOverride());
  // setting for csrf
  app.use(express.cookieParser());
  app.use(express.session({ secret: "secret" }));

  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));

  app.use(express.csrf());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});
app.get('/', router.index);
app.get('/album/new',router.album.new.get);
app.post('/album/new',router.album.new.post);
app.get('/album/:id', router.album.id);
app.get('/addPhoto/:id',router.album.addPhoto.get)
app.post('/addPhoto/:id',router.album.addPhoto.post)
// app.get('/reset',router.removeAllAlbums)
app.listen(3000);