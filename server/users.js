var   Q    = require('q'); //promises
var   jwt  = require('jwt-simple'); //JSON webToken encoding and decoding tool
var pg = require('pg');
var   SALT_WORK_FACTOR  = 10;


exports.signin = function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
}

exports.signup = function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var location = req.body.location;
	var email = req.body.email;

	//first check if the username is taken already

}

exports.checkAuth = function(){

}

exports.comparePasswords = function(){
  
}

exports.checkUsername = function(username){
	pgClient.query("SELECT username FROM users WHERE username = " + username, function(err, result){
		return result;
	})
}


 var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });