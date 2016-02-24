var browserify = require('browserify-middleware');
var express = require('express');
var Path = require('path');
var pg = require('pg');
var routes = express.Router();
var sass = require('node-sass-endpoint');
var User = require('./users.js');
// var pgClient = require('./db.js');
var sessions = require('./sessions.js')
var cookieParser = require('cookie-parser')
var combo = require('./combos.js')

require('../db/seed/seedRestaurant.js');
require('../db/seed/seedMovie.js');
require('../db/seed/seedTv.js')


//
// Get Postgres rolling.
//
var pgConString = '';
var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}

//
// Provide a browserified file at a specified path
//
routes.get('/app-bundle.js', browserify('./client/app/app.js'));
routes.get('/css/app-bundle.css', sass.serve('./client/scss/app.scss'));

routes.post('/signin', function(req, res, next){
  User.signin(req, res, next)
})
routes.post('/signup', function(req, res, next){
  User.signup(req, res, next)
})

routes.post('/saveWork', function(req, res, next){
  if (req.session){
    combo.saveWork(req, res)
  } else {
    res.status(401).send({Error: "User is not logged in"})
  }
})
routes.post('/saveRestaurant', function(req, res, next){
  if (req.session){
    combo.saveRestaurant(req, res)
  } else {
    res.status(401).send({Error: "User is not logged in"})
  }  
})
routes.post('/saveCombo', function(req, res, next){
  if (req.session){
    combo.saveCombo(req, res)
  } else {
    res.status(401).send({Error: "User is not logged in"})
  }
})
routes.get('/userCombos', function(req, res, next){
  if (req.session){
    combo.pullCombos(req, res)
  } else {
    res.status(401).send({Error: "User is not logged in"})
  }
})
//
// Match endpoint to match movie genres with cuisines
//
routes.get('/api/match/:zip', function(req, res) {
  var zip = req.params.zip;
  // Get first 3 zip digits for SQL "like" query.
  var slimZip = zip.slice(0,3);

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

pgClient.connect()

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

  app.use(cookieParser());

  app.use(function (req, res, next) {
    if (req.cookies.sessionId) {
      sessions.findSession(req.cookies.sessionId)
        .then(function(session) {
          req.session = session;
          next();
        });
    } else {
      // No session to fetch; just continue
      next();
    }
  })

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