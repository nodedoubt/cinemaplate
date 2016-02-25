var pg = require('pg');
var yelp = require('./helpers/yelpHelp');
var Promise = require('bluebird');

//
// Get PG config'd
//
var pgConString = '';
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

//
// START Restaurant insert
//

exports.addRestaurants = function(zip){

  //ideas to make return:
    //1) 
  return new Promise(function(resolve, reject){
    yelp.getFoodByZip(zip)
      .then(function(data){
          //loop through each restaurant and get restaurant details
          console.log("Total Restaurants Returned: ", data.length)
          console.log("Restaurant Object", data[0].location.city)


          //this is a real bear of a file... that has in turn been complicated by refactoring to return a promise.

          //allCalls will be populated with promises...
          var allCalls = [];

          //YOU NEED:
            //1) resolve() / reject
            //2) place the for loop in the right place.
            
          var addOneRestaurant = function(x){

            return new Promise(function(res, rej){

              var restName = data[x].name
              var restDescription = data[x].snippet_text
              var restPhone = data[x].display_phone
              var restStreetAddress = data[x].location.display_address[0]
              var restCity = data[x].location.city
              var restState = data[x].location.state_code
              var restZipCode = data[x].location.postal_code
              var restImageUrl = data[x].image_url
              var restEat24Url = data[x].eat24_url
              var restYelpRating = data[x].rating
              var restYelpId = data[x].id
              var restCuisinesLength = data[x].categories.length
              var restCuisines = ''
              // var newRestaurantID

              // push categories into temp array
              for (var j=0;j<restCuisinesLength;j++){
                restCuisines += (data[x].categories[j][0]) + ', '
              }

              console.log(x+1, ">>>", data[x].name)
              restCuisines = restCuisines.slice(0,-2)

              pgClient = new pg.Client(pgConConfig);
              pgClient.connect(function(err){
                if (err){
                  return console.log('could not connect to postgres', err);
                }
                var sqlInsertRestaurants = 'INSERT INTO "restaurants" (restaurant_name,restaurant_description,restaurant_phone, restaurant_street_address, restaurant_city, restaurant_state, restaurant_zip, restaurant_image_url, restaurant_url, restaurant_yelp_rating, restaurant_yelp_id, restaurant_cuisines) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING restaurant_id'
                
                var newRestaurants = pgClient.query(sqlInsertRestaurants, [restName, restDescription, restPhone, restStreetAddress, restCity, restState, restZipCode, restImageUrl, restEat24Url, restYelpRating, restYelpId, restCuisines], function (err, result){
                    if (err){ 
                      rej(err);  
                      console.error('error inserting restaurant.', err.message);          
                      return; 
                    }
                    else {
                      if (result.rows[0].restaurant_id !== undefined){
                        var newRestaurantID = result.rows[0].restaurant_id
                      }
                      console.log("NEW RESTAURANT ID: ", newRestaurantID)
                    }
                  })
                    newRestaurants.on('end', function(result){
                      console.log('a new restauarant called .on("end") here >> ', result);
                      res(); //resolve the promise
                      return result;
                    });
                    newRestaurants.on('error', function(err){
                      console.log('restaurant query error: ', err);
                      rej();
                      return err;
                    })
                  });
              });
            }

          for (var i =0;i<data.length;i++){
            allCalls.push(addOneRestaurant(i));
          }

          //THIS STATEMENT is '.then-able' once all of the restaurants have been added to the database.
          console.log("about to start allCalls");
          return Promise.all(allCalls) //HANGING right here... something isn't resolving.
              .then(function(res){
                console.log('all restaurants added to db! >>>')
                resolve(res);
              })
              //function(err){
              //   consol.log('one or more restaurants were not added. possibly, they were already in the db.');
              //   reject(res);
              // }
              .catch(function(err){
                console.error('error with allCalls: ', err);
                resolve(err); //should technically be reject, but that wasn't working;
              })
    })
    .catch(function(err){
      console.err("ERROR: Yelp had problems. ", err);
      reject();
    })
  })
}
