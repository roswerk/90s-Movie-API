const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  models = require("./database/models.js"),
  morgan = require("morgan"),
  passport = require("passport"),
  cors = require('cors'),
  dotenv = require("dotenv");

mongoose.set('useFindAndModify', false);

// ENV config for Environment Variables
dotenv.config();

const { check, validationResult } = require('express-validator');
var path = require('path');

require("./helpers/passport.js")

// Automaticating Documentation with Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./public/swagger_output.json')

// Creating APP
const app = express();

// Provisory solution for client-side Task 3.4
// Allow all origins
app.use(cors());

// Linking LOCAL DataBase
// mongoose.connect('mongodb://localhost:27017/Movies', {useNewUrlParser: true, useUnifiedTopology: true});

// Linking ONLINE DataBase
mongoose.connect(process.env.CONNECTION_URI, {
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
});



app.use(bodyParser.json());

// Automaticating Documentation with Swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Import auth.js
let auth = require("./middlewares/auth.js")(app);

// Allow only requests from origins listed on allowedOrigins
// List of allowed sites
let allowedOrigings = ["http://localhost:8080", "https://localhost:8080", "http://localhost:1234", "https://localhost:1234", "https://api90smovies.herokuapp.com/", "https://api90smovies.herokuapp.com/login", "https://cors-anywhere.herokuapp.com/https://api90smovies.herokuapp.com/login"];


// Call back function and return
// app.use(cors({
//   origin: (origin, callback) =>{
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       //If a specific origin is not found on the allowed origings list
//       let message = "The CORS policy for this application doesnt allow acces from origin " + origin;
//       return callback (new Error(message), false);
//     }
//     return callback (null, true)
//   }
// }));




// Models
const Movie = models.Movie;
const User = models.User;

// Endpoint 0 - Welcome message

app.get("/", (req, res) => {
  res.send("Welcome to the 90s Movies API. Please check the /documentation for a more accurate description on how to use the API. Enjoy!")
});

//EndPoint 1 - RETURN A LIST OF ALL MOVIES

app.get("/movies", passport.authenticate("jwt", {session: false}), (req, res) => {
  Movie.find().then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) =>{
    console.log(err);
    res.status(500).send("Error: " + err);
  });
});


//EndPoint 2 - RETURN DESCRIPTION, GENRE, DIRECTOR, IMAGE URL, FEATURES
// ABOUT A SINGLE MOVIE BY **TITLE**

app.get("/movies/:title", passport.authenticate("jwt", {session: false}), (req, res) => {
  Movie.findOne({title: req.params.title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    conosle.log(err);
    res.status(500).send("Error: " + err);
  });
});


//EndPoint 3 - RETURN DATA ABOUT A GENRE

app.get("/genre/:name", passport.authenticate("jwt", {session: false}), (req, res) => {
  Movie.findOne({"genre.name": req.params.name})
  .then((movie) => {
    res.json(movie.genre);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error: " + err);
  });
})


//EndPoint 4 - RETURN **ALL** DATA ABOUT A DIRECTOR

app.get("/directors/:name", passport.authenticate("jwt", {session: false}), (req, res) => {
  Movie.findOne({"director.name": req.params.name})
  .then((movie) => {
    res.json(movie.director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});


//EndPoint 5 - ALLOW USERS TO REGISTER

app.post("/users/add", [
    check('userName', 'Username is required').isLength({min: 5}),
    check('userName', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

let hashedPassword = User.hashPassword(req.body.password);

User.findOne({userName: req.body.userName})
.then((user) => {
  if (user){
    return res.status(400).send("The username " + req.body.userName + " already exist. Please choose another username.");
  } else{
    User.create({
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      birthDate: req.body.birthDate
    })
    .then((user) => {res.status(200).json(user)
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error: " + error);
    });
    return true;
  }
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error: ' + error);
});
});


//EndPoint 6 - ALLOW USERS TO UPDATE THEIR INFO

app.put("/user/:userName", passport.authenticate("jwt", {session: false}), [
  check('userName', 'Username is required').isLength({min: 5}),
  check('userName', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
	], (req, res) => {

let hashedPassword = User.hashPassword(req.body.password);

  User.findOneAndUpdate({userName: req.params.userName},
    {$set:{
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      birthDate: req.body.birthDate
    }
  }, {new: true},
(err, updatedUser) => {
  if(err){
    console.error(err);
    res.status(500).send("Error: " + err);
  } else{
    res.json(updatedUser);
  }
})
});


//EndPoint 7 - ALLOW USERS TO ADD A MOVIE TO THEIR LIST OF FAVORITES

app.post("/users/:userName/favMovies/:favoriteMovies", passport.authenticate("jwt", {session: false}), (req, res) =>{
  User.findOneAndUpdate({userName: req.params.userName},
    {$push: {favoriteMovies: req.params.favoriteMovies}
  },
  {new: true},
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send("Error: " + err)
    } else{
      res.json(updatedUser);
    }
  });
});


//EndPoint 8 - ALLOW USERS TO REMOVE A MOVIE FROM THEIR LIST OF FAVORITES

app.delete("/users/:userName/Movies/:favoriteMovies", passport.authenticate("jwt", {session: false}), (req, res) =>{
  User.findOneAndUpdate({userName: req.params.userName}, {
    $pull: {favoriteMovies: req.params.favoriteMovies}
  },
  {new: true},
  (err, updatedUser) => {
    if(err){
      console.error(err);
      res.status(500).send("Error: " + err)
    } else{
      res.json(updatedUser);
    }
  });
});


//EndPoint 9 - ALLOW EXISTING USERS TO DEREGISTER

app.delete("/users/delete/:userName", passport.authenticate("jwt", {session: false}), (req, res) => {
  User.findOneAndRemove({userName: req.params.userName})
  .then((user) => {
    if(!user){
      res.status(400).send(req.params.userName + " was not found.")
    }else{
      res.status(200).send(req.params.userName + " was deleted.");
      }
  });
});


//Endpoint 10 - Get documentation from documentation.html

app.get("/documentation", (req, res) =>{
  res.sendFile(path.join(__dirname +"/public/documentation.html"));
})


// DYNAMIC PORT
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("The Server is running on Port: " + port)
});
