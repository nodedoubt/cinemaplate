DROP SCHEMA public cascade; 
CREATE SCHEMA public;  

CREATE TABLE IF NOT EXISTS "genres" (
  "genre_id" SERIAL NOT NULL,
  "genre_name" varchar(100) NOT NULL,
  "genre_moviedb_id" INTEGER NOT NULL,
  CONSTRAINT genres_pk PRIMARY KEY ("genre_id")
);

INSERT INTO "genres" (genre_name, genre_moviedb_id) VALUES ('Action',28),('Adventure',12),('Animation',16),('Comedy',35),('Crime',80),('Documentary',99),('Drama',18),('Family',10751),('Fantasy',14),('Foreign',10769),('History',36),('Horror',27),('Music',10402),('Mystery',9648),('Romance',10749),('Science Fiction',878),('TV Movie',10770),('Thriller',53),('War',10752),('Western',37);


CREATE TABLE IF NOT EXISTS "movies" (
  "movie_id" SERIAL NOT NULL,
  "movie_title" VARCHAR(255) NOT NULL UNIQUE,
  "movie_summary" TEXT NOT NULL,
  "movie_url" TEXT,
  "movie_image_url" TEXT,
  "movie_rating" DECIMAL,
  "movie_release_date" DATE,
  "movie_genres" VARCHAR(255),
  "movie_shortlink" VARCHAR(255),
  "movie_large_image_url" VARCHAR(255),
  CONSTRAINT movies_pk PRIMARY KEY ("movie_id")
);



CREATE TABLE IF NOT EXISTS "restaurants" (
  "restaurant_id" SERIAL NOT NULL,
  "restaurant_name" varchar(255) NOT NULL,
  "restaurant_description" TEXT,
  "restaurant_phone" varchar(15),
  "restaurant_street_address" VARCHAR,
  "restaurant_city" VARCHAR,
  "restaurant_state" VARCHAR,
  "restaurant_zip" varchar,
  "restaurant_image_url" TEXT,
  "restaurant_url" TEXT,
  "restaurant_cuisines" TEXT,
  "restaurant_yelp_rating" DECIMAL,
  "restaurant_yelp_id" VARCHAR UNIQUE,
  CONSTRAINT restaurants_pk PRIMARY KEY ("restaurant_id")
);
