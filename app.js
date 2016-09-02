/**
 * app.js
 *
 * Application File
 */

var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.use(expressLayouts);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
}));

var logs = require('./logs');
var models = require('./database');


require('./routes/index')(app, models);

app.use(function(req, res, next){
  res.status(404);

  if (req.accepts('html')) {
    res.render('404');
    return;
  }

  if (req.accepts('json')) {
    res.send({ 'error': 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
});

app.listen(app.get('port'), function() {
  logs.always('Node app is running at localhost:' + app.get('port'));
  logs.always('Log Level: ' + logs.getLevel());
});
