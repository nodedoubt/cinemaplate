var pg = require('pg')

//
// Get Postgres rolling.
//
var pgConString = '';
if (process.env.NODE_ENV !== 'production') {
  // If trying to connect to DB remotely (ie, dev environment)
  // we need to add the ssl flag.
  pgConString = process.env.DATABASE_URL + '?ssl=true' || cinemaplate_dev;
} else {
  pgConString = process.env.DATABASE_URL;
}
module.exports = pgClient

var pgClient = new pg.Client(pgConString);	


pgClient.on('drain', function() {
  pgClient.end();
});

pgClient.connect()