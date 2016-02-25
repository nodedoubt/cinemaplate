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
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
  };
});
