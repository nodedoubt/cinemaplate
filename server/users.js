var Promise = require('bluebird')
var pg = require('pg');
var pgClient = require('./db.js');
var bcrypt = require('bcrypt-as-promised');
var sessions = require('./sessions.js')

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

  //first check if the username is taken already
  var found = findUser(username)

  if (found.length > 0){
    res.status(400).send("Username already exists")
  }
  else {
    bcrypt.hash(password, 10).then(function(hashed){
      return pgClient.query("INSERT INTO users (username, password, location, email) VALUES (" username + ", " hashed + ", " location + ", " + email + ")")
    })
    .then(function(result){
      console.log('result from db user insert')
      res.status(201).send("User created")
    })
  }
}

exports.checkAuth = function(req, res){
  sessions.findSession()
}

var findUser = function(username){
  var userSearch = pgClient.query("SELECT * FROM users WHERE username = " + username, function(err, result){
    return result;
  })
  userSearch.on('end', function(result){
    console.log('result of findUser ', result)
    return result
  })
};



