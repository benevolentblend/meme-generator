/**
 * database.js
 *
 * Database setup and models
 */

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/meme-gen');

var db = mongoose.connection;

autoIncrement.initialize(db);

var ScenarioSchema = mongoose.Schema(require('./models/Scenario'));
var EventSchema = mongoose.Schema(require('./models/Event'));
var KindSchema = mongoose.Schema(require('./models/Kind'));

ScenarioSchema.plugin(autoIncrement.plugin, 'Scenario');
EventSchema.plugin(autoIncrement.plugin, 'Event');
KindSchema.plugin(autoIncrement.plugin, 'Kind');

var Scenario = mongoose.model('Scenario', ScenarioSchema);
var Event = mongoose.model('Event', EventSchema);
var Kind = mongoose.model('Kind', KindSchema);

var database = {
  'Scenario': Scenario,
  'Event': Event,
  'Kind': Kind
};


db.on('err', console.error.bind(console, 'console error:'));
db.once('open', function() {
  console.log('Mongodb connected.');
});

module.exports = database;
