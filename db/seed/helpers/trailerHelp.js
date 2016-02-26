var rp = require('request-promise');
var Promise = require('bluebird');
var trailer = module.exports;
var pg = require('pg');

var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}

var pgClient = new pg.Client(pgConConfig);


pgClient.connect(function(err){
   if (err){
        return console.log('could not connect to postgres', err);
   }
})

//Trailers Backend - breakdown:
  //1) seed ids to db [done]
  //3) get ids from db [done-ish]
  //2) for all ids:
      //a) query api (with id) for trailer
      //b) store trailer url in db (SQL UPDATE to the movie entry with the correct movie_api_id)


//TODO: slightly refactor .getIds to return a promise - we can use a .then() chain to make sure everything happens in the correct order!

trailer.getIds = function(){
  //grab ids for all movies in our db
  return new Promise(function(resolve, reject){

    var ids = [];

    var sqlGetApiId = 'SELECT movie_api_id FROM "movies"'

    pgClient.query(sqlGetApiId, function(err, result){
      if (err){
        reject();
        return console.error("error getting movie ids: ", err);
      }
      else {
        var idObjects = result.rows; 
        //idObjects is an array of objects, which all look like this: {movie_api_id : '12345'}
        idObjects.forEach(function(x){
          var newId = parseInt(x['movie_api_id']);
          ids.push(newId);
        });
          resolve(ids);
      }
    })
  })
}



trailer.getMovieDB_trailer = function(idObject){
//continue frome here.


    // var anObject = {},
    // allCalls = [],
    // arr,
    // len;
    
    // //the below allows for quick object lookup to verify that movieDB result matches the actual title from the reddit scrape
    // idObject.forEach(function(obj){
    //     anObject[obj.title] = obj.url;
    // })
    
    // //rate limit - moviedb only allows 40 calls every 10 seconds
    // //TODO add setInterval for more calls - time won't matter as this will only be a 1x a week population of the DB
    // arr = idObject.slice(0,40);
    // len = arr.length;

    // //build array for Promise.all
    // //TODO - use bluebird's Promise.map instead (This won't make a difference for user experience, so it will remain TODO. - JW-legacy)
    // for(var x = 0; x < len; x++){
    //     var escaped = escape(arr[x].title);
    //     allCalls.push(rp('http://api.themoviedb.org/3/search/trailer?query=' + escaped + '&api_key=' + process.env.MOVIEDB_TOKEN))
    // }
    
    // return Promise.all(allCalls)
    //         //broke these up for readability - feel free to merge if it makes more sense
    //         .then(function(res){
    //             return res.filter(function(obj){
    //                 var show = JSON.parse(obj);
    //                 //if no match, movieDB will return empty results array 
    //                 //anObject verifies that title is an exact match, since movieDB will match on any words
    //                 //i.e. search for 'The Walking Dead' may return results including 'The Talking Dead: Making of The Walking Dead'
    //                 return show.results.length !== 0 && anObject[show.results[0].name];
    //             })    
    //         })
    //         .then(function(res){
    //             //build the tvShow super object for SQL insertion
    //             return res.map(function(obj){
    //                var show = JSON.parse(obj);
    //                var currShow = show.results[0];
    //                // console.log("this is currShow: ", currShow)
    //                return {title: currShow.name, 
    //                        summary: currShow.overview, 
    //                        url: anObject[currShow.name],
    //                        img: 'https://image.tmdb.org/t/p/w185/' + currShow.poster_path, 
    //                        rating: Math.round(currShow.vote_average/2), 
    //                        releaseDate: currShow.first_air_date, 
    //                        genreArray: currShow.genre_ids
    //                       };
    //             })
    //         })
             
}
