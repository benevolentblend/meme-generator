var _ = require('lodash');

module.exports = function(app, models) {

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

          var uri = fullUrl + '/meme-' + scenarioId + '-' + eventId + '-' + kindId + '.jpg';

          return res.json({
            'color': 'yellow',
            'message': '<img alt="randommeme" src="' + uri + '">',
            'notify': false,
            'message_format': 'html'
          });
        });
      })
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
        var uri = fullUrl + '/meme-' + scenarioId + '-' + eventId + '.jpg';

        return res.json({
          'color': 'yellow',
          'message': '<img alt="randommeme" src="' + uri + '">',
          'notify': false,
          'message_format': 'html'
        });
      });
    });
  }

  app.post('/randommeme', rootRandomMemeHipchat);
  app.post('/spicymeme', rootSpicyMemeHipchat);
}
