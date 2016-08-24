/**
 * app.js
 * Application File
 */

var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send('Hello World, ben here!');
});

var models = require('./database');

require('./routes/index')(app, models);

app.use(function(req, res, next){
  res.status(404);

  if (req.accepts('html')) {
    res.render('404');
    return;
  }

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
