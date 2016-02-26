'use strict';

angular.module('cinePlate.match', [])

.controller('MatchCtrl', ['$scope', '$http', '$routeParams', 'Matches', function($scope, $http, $routeParams, Matches) {
  $scope.contentLoaded = false;
  $scope.type = '';
  $scope.genre = '';
  $scope.cycle = '';
  $scope.cuisine = '';

  //different types to populate the dropdown menu
  $scope.pages = ['My Profile', 'Home', 'Sign In', 'Sign Up', 'Sign out'];
  $scope.clicked = false;
  //create an empty object to store form data
  $scope.userChoice = {
    page: ''
  };

  //navbar dropdown functionality:
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  }

  $scope.stars = [1, 2, 3, 4, 5];
  $scope.movie = { 
    title: 'Kung Fu Panda',
    rating: 4
  }

  $scope.searchZip = $routeParams.zip;
  $scope.restaurant = {};
  $scope.movie = {};

  $scope.generateMatch = function () {
    var data = {type: $scope.type, genre: $scope.genre, cycle: $scope.cycle, cuisine: $scope.cuisine}
    $scope.contentLoaded = false;
    $scope.isActive = true;
    Matches.generateMatch($routeParams.zip, data)
      .then(function (response) {
        console.log(response)
        $scope.restaurant = response.restaurant;
        $scope.movie = response.movie;
        $scope.contentLoaded = true;
        $scope.isActive = !$scope.isActive;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

    $scope.generate1stMatch = function () {
    $scope.contentLoaded = false;
    $scope.isActive = true;
    Matches.generate1stMatch($routeParams.zip)
      .then(function (response) {
        console.log(response)
        $scope.restaurant = response.restaurant;
        $scope.movie = response.movie;
        $scope.contentLoaded = true;
        $scope.isActive = !$scope.isActive;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.generate1stMatch();

}])
