var pg = require('pg');
var yelp = require('./seed/helpers/yelpHelp');

// START Restaurant insert
var restaurantsByZip = function(pgConConfig, zipcode) {
  // returning here to make promise for index.js
  return yelp.getFoodByZip(zipcode)
    .then(function(data){
      //loop through each restaurant and get restaurant details
      console.log("Total Restaurants Returned: ", data.length)

      var sqlInsertRestaurants = 'INSERT INTO "restaurants" (restaurant_name,restaurant_description,restaurant_phone, restaurant_street_address, restaurant_city, restaurant_state, restaurant_zip, restaurant_image_url, restaurant_url, restaurant_yelp_rating, restaurant_yelp_id, restaurant_cuisines) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING restaurant_id'
      data.map(function(restaurant) {
        var listing = {
          name: restaurant.name,
          description: restaurant.snippet_text,
          phone: restaurant.display_phone,
          streetAddress: restaurant.location.display_address[0],
          city: restaurant.location.city,
          state: restaurant.location.state_code,
          zipCode: restaurant.location.postal_code,
          imageUrl: restaurant.image_url,
          eat24Url: restaurant.eat24_url,
          yelpRating: restaurant.rating,
          yelpId: restaurant.id,
          cuisinesLength: restaurant.categories.length,
          cuisines: ''
        }

        console.log('restaurant cuisine categories:', restaurant.categories);
        // push categories into temp array
        for (var j=0;j<listing.cuisinesLength;j++){
          listing.cuisines += (restaurant.categories[j][0]) + ', '
        }
        listing.cuisines = listing.cuisines.slice(0,-2)

        pg.connect(pgConConfig, function(err, client, done) {
          if (err){
            return console.log('could not connect to postgres', err);
          }
          client.query(sqlInsertRestaurants, [listing.name, listing.description, listing.phone, listing.streetAddress, listing.city, listing.state, listing.zipCode, listing.imageUrl, listing.eat24Url, listing.yelpRating, listing.yelpId, listing.cuisines], function (err, result){
            if (err){      
              console.log(err);           
              return console.log('error inserting restaurant.', err.message);
            }

            console.log('Inserting restaurant:', listing.name);
          })

          done(); // done inserting this restaurant!
      }) // pgClient connect
    }) // restaurant map
  })
}

module.exports = {
  addRestaurantsForZip: restaurantsByZip
}
