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

  app.get('/', rootIndex);

  require('./Kind')(app, models);
  require('./Scenario')(app, models);
  require('./Event')(app, models);
  require('./Meme')(app, models);
}
