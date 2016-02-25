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