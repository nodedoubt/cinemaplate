var rp = require('request-promise');
var Promise = require('bluebird');
var trailer = module.exports;
var pg = require('pg');

var pgConConfig = {
  database: "cinemaplate_dev",
  host: "localhost",
  port: 5432
}
// if (process.env.NODE_ENV !== 'production') {
//   // If trying to connect to DB remotely (ie, dev environment)
//   // we need to add the ssl flag.
//   pgConString = process.env.DATABASE_URL + '?ssl=true';
// } else {
//   pgConString = process.env.DATABASE_URL;
// }
var pgClient = new pg.Client(pgConConfig);


pgClient.connect(function(err){
   if (err){
        return console.log('could not connect to postgres', err);
   }
})


trailer.getIds = function(){
  //grab ids for all movies in our db
  var ids = [];

  var sqlGetApiId = 'SELECT movie_api_id FROM "movies"'

  pgClient.query(sqlGetApiId, function(err, result){
    if (err){
      return console.error("error getting movie ids: ", err);
    }
    else {
      console.log(result);
      //TODO: push all the ids from the api response into "ids" array
    }
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
