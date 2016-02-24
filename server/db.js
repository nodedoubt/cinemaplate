var pg = require('pg')

//
// Get Postgres rolling.
//
var pgConString = '';
var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}
module.exports = pgClient

var pgClient = new pg.Client(pgConConfig);	


pgClient.on('drain', function() {
  pgClient.end();
});

pgClient.connect()
