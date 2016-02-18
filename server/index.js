var browserify = require('browserify-middleware');
var express = require('express');
var Path = require('path');
var pg = require('pg');
var yelp = require('./yelpHelp');
// <<<<<<< 4bd53468d1d30e60bae0406e82116cff22d06f66
var sass = require('node-sass-endpoint');
// =======
var sass = require('node-sass-endpoint')
// >>>>>>> initial folder structure for scss
//
// Get Postgres rolling.
//
var pgConString = '';
if (process.env.NODE_ENV !== 'production') {
  // If trying to connect to DB remotely (ie, dev environment)
  // we need to add the ssl flag.
  pgConString = process.env.DATABASE_URL + '?ssl=true';
} else {
  pgConString = process.env.DATABASE_URL;
}

var routes = express.Router();

//still need to fold into routes.get
yelp.getFoodByZip(78701)
.then(function(res){
    // console.log('i am the res', res); 
    return res
})
.then(function(data){
    var counter = 0
      for (var key in data){
        if (data[key] !== undefined){
          var parsed = JSON.parse(JSON.stringify(data[key]))
          var keys = Object.keys(parsed)
          for (var i =0;i<keys.length;i++){
            counter++
            //preparing data for sql inserts
            console.log(counter, ">>>", parsed[keys[i]].name)
            //temp values for inserting in db
              
                var restName = parsed[keys[i]].name
                // restDescription = parsed[keys[i]].snippet_text
                var restPhone = parsed[keys[i]].display_phone
                var restAddress = parsed[keys[i]].location.display_address
                var restZipCode = parsed[keys[i]].location.postal_code
                // restHours = parsed[keys[i]].
                // restPriceRange = parsed[keys[i]].
                var restImageUrl = parsed[keys[i]].image_url
                var restEat24Url = parsed[keys[i]].eat24_url
                var restYelpRating = parsed[keys[i]].rating
                var restYelpId = parsed[keys[i]].id
                var restCategoriesLength = parsed[keys[i]].categories.length
                var restCategories = []

                for (var j=0;j<restCategoriesLength;j++){
                  //push categories into temp array
                  restCategories.push(parsed[keys[i]].categories[j][1])
                }
                
            // console.log(restCategories)
            pgClient = new pg.Client(pgConString)
              pgClient.connect(function(err){
                if (err){
                  return console.error('could not connect to postgres', err);
                }
                var sqlString = 'INSERT INTO "restaurants" (restaurant_name,restaurant_phone) VALUES ($1, $2) RETURNING restaurant_id'
                pgClient.query(sqlString, [restName,restPhone]), function (err, result){
                    if (err){
                      return console.error('error running query', err);
                    }
                    console.log(result.rows)
                    res.send(result.rows);
                    pgClient.end();
                }
              });
              };
              
            }
        }
      
      return data
     console.log(data)
});

//
// Provide a browserified file at a specified path
//
routes.get('/app-bundle.js',
  browserify('./client/app.js'));

// <<<<<<< 4bd53468d1d30e60bae0406e82116cff22d06f66
routes.get('/css/app-bundle.css', sass.serve('./client/public/scss/app.scss'));
// =======
routes.get('/css/app-bundle.css',
  sass.serve('./client/public/scss/app.scss'))

// >>>>>>> initial folder structure for scss
//
// Match endpoint to match movie genres with cuisines
//
routes.get('/api/match/:zip', function(req, res) {
  var zip = req.params.zip;

  var pgClient = new pg.Client(pgConString);
  pgClient.connect(function(err){
    if (err){
      return console.error('could not connect to postgres', err);
    }
    pgClient.query('SELECT * FROM "genres"', function (err, result){
      if (err){
        return console.error('error running query', err);
      }
      console.log(result.rows)
      res.send(result.rows);
      pgClient.end();
    });
  });
});

routes.get('/api/genres', function(req, res){
  res.send("Hello")
});


routes.get('/', function(req, res){
  res.sendFile( assetFolder + '/index.html' );
});

//
// Static assets (html, etc.)
//
var assetFolder = Path.resolve(__dirname, '../client/public');
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