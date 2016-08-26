var caption = require('caption');

module.exports = function(app, models) {
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

          caption.url(kind.url, {
            'caption': scenario.value,
            'bottomCaption': event.value,
            'minWidth': 700
          }, function(err, captionedImage) {
            if(err) {
              console.error(err);
              return res.sendStatus(500);
            }

            console.log(captionedImage);

            res.type('jpg').sendFile(captionedImage);
          });
        });
      });
    });
  }

  app.get('/meme-:scenarioId(\\d+)-:eventId(\\d+)(.jpg)?', memeView);
  app.get('/meme-:scenarioId(\\d+)-:eventId(\\d+)-:kindId(\\d+)(.jpg)?', memeView);
}
