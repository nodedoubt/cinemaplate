'use strict';

angular.module('cinePlate.match', [])

.controller('MatchCtrl', ['$scope', '$http', '$routeParams', 'Matches', 'Nav', 'Auth', function($scope, $http, $routeParams, Matches, Nav, Auth) {
  $scope.contentLoaded = false;
  $scope.type = 'Movie';
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


  $scope.navigation = function(){
    console.log("nav has been triggered")
    if ($scope.userChoice.page === 'My Profile'){
      Nav.profilePage()
    } else if ($scope.userChoice.page === 'Home') {
      Nav.home()
    } else if ($scope.userChoice.page === 'Sign In') {
      Nav.signin()
    } else if ($scope.userChoice.page === 'Sign Up') {
      Nav.signup()
    } else if ($scope.userChoice.page === 'Sign out') {
      //delete users cookie -- call to backend signout route
      Auth.signout()
    }
  }

  $scope.movieUnlocked = true;
  $scope.restaurantUnlocked = true;

  $scope.lockMovie = function(){
    if ($scope.movieUnlocked === true) {
      $scope.cycle = "Restaurant";
    } else {
      $scope.cycle = "";
    }

    if ($scope.restaurantUnlocked === false) {
      $scope.restaurantUnlocked = true;
    }
  $scope.movieUnlocked = !$scope.movieUnlocked

  }

  $scope.lockRestaurant = function(){
    if ($scope.type === "TV") {
          $scope.cycle = "TV"
    } else {
      $scope.cycle = "Movie"
    console.log("Lock Movie ", $scope.cycle)
        }
      if ($scope.movieUnlocked === false) {
        $scope.movieUnlocked = true;
      }
    $scope.restaurantUnlocked = !$scope.restaurantUnlocked
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
    if ($scope.cycle === "Restaurant") {
      var toKeep = $scope.movie
    } else if ($scope.cycle === "") {
      var toKeep = "";
    } else {
      var toKeep = $scope.restaurant
    }
    var data = {type: $scope.type, genre: $scope.genre, cycle: $scope.cycle, cuisine: $scope.cuisine, toKeep: toKeep}
    $scope.contentLoaded = false;
    $scope.isActive = true;
    Matches.generateMatch($routeParams.zip, data)
      .then(function (response) {
        console.log("whole response object ", response)
        $scope.restaurant = response.restaurant || {restaurant_city: "",
                                                    restaurant_cuisines: "",
                                                    restaurant_description: "It looks like no restaurants in your area deliver! I'm sorry. Here's a picture of a puppy to make you feel better.",
                                                    restaurant_id: undefined,
                                                    restaurant_image_url: "http://i1074.photobucket.com/albums/w404/natalieweb/Screen%20Shot%202016-02-26%20at%2011.05.08%20AM_zpsshaezdgy.png",
                                                    restaurant_name: "No delivery here",
                                                    restaurant_phone: "",
                                                    restaurant_state: "",
                                                    restaurant_street_address: "",
                                                    restaurant_url: "",
                                                    restaurant_yelp_id: "",
                                                    restaurant_yelp_rating: "",
                                                    restaurant_zip: ""
                                                  };
        console.log($scope.restaurant);
        console.log("response.movie ", response.movie)
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
        $scope.restaurant = response.restaurant || {restaurant_city: "",
                                                    restaurant_cuisines: "",
                                                    restaurant_description: "It looks like no restaurants in your area deliver! I'm sorry. Here's a picture of a puppy to make you feel better.",
                                                    restaurant_id: undefined,
                                                    restaurant_image_url: "http://i1074.photobucket.com/albums/w404/natalieweb/Screen%20Shot%202016-02-26%20at%2011.05.08%20AM_zpsshaezdgy.png",
                                                    restaurant_name: "No delivery here",
                                                    restaurant_phone: "",
                                                    restaurant_state: "",
                                                    restaurant_street_address: "",
                                                    restaurant_url: "",
                                                    restaurant_yelp_id: "",
                                                    restaurant_yelp_rating: "",
                                                    restaurant_zip: ""
                                                  };
        $scope.movie = response.movie;
        $scope.contentLoaded = true;
        $scope.isActive = !$scope.isActive;
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.saveMovie = function(){
    var data = {type: $scope.type, work: $scope.movie}
    Matches.saveWork(data)
    .then(function(resp){
      console.log("work has been saved")
    })
  }

  $scope.saveCombo = function(){
    var data = {type: $scope.type, work: $scope.movie, restaurant: $scope.restaurant}
    Matches.saveCombo(data)
    .then(function(resp){
      console.log("combo has been saved")
    })
  }

  $scope.saveRestaurant = function(){
    var data = {restaurant: $scope.restaurant}
    Matches.saveRestaurant(data)
    .then(function(resp){
      console.log("restaurant has been saved")
    })
  }

  $scope.generate1stMatch();

}])
