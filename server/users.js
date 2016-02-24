var Promise = require('bluebird')
var pg = require('pg');
var bcrypt = require('bcrypt-as-promised');
var sessions = require('./sessions.js')

var pgConString = '';
var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}

exports.signin = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var user = findUser(username)

  user.on('end', function(){
    if (user.length > 0){
      res.status(400).send("Username or Password Incorrect")
    } else {
      bcrypt.compare(password, user.password)
      .then(function(){
        var newSession = sessions.createSession(user)
        newSession.on('end', function(result){
          res.status(200).send()
        })
      })
      .catch(bcrypt.MISMATCH_ERROR, function(){
        res.status(400).send("Username or Password Incorrect")
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
  var found = findUser(username)

  if (found){
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
  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()  
}

exports.checkAuth = function(req, res){
  sessions.findSession()
}

var findUser = function(username){
  var pgClient = new pg.Client(pgConConfig);

  var userSearch = pgClient.query("SELECT * FROM users WHERE username = " + username, function(err, result){
    return result;
  })
  userSearch.on('end', function(result){
    console.log('result of findUser ', result)
    return result
  })
  pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
};
