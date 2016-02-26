'use strict';

angular.module('cinePlate.services', [])

.factory('Matches', ['$http', '$location', function ($http, $location) {

  var generateMatch = function (zip, data) {
    return $http({
      method: 'POST',
      url: '/api/match/' + zip,
      data: data
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err){
      $location.path('/500');
      return
    });
  };

  var generate1stMatch = function (zip) {
    return $http({
      method: 'GET',
      url: '/api/match/' + zip
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function (err){
      $location.path('/500');
      return err
    });
  };


  return {
    generateMatch: generateMatch,
    generate1stMatch: generate1stMatch
  };
}])


.factory('Auth', ['$http', '$location', function ($http, $location){
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/signin',
      data: user
    })
    .then(function(resp){
      return resp.data;
    })
    .catch(function(err){
      console.error("There was an error in Signin services ", err)
      return err.data
    })
  };

  var signup = function(user){
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function(resp){
      return resp.data;
    })
    .catch(function(err){
      console.error("There was an error in Signup services ", err) 
      return err.data    
    })
  };

  var fetchUser = function(){
    return $http({
      method: 'GET',
      url: '/userCombos'
    })
    .then(function(resp){
      return resp.data;
    })
    .catch(function(err){
      console.error("There was an error ", err)
      return err.data;
    })
  };

  var signout = function() {
    return $http({
      method: 'GET',
      ur: 'signout'
    })
    .then(function(resp){
      return resp.data
    })
    .catch(function(err){
      console.error("There was an error signing out")
    })
  };


  return {
    signin: signin,
    signup: signup,
    fetchUser: fetchUser,
    signout: signout
  }
}])

.factory('Nav', ['$http', '$location', function ($http, $location){
  var profilePage = function() {
    $location.path('/userProfile')
  };

  var signin = function() {
    $location.path('/signin')
  };

  var signup = function() {
    $location.path('/signup')
  };

  var home = function() {
    $location.path('/')
  };

  return {
    profilePage: profilePage,
    signin: signin,
    signup: signup,
    home: home
  }
}])

