var uuid = require('uuid');
var pg = require('pg');
var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}

exports.createSession = function(user, res){
  return new Promise (function(resolve, reject){

  var sessionId = uuid();
  var pgClient = new pg.Client(pgConConfig);
  var sqlSessionInsert = "INSERT INTO usersessions (user_id, session_id) VALUES ($1, $2)"
  var newSession = pgClient.query(sqlSessionInsert, [user, sessionId], function(err, result){
    if (err) {console.error('Error in insert into session')}
    else {return result}
  })

  newSession.on('end', function(){
    resolve(sessionId)
  })

  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
  })
}

exports.findSession = function(sessionId){
  return new Promise (function(resolve, reject){


  var pgClient = new pg.Client(pgConConfig);

  var sqlSelect = "SELECT * FROM usersessions WHERE session_id = $1" 
  var selectSession = pgClient.query(sqlSelect, [sessionId], function(err, result){
    if (err){console.error('error in userSearch ', err)}
    else {
      return result;
    }
  });

  selectSession.on('end', function(result){
    resolve(result.rows[0])
  })

  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
  })
}
