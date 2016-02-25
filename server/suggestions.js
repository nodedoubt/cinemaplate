var pg = require('pg');

var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}


exports.getMovieSuggestion = function(req, res) {
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
    

  if (req.body.genre){
      var genre = req.body.genre;
      var genreSelect = "SELECT * FROM movies WHERE movie_genres = $1 order by random() limit 1"
      var movieQuery = pgClient.query(genreSelect, [genre], function(err, result){
        return result;
      });
      movieQuery.on('end', function(result) {
        combinedResult.movie = result.rows[0];
        res.send(combinedResult)
      });
    } else {
      var movieQuery = pgClient.query("SELECT * FROM movies order by random() limit 1", function(err, result){
        return result;
      });
      movieQuery.on('end', function(result) {
        combinedResult.movie = result.rows[0];
        res.send(combinedResult)
      });
    }
   
    pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
};

exports.getTVSuggestion = function(req, res) {
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

  if (req.body.genre){
      var genre = req.body.genre;
      var genreSelect = "SELECT * FROM tv WHERE tv_genres = $1 order by random() limit 1"
      var movieQuery = pgClient.query(genreSelect, [genre], function(err, result){
        return result;
      });
      movieQuery.on('end', function(result) {
        combinedResult.movie = result.rows[0];
        res.send(combinedResult)
      });
    } else {
      var movieQuery = pgClient.query("SELECT * FROM tv order by random() limit 1", function(err, result){
        return result;
      });
      movieQuery.on('end', function(result) {
        combinedResult.movie = result.rows[0];
        res.send(combinedResult)
      });
    }
   
    pgClient.on('drain', function() {
    pgClient.end();
  });

  pgClient.connect()
}
