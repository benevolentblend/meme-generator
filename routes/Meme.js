var _ = require('lodash');
var caption = require('caption');
var request = require('request');
var fileExists = require('file-exists');
var async = require('async');
var models = require('../database');
var logs = require('../logs');


var memeViewQueue = async.queue(function(ctx, done) {
  var req = ctx.req;
  var res = ctx.res;

  var scenarioId = req.params.scenarioId, eventId = req.params.eventId,
      kindId = req.params.kindId, cached= req.query.cached;
  var outputFile = '/tmp/meme-' + scenarioId + '-' + eventId + (kindId ? '-' + kindId : '') + '.jpg';
  async.waterfall([
    function(cb) {
      async.auto({
        scenario: function(cb) {
          models.Scenario.findById(scenarioId).then(function(scenario) {
            if ( scenario )
              cb(null, scenario);
            else
              cb('Scenario not found');
          }).then(null, cb);
        },

        kind: ['event', function(data, cb) {
          if ( !kindId )
            kindId = data.event.kind;
          models.Kind.findById(kindId).then(function(kind) {
            if ( kind )
              cb(null, kind);
            else
              cb('Kind not found');
          }).then(null, cb);
        }],

        event: function(cb) {
          models.Event.findById(eventId).then(function(event) {
            if ( event )
              cb(null, event);
            else
              cb('Event not found');
          }).then(null, cb);
        }
      }, cb);
    },


    // Check if an image is already cached
    function(data, cb) {
      if ( fileExists(outputFile) ) {
        logs.debug(outputFile + ': exists, using cache');
        cb(null, data, outputFile);
      }
      else { // Need to generate it
        logs.debug(outputFile + ': need to generate');
        cb(null, data, null);
      }
    },

    // Generate if we need to
    function(data, image, cb) {
      if ( image )
        cb(null, image);
      else {
        var fullUrl = req.protocol + '://' + req.get('host');
        var image = '/kind/' + data.kind.id + '/image.jpg';
        var url = fullUrl + image;
        logs.verbose(outputFile + ' creating image with params: ', {
          'caption': data.scenario.value,
          'bottomCaption': data.event.value,
          'outputFile': outputFile,
        });

        caption.url(url, {
          'caption': data.scenario.value,
          'bottomCaption': data.event.value,
          'outputFile': outputFile,
        }, function(err, img) {
          cb(err, img);
        });
      }
    }

  ], function(err, image) {
    if ( err )
      res.status(500).send(err);
    else {
      res.type('jpg').sendFile(image);
    }
    done();
  });
}, 1);


module.exports = function(app, models) {

  var memeView = function(req, res) {
    memeViewQueue.push({req:req, res:res}, function(err) {});
  }

  var randomMeme = function(req, res) {
    var cached = req.query.cached;

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
          var filename = '/meme-' + scenarioId + '-' + eventId + '-' + kindId + '.jpg'
          var uri = fullUrl + filename;

          if(cached) {
            uri += '?cached=false';
          }

          request.get(uri).pipe(res);
        });
      })
    });
  }


  var spicyMeme = function(req, res) {
    var cached = req.query.cached;

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
        var filename = '/meme-' + scenarioId + '-' + eventId + '.jpg'
        var uri = fullUrl + filename;

        if(cached) {
          uri += '?cached=false';
        }

        request.get(uri).pipe(res);
      });
    });
  }

  app.get('/meme-:scenarioId(\\d+)-:eventId(\\d+)(.jpg)?', memeView);
  app.get('/meme-:scenarioId(\\d+)-:eventId(\\d+)-:kindId(\\d+)(.jpg)?', memeView);
  app.get('/randommeme(.jpg)?', randomMeme);
  app.get('/spicymeme(.jpg)?', spicyMeme);
}
