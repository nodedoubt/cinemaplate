'use strict';

angular.module('cinePlate.splash', ["ngAutocomplete"])

.controller('SplashCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

  $scope.PlaceHolder = 'Enter your zip...';


  $.getJSON('//ip-api.com/json?callback=?', function(data) {
  console.log(JSON.stringify(data, null, 2));
    $scope.zip = data.zip;
    $scope.$apply();
  });

  $scope.getZip = function (dropdown) {
	  var limit_5 = Number($scope.zip.match(/\b\d{5}\b/g))
    
    if(limit_5){
      $location.path('/' + limit_5);
      $scope.$apply()
    } else {
      $scope.PlaceHolder = 'Invalid zip code!';
    	console.log('no redirect; $scope.zip:', $scope.zip);
      $scope.zip = '';
    }
  }
}])
