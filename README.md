# CinemaPlate

[![Stories in Ready](https://badge.waffle.io/travel-consensus/cinemaplate.svg?label=ready&title=Ready)](http://waffle.io/travel-consensus/cinemaplate)
[![Stories in Progress](https://badge.waffle.io/travel-consensus/cinemaplate.svg?label=in%20progress&title=In%20Progress)](http://waffle.io/travel-consensus/cinemaplate)
[![Build Status](https://travis-ci.org/travel-consensus/cinemaplate.svg?branch=master)](https://travis-ci.org/travel-consensus/cinemaplate)

## Getting Started

    $ npm install
    $ npm start
    
### Local Development (DB)

Follow full instructions in db/db_setup.js.

## Tests

There is a basic test framework in your `test/` folder. To run the tests, simply run `npm test`.

## Continuous Integration

On every pull request Travis will automatically run and perform the following:

 - Perform clone from the master brach at the specific pull request.
 - Create a Docker container from the cloned repo.
 - Read the travis.yml file from the root directory of the repo for the Node version.
 - Run npm install.
 - Start the server.
 - Run tests from the test directory.

If any of the above fail, travis will report on what went wrong on the Github pull request page.

## Browserify Middleware

Cinemaplate is built on top of node-catapult. The browserify-middleware piece of catapult provides concatening JavaScript and SCSS files.

- For JavaScript files middleware will look to client/app/app.js.
- For SCSS files, middleware will look at client/scss/app.scss.

##Environment Variables

The Yelp API requires 4 separate keys in order to access, however all 4 are provided in one request after creating an account at:
https://www.yelp.com/developers/.

Instructions for accessing The Movie Database API are available here:
https://www.themoviedb.org/documentation/api

## Stack

 - PostgreSQL
 - Angular.js
 - Node.js
 - Express.js

##Database
See ```references``` directory

##Data Flow

The most challenging part of the data flow is cross-referencing the Reddit API with the Movie Database API. 

The Reddit API returns 100 results, which are then sent through the MovieDB API. 

MovieDB returns loose matches, so we then filter those results for an exact match.

Reddit API provides the Netflix url link, and MovieDB provides the summary and rating.

These are combined and inserted into the database as a single movie.

The Yelp API returns 200 restaurants based on the provided zipcode, which is then filtered by those with Eat24 capabilities.

Once the database is populated with restaurants and movies, we simply return a random row from each table and display them to the user.

## Road Map
  - Incorporate ingelligent movie/food pairings
  - Add API calls if a zipcode is not already in the database
  - Allow a movie or food option to be 'locked' and spin again for the cooresponding pairing.
  - Allow users to sign in and save a pairing, or review/comment on effective pairings.
