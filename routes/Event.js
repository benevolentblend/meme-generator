module.exports = function(app, models) {
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

      res.render('event/index.ejs', {'events': data});
    });
  }

  var eventNew = function(req, res) {
    models.Kind.find({}, function(err, kinds) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      res.render('event/new', {'kinds': kinds});
    });
  }

  var eventCreate = function(req, res) {
    var value = req.body.value, kind = req.body.kind;

    if(!value) return res.sendStatus(400);

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
        return res.render('event/view.ejs', {'event': data});
      }

      models.Kind.findOne({'_id':  event.kind}, function(err, kind) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        if(!kind) return res.render('event/view.ejs', {'event': data});
        else res.render('event/view.ejs', {'event': data, 'kind': kind});
      });
    });
  }

  app.get('/event', eventRoot);
  app.get('/event/new', eventNew);
  app.post('/event/create', eventCreate);
  app.get('/event/:id(\\d+)/', eventView);
}
