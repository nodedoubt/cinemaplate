angular.module('cinePlate.auth', [])

.controller('AuthCtrl', function ($scope, $window, $location, Auth) {
  $scope.user = {
    username: '',
    password: '',
    location: '',
    email: ''
  };

  $scope.signin = function () {
    Auth.signin($scope.user)
    .then(function(resp){
      var location = resp.user.location
      $location.path('/' + location)
    })
    .catch(function(err){
      console.error('error in signin ', err)
    })
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
    .then(function(resp){
      $location.path('/' + $scope.user.location)
    })
    .catch(function(err){
      console.error('error in signup ', err)
    })
  };
});
