var request = require('request');
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
          'id': kinds[i]._id
        };
      }

      res.render('kind/index.ejs', {'kinds': data});
    });
  }

  var kindNew = function(req, res) {
    res.render('kind/new');
  }

  var saveImage = function(name, image, cb) {
    if(!name || !image) return cb('Error:: saveImage: No name or image buffer');

    var kind = new models.Kind({
      'name': name,
      'img': {
        'contentType': 'image/jpg',
        'data': image
      }
    });

    kind.save(cb);
  }

  var updateSaveImage = function(id, name, image, cb) {
    if(!id || !name || !image) return cb('Error:: updateSaveImage: No name or image buffer');

    models.Kind.update({'_id': id},
    {
      'name': name,
      'img': {
        'contentType': 'image/jpg',
        'data': image
      }
    }, cb);
  }

  var kindCreate = function(req, res) {
    var name = req.body.name, url = req.body.url, files = req.files;

    if(!name || !(url || (files && files.img && files.img.name))) return res.sendStatus(400);

    var cb = function(err, kind) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      res.redirect('/kind/' + kind.id);
    }

    if(url) {
      request({uri: url, encoding:null}, function(err, responce, body) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        saveImage(name, body, cb);
      });
    }
    else {
      saveImage(name, files.img.data, cb);
    }
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
        'id': kind._id
      };

      res.render('kind/view.ejs', {'kind': data});
    });
  }

  var kindImage = function(req, res) {
    var id = req.query.id || req.params.id;

    if(!id) return res.sendStatus(404);

    models.Kind.findOne({'_id': id}, function(err, kind) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      if(!kind) return res.sendStatus(404);

      res.type('jpg');
      res.send(kind.img.data);

    });
  };

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
        'id': kind._id
      };

      res.render('kind/edit.ejs', {'kind': data});
    });
  }

  var kindUpdate = function(req, res) {
    var id = req.query.id || req.params.id;
    var name = req.body.name, url = req.body.url, files = req.files;

    var cb = function(err) {
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }

      res.redirect('/kind/' + id);
    }

    if(!id || !(name || url || (files && files.img && files.img.name))) return res.sendStatus(400);

    if(!url && !(files && files.img && files.img.name)) {
      models.Kind.update({'_id': id}, {'name': name}, cb);
    }
    else if(url) {
      request({uri: url, encoding:null}, function(err, responce, body) {
        if(err) {
          console.error(err);
          return res.sendStatus(500);
        }

        updateSaveImage(id, name, body, cb);
      });
    }
    else {
      updateSaveImage(id, name, files.img.data, cb);
    }
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
  app.get('/kind/:id(\\d+)/image(.jpg)?', kindImage);
  app.get('/kind/:id(\\d+)/edit', kindEdit);
  app.post('/kind/:id(\\d+)/update', kindUpdate);
  app.get('/kind/:id(\\d+)/delete', kindDelete);
}
