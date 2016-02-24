var uuid = require('uuid')
// var pgClient = require('./db.js');


exports.createSession = function(user){
  var sessionId = uuid();
  var pgClient = new pg.Client(pgConConfig);
  var newSession = pgClient.query("INSERT INTO userSessions VALUES (" + user.user_id + ", " + sessionId + ")")

  newSession.on('end', function(result){
    return result;
  })
}

exports.findSession = function(sessionId){
  var pgClient = new pg.Client(pgConConfig);
  pgClient.query("SELECT * FROM userSessions WHERE session_id = " + sessionId);

  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
}
