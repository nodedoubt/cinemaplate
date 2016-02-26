'use strict';

angular.module('cinePlate.profile', [])


.controller('ProfileCtrl', function($scope, $window, Auth, Nav){
  $scope.userStats = {}

  $scope.user = {
    password: '',
    location: '',
    email: ''
  }

  $scope.passClicked = false;
  $scope.emailClicked = false;
  $scope.locationClicked = false;

  $scope.showPass = function(){
    $scope.passClicked = !$scope.passClicked;
  }
  $scope.showEmail = function(){
    $scope.emailClicked = !$scope.emailClicked;
  }
  $scope.showLocation = function(){
    $scope.locationClicked = !$scope.locationClicked;
  }

  $scope.fetchUserStats = function(){
    Auth.fetchUser()
    .then(function(resp){
      $scope.userStats = resp;
      console.log("user stats ", $scope.userStats)
    })
    .catch(function(resp){
      console.error('Can not fetch User data. Are you logged in?')
      console.error('Error in fetch user data ', err)
    })
  }

  $scope.changeStats = function(){
    Auth.changeStats($scope.user)
    .then(function(resp){
      console.log("response from changeStats ", resp)
      $scope.passClicked = false;
      $scope.emailClicked = false;
      $scope.locationClicked = false;
      $scope.fetchUserStats();
    })
  }

  $scope.fetchUserStats();
})