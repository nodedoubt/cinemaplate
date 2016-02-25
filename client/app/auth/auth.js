angular.module('cinePlate.auth', [])

.controller('AuthController', function ($scope, $window, $location, Auth) {
  $scope.user = {
    username: '',
    password: '',
    location: '',
    email: ''
  };

  $scope.signin = function () {
    Auth.signin($scope.user)
    .then(function(resp){

    })
    .catch(function(err){
      console.error('error in signin ', err)
    })
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
    .then(function(resp){

    })
    .catch(function(err){
      console.error('error in signup ', err)
    })
  };
});
