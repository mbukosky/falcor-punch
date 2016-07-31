/**
 * Sample Falcor solution
 */
'use strict';

require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var Router = require('falcor-router');
var falcorExpress = require('falcor-express');
var cors = require('cors');

var axios = require("axios");

var Model = require("falcor").Model,
  $ref = Model.ref,
  $atom = Model.atom,
  $error = Model.error;

var app = express();
var server = http.createServer(app);

// Setup Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

// Setup port for server to run on
app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.sendfile('public/index.html');
});

// Tokens
app.get('/token', function(req, res) {
  res.send('SECRET_TOKEN');
});

// Routes
var RootRouter = require('./routes');
app.use('/model.json', falcorExpress.dataSourceRoute(function(req, res) {
  console.log(req.headers.authorization);
  return new RootRouter(req.headers.authorization);
}));

app.use(express.static('public'));

server.listen(app.get('port'), 'localhost');
server.on('listening', function() {
  console.log('Express server started on port %s at %s', app.get('port'), server.address().address);
});
