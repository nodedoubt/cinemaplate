/*
	initdb cinemaDB
		Create environment for databases to live
	postgres -D cinemaDB
		Open a connection to that database environment
	createdb development
		Create a database named development in cinemaDB directory
	psql "dbname=development options=--search_path=public" -f db/cinemaplate.sql
		Apply the db/cinemaplate.sql schema to the development database
	node db/db_setup.js
		Seed the database with information
*/

// not used yet
var env = process.env.NODE_ENV || 'development';
var config = {
	development: {
	  database: "development",
	  host: "localhost",
	  port: 5432
	},
	production: {
		database: 'milk',
		host: 'honey',
		port: 'vinegar'
	}
}

require('../db/seed/seedMovie.js');
require('../db/seed/seedRestaurant.js');
