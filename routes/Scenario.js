module.exports = function(app, models) {
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

  var scenarioNew = function(req, res) {
    res.render('scenario/new');
  }

  var scenarioCreate = function(req, res) {
    var value = req.body.value;

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

      res.render('scenario/view.ejs', {'scenario': data});
    });
  }


  app.get('/scenario', scenarioRoot);
  app.get('/scenario/new', scenarioNew);
  app.post('/scenario/create', scenarioCreate);
  app.get('/scenario/:id(\\d+)/', scenarioView);
};
