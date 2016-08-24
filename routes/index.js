module.exports = function(app, models) {
  require('./Kind')(app, models);
  require('./Scenario')(app, models);
  require('./Event')(app, models);
  require('./Meme')(app, models);
}
