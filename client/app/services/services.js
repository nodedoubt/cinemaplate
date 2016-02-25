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

  return {
    generateMatch: generateMatch
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

    })
    .catch(function(err){

    })
  };

  var signup = function(user){
    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    })
    .then(function(resp){

    })
    .catch(function(err){
      
    })
  };

  return {
    signin: signin,
    signup: signup
  }
}])
