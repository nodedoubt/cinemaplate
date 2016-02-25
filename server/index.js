var browserify = require('browserify-middleware');
var express = require('express');
var Path = require('path');
var pg = require('pg');
var sass = require('node-sass-endpoint');


var pgConConfig;
if (process.env.NODE_ENV === 'production') {
  pgConConfig = process.env.DATABASE_URL;
} else {
  pgConConfig = {
    database: "development",
    host: "localhost",
    port: 5432
  }
}


//
// Provide a browserified file at a specified path
//
var routes = express.Router();
browserify.settings.production('minify', 'false');
routes.get('/app-bundle.js', browserify('./client/app/app.js'));
routes.get('/css/app-bundle.css', sass.serve('./client/scss/app.scss'));


/*
  Serve a random movie
*/
routes.get('/api/match/movie', function(request, response) {
  pg.connect(pgConConfig, function(error, client, done) {
    client.query("SELECT * FROM movies order by random() limit 1", function(err, result){
      if (error) {
        console.log('ERROR fetching movie from database.');
        response.status(500).send('Error fetching movie');
      }

      console.log('reporting random movie result:', result);
      response.send(result.rows[0]);
    });
  })
})

/*
  Add restaurants from this zipcode to the database and respond with
  a random movie.
*/
var Restaurants = require('../db/restaurantModel');
// Test code for separating restaurants from movies
/* routes.get('/api/match/restaurant/:zip', function(request, response) {
  var zip = request.params.zip;

  // Add restaurants for the submitted zip code to the database.
  // This is async with querying of restaurants, probably won't
  // populate restaurants before first query for zipcode
  Restaurants.addRestaurantsForZip(pgConConfig, zip);

  var slimZip = zip.slice(0, 3);
  pg.connect(pgConConfig, function(error, client, done) {
    client.query("SELECT * FROM restaurants WHERE restaurant_zip LIKE '" + slimZip + "%' order by random() limit 1", function(err, result){
      if (error) {
        console.log('ERROR fetching restaurant from database.');
        response.status(500).send('Error fetching restaurant');
      }

      console.log('reporting random restaurant result:', result);
      response.send(result.rows[0]);
    });   
  })
}) */


//
// Match endpoint to match movie genres with cuisines
//
routes.get('/api/match/:zip', function(req, res) {
  var zip = req.params.zip;
  // Check if zip is in the database. If not, addRestaurants. If so, go ahead with restaurant query.



  // Get first 3 zip digits for SQL "like" query.
  var slimZip = zip.slice(0,3);

  // Add restaurants for the submitted zip code to the database.
  // This is async with querying of restaurants, probably won't
  // populate restaurants before first query for zipcode
  Restaurants.addRestaurantsForZip(pgConConfig, zip)
  .then(function() {
    var combinedResult = {};
    var pgClient = new pg.Client(pgConConfig);
    var restaurantQuery = pgClient.query("SELECT * FROM restaurants WHERE restaurant_zip LIKE '" + slimZip + "%' order by random() limit 1", function(err, result){
      return result;
    });
    restaurantQuery.on('end', function(result) {
      combinedResult.restaurant = result.rows[0];
    });
    var movieQuery = pgClient.query("SELECT * FROM movies order by random() limit 1", function(err, result){
      return result;
    });
    movieQuery.on('end', function(result) {
      combinedResult.movie = result.rows[0];
      res.send(combinedResult)
    });
    pgClient.on('drain', function() {
      pgClient.end();
    });
    pgClient.connect();
  })
});



//
// Static assets (html, etc.)
//
var assetFolder = Path.resolve(__dirname, '../client');
routes.use(express.static(assetFolder));

if (process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/index.html' );
  });

  //
  // We're in development or production mode;
  // create and run a real server.
  //
  var app = express();

  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() );

  // Mount our main router
  app.use('/', routes);

  // Start the server!
  var port = process.env.PORT || 4000;
  app.listen(port);
  console.log("Listening on port", port);
}
else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}
