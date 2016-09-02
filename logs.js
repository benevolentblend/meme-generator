/**
 * logs.js
 *
 * displays logs based on log level
 */

var levels = [
  'always',
  'warning',
  'debug',
  'verbose'
];

var logLevel = process.env.LOG_LEVEL || 0;

var copyArgs = function(args) {
  var argsArray = [];
  for(var i = 0; i < args.length; i++)
    argsArray[i] = args[i];

  return argsArray;
}

module.exports = {
  getLevel: function() {
    return levels[logLevel];
  },

  always: function() {
    var pass = copyArgs(arguments);
    pass.unshift('ALWAYS : ');
    console.log.apply(this, pass);
  },

  warning: function() {
    if(logLevel >= 1) {
      var pass = copyArgs(arguments);
      pass.unshift('WARNING: ');
      console.log.apply(this, pass);
    }
  },

  debug: function(log) {
    if(logLevel >= 2) {
      var pass = copyArgs(arguments);
      pass.unshift('DEBUG  : ');
      console.log.apply(this, pass);
    }
  },

  verbose: function(log) {
    if(logLevel >= 3) {
      var pass = copyArgs(arguments);
      pass.unshift('VERBOSE: ');
      console.log.apply(this, pass);
    }
  }
}
