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

var scenarioRoot = function(req, res) {
  models.Scenario.find(function(err, scenarios) {
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

  var scenario = new models.Scenario({'value': value});
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

  models.Scenario.findOne({'_id': id}, function(err, scenario) {
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
  models.Event.find(function(err, events) {
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

  var event = new models.Event({'value': value, 'kind': kind});
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

  models.Event.findOne({'_id': id}, function(err, event) {
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

    models.Kind.findOne({'_id':  event.kind}, function(err, kind) {
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
  models.Kind.find(function(err, kinds) {
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

  var kind = new models.Kind({'name': name, 'url': url});
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

  models.Kind.findOne({'_id': id}, function(err, kind) {
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

var memeView = function(req, res) {
  var scenarioId = req.params.scenarioId, eventId = req.params.eventId,
    kindId = req.params.kindId;

  if(!scenarioId || !eventId) {
    return res.sendStatus(400);
  }

  models.Scenario.findOne({'_id': scenarioId}, function(err, scenario) {
    if(err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if(!scenario) return res.sendStatus(404);

    models.Event.findOne({'_id': eventId}, function(err, event) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if(!event || (!event.kind && !kindId)) return res.sendStatus(404);

      if(!kindId) kindId = event.kind;

      models.Kind.findOne({'_id': kindId}, function(err, kind) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        if(!kind) return res.sendStatus(404);

        res.render('meme/view.ejs', {'scenario': scenario, 'event': event, 'kind': kind});
      });
    });
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

app.get('/meme/:scenarioId/:eventId', memeView);
app.get('/meme/:scenarioId/:eventId/:kindId', memeView);

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
