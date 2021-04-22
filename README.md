# 90s-Movie-API

This project creates a simple API focused in top 90's films.

## Tools Used

Language 

```Javascript```

Server Enviorment

```Node.js```

Framework  

```Express```

DataBase

```MongoDB```


## Getting Started

You'll need to [install Node.js](https://nodejs.org/es/download/) in your machine.

Once Node.js is installed, you should be also able to use npm (npm is a node package manager - which will help you install further required modules) which comes by default with Node.js

Please check that npm is installed successfully by running the following command on your terminal.

```node -v```


## Set NODE
In order to setup the project on your local machine you need to run the following command on your terminal

```npm install node```


## Install MongoDB
Please follow the steps to [install MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) on your machine 


## Run the server
```npm index.js``` 
or 
```npm start```


### API endpoints

Business Logic | URL          | HTTP Method   | Request Body data Format | Response Body data Format
------------ | -------------  | ------------- | ------------- | -------------
Retrieve a list of ALL movies | 	/movies | 	GET | 	- | { "title": "Eyes Wide Shut","year": "1999","gender": "Thriller" }
Retrieve data about a single movie by TITLE	 | 	/movies/:title | GET | - | { "title": "Lolita","year": "1962","gender": "Drama" }
Return data about a genre (description) by name (e.g., “Drama”) | /genre/:name | GET | - | { "_id": 2,"name": "Drama","description": "The drama genre ..." }
Return data about a director (bio, birth year, death year) by name | /directors/:name | GET | - | { { "_id": 4,"name": "James Cameron","bio": "James Francis Cameron was born ...", "placeOfBirth": "Kapuskasing, Ontario, Canada","birthDate": "1954-08-16T00:00:00.000Z" } }
Allow new users to register | /users/add | POST | { userName: -REQUIRED-password: -REQUIRED- email: -REQUIRED-placeOfBirth: "",favoriteMovies: "" } | - 
Allow users to update their user info by userName | /user/:userName | PUT | { userName: -REQUIRED- password: -REQUIRED- email: -REQUIRED- placeOfBirth: -REQUIRED- } | -
Allow users to add a movie to their list of favorites by userName | 	/users/:userName/favMovies/:favoriteMovies | POST | - | - 
Allow users to remove a movie from their list of favorites | /users/:userName/Movies/:favoriteMovies | DELETE | - | - 
Allow existing users to deregister | /users/delete/:userName | 	DELETE | - | _USER_ was deleted.

