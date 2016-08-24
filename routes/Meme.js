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

          res.render('meme/view.ejs', {'scenario': scenario, 'event': event, 'kind': kind});
        });
      });
    });
  }

  app.get('/meme/:scenarioId/:eventId', memeView);
  app.get('/meme/:scenarioId/:eventId/:kindId', memeView);
}
