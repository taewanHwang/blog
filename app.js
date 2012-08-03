
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes');


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
app.get('/', routes.index);
app.get('/album/new',routes.album.new.get);
app.post('/album/new',routes.album.new.post);
app.get('/album/:id', routes.album.id);
app.get('/addPhoto/:id',routes.album.addPhoto.get)
app.post('/addPhoto/:id',routes.album.addPhoto.post)
// app.get('/reset',routes.removeAllAlbums)
app.listen(3000);