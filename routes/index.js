var _ = require('lodash');
var request = require('request');

module.exports = function(app, models) {

  var rootIndex = function(req, res) {

    models.Scenario.find({}, function(err, scenarios) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      var scenarioData = [];

      for(var i in scenarios) {
        scenarioData[i] = {
          'value': scenarios[i].value,
          'id': scenarios[i]._id
        };
      }

      models.Event.find({}, function(err, events) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        var eventData = [];

        for(var i in events) {
          eventData[i] = {
            'value': events[i].value,
            'kind': events[i].kind,
            'id': events[i]._id
          };
        }

        models.Kind.find({}, function(err, kinds) {
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }

          var kindData = [];

          for(var i in kinds) {
            kindData[i] = {
              'name': kinds[i].name,
              'kind': kinds[i].kind,
              'id': kinds[i]._id
            };
          }

          res.render('index.ejs', {'scenarios': scenarioData, 'events': eventData, 'kinds': kindData})
        });
      });
    });
  }

  var rootRandomMeme = function(req, res) {
    models.Scenario.find({}, function(err, scenarios) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      models.Event.find({}, function(err, events) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        models.Kind.find({}, function(err, kinds) {
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }

          if(scenarios.length == 0 || events.length == 0 || kinds.lenth == 0) {
            return res.render('nomemes');
          }

          var scenarioId = _.chain(scenarios).map('id').sample().value();
          var eventId = _.chain(events).map('id').sample().value();
          var kindId = _.chain(kinds).map('id').sample().value();

          var fullUrl = req.protocol + '://' + req.get('host');

          var uri = fullUrl + '/meme/' + scenarioId + '/' + eventId + '/' + kindId;

          request.get(uri, function(err, response, body) {
            if(err) {
              console.error(err);
              return res.sendStatus(500);
            }

            res.send(body);
          });
        });
      })
    });
  }

  var rootRandomMemeHipchat = function(req, res) {
    models.Scenario.find({}, function(err, scenarios) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      models.Event.find({}, function(err, events) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        models.Kind.find({}, function(err, kinds) {
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }

          if(scenarios.length == 0 || events.length == 0 || kinds.length == 0) {
            return res.json({
              'color': 'red',
              'message': 'no memes (feelsbadman)',
              'notify': false,
              'message_format': 'text'
            });
          }

          var scenarioId = _.chain(scenarios).map('id').sample().value();
          var eventId = _.chain(events).map('id').sample().value();
          var kindId = _.chain(kinds).map('id').sample().value();

          var fullUrl = req.protocol + '://' + req.get('host');

          var uri = fullUrl + '/meme/' + scenarioId + '/' + eventId + '/' + kindId;

          return res.json({
            'color': 'yellow',
            'message': 'spicymeme: ' + uri,
            'notify': false,
            'message_format': 'text'
          });
        });
      })
    });
  }

  var rootSpicyMeme = function(req, res) {
    models.Scenario.find({}, function(err, scenarios) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      models.Event.find({kind: {'$ne': ''}}, function(err, events) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        if(scenarios.length == 0 || events.length == 0) {
          return res.render('nomemes');
        }

        var scenarioId = _.chain(scenarios).map('id').sample().value();
        var eventId = _.chain(events).map('id').sample().value();
        var fullUrl = req.protocol + '://' + req.get('host');
        var uri = fullUrl + '/meme/' + scenarioId + '/' + eventId;

        return request.get(uri, function(err, response, body) {
          if(err) {
            console.error(err);
            return res.sendStatus(500);
          }

          res.send(body);
        });
      });
    });
  }

  var rootSpicyMemeHipchat = function(req, res) {
    models.Scenario.find({}, function(err, scenarios) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      models.Event.find({kind: {'$ne': ''}}, function(err, events) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        if(scenarios.length == 0 || events.length == 0) {
          return res.json({
            'color': 'red',
            'message': 'no memes (feelsbadman)',
            'notify': false,
            'message_format': 'text'
          });
        }

        var scenarioId = _.chain(scenarios).map('id').sample().value();
        var eventId = _.chain(events).map('id').sample().value();
        var fullUrl = req.protocol + '://' + req.get('host');
        var uri = fullUrl + '/meme/' + scenarioId + '/' + eventId;

        return res.json({
          'color': 'yellow',
          'message': 'spicymeme: ' + uri,
          'notify': false,
          'message_format': 'text'
        });
      });
    });
  }

  app.get('/', rootIndex);
  app.get('/randommeme', rootRandomMeme);
  app.post('/randommeme', rootRandomMemeHipchat);
  app.get('/spicymeme', rootSpicyMeme);
  app.post('/spicymeme', rootSpicyMemeHipchat);

  require('./Kind')(app, models);
  require('./Scenario')(app, models);
  require('./Event')(app, models);
  require('./Meme')(app, models);
}
