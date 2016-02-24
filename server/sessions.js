var uuid = require('uuid')
// var pgClient = require('./db.js');


exports.createSession = function(user, res){
  var sessionId = uuid();
  var pgClient = new pg.Client(pgConConfig);
  var sqlSessionInsert = "INSERT INTO userSessions VALUES ($1, $2)"
  var newSession = pgClient.query(sqlSessionInsert, [user, sessionId])

  newSession.on('end', function(result){
    res.status(200).send({session: sessionId})
  })

  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
}

exports.findSession = function(sessionId){
  var pgClient = new pg.Client(pgConConfig);
  var selectSession = pgClient.query("SELECT * FROM userSessions WHERE session_id = " + sessionId);



  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
}
