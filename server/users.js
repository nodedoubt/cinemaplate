var Promise = require('bluebird')
var pg = require('pg');
var bcrypt = require('bcrypt-as-promised');
var sessions = require('./sessions.js');

var pgConConfig = (process.env.NODE_ENV === 'production') ?  process.env.DATABASE_URL : {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
};

exports.signin = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  findUser(username).then(function(found){

    if (!found.rowCount){
      res.status(400).send("Username Incorrect")
    } else {
      console.log('found inside signin ', found.rows)
      bcrypt.compare(password, found.rows[0].password)
      .then(function(){
        console.log('result from findUser ', found)
        return sessions.createSession(found.rows[0].user_id)
      })
      .catch(bcrypt.MISMATCH_ERROR, function(){
        res.status(400).send("Password Incorrect")
      })
      .then(function(sessionId){
        res.setHeader('Set-Cookie', 'sessionId=' + sessionId)
        res.status(200).send({success: "User is now logged in", user: found.rows[0]})
      })
    }
  })
}

exports.signup = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var location = req.body.location;
  var email = req.body.email;
  var pgClient = new pg.Client(pgConConfig);
  console.log('req.body inside sign up ', req.body)
  //first check if the username is taken already
  findUser(username).then(function(found){
    console.log('found after the then ', found)
  if (found.rowCount){
    res.status(400).send("Username already exists")
  }
  else {
    bcrypt.hash(password, 10).then(function(hashed){
      console.log('hashed key ', hashed)
      var sqlInsertUser = "INSERT INTO users (username, password, location, email) VALUES ($1, $2, $3, $4) RETURNING username";
      var insert = pgClient.query(sqlInsertUser, [username, hashed, location, email])
      insert.on('end', function(result){
        console.log('returned from insert ', result)
        res.status(201).send({confirm: "User created", user: result})
      })
      insert.on('error', function(err){
        console.log('Error in insert ', err)
      })
    })
  }
  })
  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()  
}

exports.checkAuth = function(req, res){
  sessions.findSession()
}

var findUser = function(username){
  return new Promise (function(resolve, reject) {
          
  var found;
  var pgClient = new pg.Client(pgConConfig);

  var userSelect = "SELECT * FROM users WHERE username = $1"
  var userSearch = pgClient.query(userSelect, [username], function(err, result){
    if (err){console.error('error in userSearch ', err)}
    else {
      return result;
    }
  })
  userSearch.on('end', function(result){
    console.log('result of findUser ', result)
   resolve(result)
  })
  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()


  })

};
