var pg = require('pg')

exports.pgClient = new pg.Client(pgConString);	


pgClient.on('drain', function() {
  pgClient.end();
});

pgClient.connect()