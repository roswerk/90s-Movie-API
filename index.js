const express = require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
models = require("./models.js"),
morgan = require("morgan");

mongoose.connect('mongodb://localhost:27017/Movies', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(bodyParser.json());

const Movie = models.Movie;
const User = models.User;

// 1 - RETURN A LIST OF ALL MOVIES
// WORKS - Correct and Fail proved way
app.get("/movies", (req, res) => {
  Movie.find().then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) =>{
    console.log(err);
    res.status(500).send("Error: " + err);
  });
});

// Shorter and not failed prove way

// app.get("/movies", (req, res) =>{
//   movie.find().then((movies) => {
//     res.json(movies)
//   });
// });

// 2 - RETURN DESCRIPTION, GENRE, DIRECTOR, IMAGE URL, FEATURES
// ABOUT A SINGLE MOVIE BY **TITLE**
// WORKS
app.get("/movies/:title", (req, res) => {
  Movie.findOne({title: req.params.title})
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    conosle.log(err);
    res.status(500).send("Error: " + err);
  });
});


// 3 - RETURN DATA ABOUT A GENRE
// WORKS
app.get("/genre/:name", (req, res) => {
  Movie.findOne({"genre.name": req.params.name})
  .then((movie) => {
    res.json(movie.genre);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send("Error: " + err);
  });
})



// 4 - RETURN **ALL** DATA ABOUT A DIRECTOR
// WORKS
app.get("/directors/:name", (req, res) => {
  Movie.findOne({"director.name": req.params.name})
  .then((movie) => {
    res.json(movie.director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// 5 - ALLOW USERS TO REGISTER
// WORKS
app.post("/users/add", (req, res) => {
User.findOne({userName: req.body.userName})
.then((user) => {
  if (user){
    return res.status(400).send("The username " + req.body.Username + " already exist. Please choose another username.");
  } else{
    User.create({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      birthDate: req.body.birthDate
    })
    .then((user) => {res.status(201).json(user)
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error: " + error);
    });
    return true;
  }
})
});

// 6 - ALLOW USERS TO UPDATE THEIR INFO
// WORKS
app.put("/user/:userName", (req, res) => {
  User.findOneAndUpdate({userName: req.params.userName},
    {$set:{
      userName: req.body.userName,
      password: req.body.password,
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


// 7 - ALLOW USERS TO ADD A MOVIE TO THEIR LIST OF FAVORITES
// WORKS
app.post("/users/:userName/favMovies/:favoriteMovies", (req, res) =>{
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

// 8 - ALLOW USERS TO REMOVE A MOVIE FROM THEIR LIST OF FAVORITES
// WORKS
app.delete("/users/:userName/Movies/:favoriteMovies", (req, res) =>{
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

// 9 - ALLOW EXISTING USERS TO DEREGISTER
// WORKS
app.delete("/users/delete/:userName", (req, res) => {
  User.findOneAndRemove({userName: req.params.userName})
  .then((user) => {
    if(!user){
      res.status(400).send(req.params.userName + " was not found.")
    }else{
      res.status(200).send(req.params.userName + " was deleted.");
      }
  });
});





// DYNAMIC PORT
const port = process.env.port || 8080;
app.listen(port, () => {
  console.log("The Server is running on Port: " + port)
});
