/**
 * app.js
 * Application File
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var express = require('express');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/meme-gen');

var db = mongoose.connection;

autoIncrement.initialize(db);

db.on('err', console.error.bind(console, 'console error:'));
db.once('open', function() {
  console.log('Mongodb connected.');
});

var ScenarioSchema = mongoose.Schema({
  'value': 'String'
});

var EventSchema = mongoose.Schema({
  'value': 'String',
  'kind': 'String'
});

var KindSchema = mongoose.Schema({
  'name': 'String',
  'url': 'String'
});

ScenarioSchema.plugin(autoIncrement.plugin, 'Scenario');
EventSchema.plugin(autoIncrement.plugin, 'Event');
KindSchema.plugin(autoIncrement.plugin, 'Kind');

var Scenario = mongoose.model('Scenario', ScenarioSchema);
var Event = mongoose.model('Event', EventSchema);
var Kind = mongoose.model('Kind', KindSchema);

var app = express();
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.send('Hello World, ben here!');
});

var scenarioRoot = function(req, res) {
  Scenario.find(function(err, scenarios) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var data = [];

    for(var i in scenarios) {
      data[i] = {
        'value': scenarios[i].value,
        'id': scenarios[i]._id
      };
    }

    res.render('scenario/index.ejs', {scenarios: data});
  });
}

var scenarioCreate = function(req, res) {
  var value = req.query.value;

  if(!value) return res.sendStatus(400);

  var scenario = new Scenario({'value': value});
  scenario.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var data = {
      'value': scenario.value,
      'id': scenario._id
    };

    res.json(data);
  });
}

var scenarioView = function(req, res) {
  var id = req.query.id || req.params.id;

  if(!id) return res.sendStatus(404);

  Scenario.findOne({'_id': id}, function(err, scenario) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if(!scenario) return res.sendStatus(404);

    var data = {
      'value': scenario.value,
      'id': scenario._id
    };

    res.render('scenario/view.ejs', {scenario: data});
  });
}

var eventRoot = function(req, res) {
  Event.find(function(err, events) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var data = [];

    for(var i in events) {
      data[i] = {
        'value': events[i].value,
        'kind': events[i].kind,
        'id': events[i]._id
      };
    }

    res.render('event/index.ejs', {events: data});
  });
}

var eventCreate = function(req, res) {
  var value = req.query.value, kind = req.query.kind;

  if(!value || !kind) return res.sendStatus(400);

  var event = new Event({'value': value, 'kind': kind});
  event.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var data = {
      'value': event.value,
      'kind': event.kind,
      'id': event._id
    };

    res.json(data);
  });
}

var eventView = function(req, res) {
  var id = req.query.id || req.params.id;

  if(!id) return res.sendStatus(404);

  Event.findOne({'_id': id}, function(err, event) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if(!event) return res.sendStatus(404);

    var data = {
      'value': event.value,
      'kind': event.kind,
      'id': event._id
    };

    if(!data.kind) {
      return res.render('event/view.ejs', {event: data});
    }

    Kind.findOne({'_id':  event.kind}, function(err, kind) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if(!kind) return res.render('event/view.ejs', {event: data});
      else res.render('event/view.ejs', {event: data, kind: kind});
    });
  });
}


var kindRoot = function(req, res) {
  Kind.find(function(err, kinds) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var data = [];

    for(var i in kinds) {
      data[i] = {
        'name': kinds[i].name,
        'url': kinds[i].url,
        'id': kinds[i]._id
      };
    }

    res.render('kind/index.ejs', {kinds: data});
  });
}

var kindCreate = function(req, res) {
  var name = req.query.name, url = req.query.url;

  if(!name || !url) return res.sendStatus(400);

  var kind = new Kind({'name': name, 'url': url});
  kind.save(function(err) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    var data = {
      'name': kind.name,
      'url': kind.url,
      'id': kind._id
    };

    res.json(data);
  });
}

var kindView = function(req, res) {
  var id = req.query.id || req.params.id;

  if(!id) return res.sendStatus(404);

  Kind.findOne({'_id': id}, function(err, kind) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if(!kind) return res.sendStatus(404);

    var data = {
      'name': kind.name,
      'url': kind.url,
      'id': kind._id
    };

    res.render('kind/view.ejs', {kind: data});
  });
}

app.get('/scenario', scenarioRoot);
app.get('/scenario/create', scenarioCreate);
app.get('/scenario/:id', scenarioView);
app.get('/event', eventRoot);
app.get('/event/create', eventCreate);
app.get('/event/:id', eventView);
app.get('/kind', kindRoot);
app.get('/kind/create', kindCreate);
app.get('/kind/:id', kindView);

// DOTO
// app.get('/meme/:scenarioId/:eventId', memeView);
// app.get('/meme/:scenarioId/:eventId/:kindId', memeView);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
