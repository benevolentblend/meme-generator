var caption = require('caption');
var fileExists = require('file-exists');
module.exports = function(app, models) {
  var memeView = function(req, res) {
    var scenarioId = req.params.scenarioId, eventId = req.params.eventId,
      kindId = req.params.kindId, cached= req.query.cached;

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

          var outputFile = '/tmp/meme-' + scenarioId + '-' + eventId + '-' + kindId + '.jpg';
          var url = kind.url;

          if(!url.endsWith('.jpg') && !url.endsWith('.png')) {
            url += '.jpg';
          }

          console.log(url);

          if(fileExists(outputFile) && !cached) {
            return res.type('jpg').sendFile(outputFile);
          }

          caption.url(url, {
            'caption': scenario.value,
            'bottomCaption': event.value,
            'outputFile': outputFile,
          }, function(err, captionedImage) {
            if(err) {
              console.error(err);
              return res.sendStatus(500);
            }

            console.log('Generating image: "' + captionedImage + '"');

            res.type('jpg').sendFile(captionedImage);
          });
        });
      });
    });
  }

  app.get('/meme-:scenarioId(\\d+)-:eventId(\\d+)(.jpg)?', memeView);
  app.get('/meme-:scenarioId(\\d+)-:eventId(\\d+)-:kindId(\\d+)(.jpg)?', memeView);
}
