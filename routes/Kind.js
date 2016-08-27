module.exports = function(app, models) {
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

      res.render('kind/index.ejs', {'kinds': data});
    });
  }

  var kindNew = function(req, res) {
    res.render('kind/new');
  }

  var kindCreate = function(req, res) {
    var name = req.body.name, url = req.body.url;

    if(!name || !url) return res.sendStatus(400);

    var kind = new models.Kind({'name': name, 'url': url});
    kind.save(function(err) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      res.redirect('/kind');
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

      res.render('kind/view.ejs', {'kind': data});
    });
  }

  var kindEdit = function(req, res) {
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

      res.render('kind/edit.ejs', {'kind': data});
    });
  }

  var kindUpdate = function(req, res) {
    var id = req.query.id || req.params.id;
    var name = req.body.name, url = req.body.url;

    models.Kind.update({'_id': id}, {'name': name, 'url': url}, function(err) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      res.redirect('/kind');
    });
  }

  var kindDelete = function(req, res) {
    var id = req.query.id || req.params.id;

    models.Kind.remove({'_id': id}, function(err) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      models.Event.update({'kind': id}, {'kind': ''}, function(err) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        res.redirect('/kind');
      });
    });
  }

  app.get('/kind', kindRoot);
  app.get('/kind/new', kindNew);
  app.post('/kind/create', kindCreate);
  app.get('/kind/:id(\\d+)/', kindView);
  app.get('/kind/:id(\\d+)/edit', kindEdit);
  app.post('/kind/:id(\\d+)/update', kindUpdate);
  app.get('/kind/:id(\\d+)/delete', kindDelete);
}
