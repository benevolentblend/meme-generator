/**
 * database.js
 *
 * Database setup and models
 */

var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
var logs = require('./logs');

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://' + (process.env.DATABASE || 'localhost') + '/meme-gen', {
  useMongoClient: true,
});

var db = mongoose.connection;

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
  logs.always('Mongodb connected.');
});

module.exports = database;
