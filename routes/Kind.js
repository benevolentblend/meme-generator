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

      res.render('kind/index.ejs', {kinds: data});
    });
  }

  var kindCreate = function(req, res) {
    var name = req.query.name, url = req.query.url;

    if(!name || !url) return res.sendStatus(400);

    var kind = new models.Kind({'name': name, 'url': url});
    kind.save(function(err) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      var data = {
        'name': kind.name,
        'url': kind.url,
        'id': kind._id
      };

      res.json(data);
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

      res.render('kind/view.ejs', {kind: data});
    });
  }

  app.get('/kind', kindRoot);
  app.get('/kind/create', kindCreate);
  app.get('/kind/:id', kindView);
}
