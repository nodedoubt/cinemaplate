var Promise = require('bluebird')
var jwt = require('jwt-simple'); //JSON webToken encoding and decoding tool
var pg = require('pg');
var bcrypt = require('bcrypt-as-promised');
var SALT_WORK_FACTOR  = 10;

exports.signin = function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var user = findUser(username)

  if (user.length > 0){
    res.status(400).send("Username or Password Incorrect")
  } else {
    bcrypt.compare(password, user.password)
    .then(function(){
      //send to session maker
    })
    .catch(bcrypt.MISMATCH_ERROR, function(){
      res.status(400).send("Username or Password Incorrect")
    })
  }

}

exports.signup = function(req, res){
  var pgClient = new pg.Client(pgConString)
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
      return pgClient.query("INSERT INTO users (username, password, location, email) VALUES (" username + "," hashed + "," location + "," + email + ")")
    })
    .then(function(result){
      console.log('result from db user insert')
      res.status(201).send("User created")
    })
  }

  pgClient.on('drain', function() {
    pgClient.end();
  });
  pgClient.connect()
}

exports.checkAuth = function(){

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


