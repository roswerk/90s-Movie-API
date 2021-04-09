const express = require("express"),
uuid = require("uuid"),
bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

let kubrickMovies = [
  {title: "Eyes Wide Shut", year: "1999", gender: "Thriller"},
  {title: "Full Metal Jacket", year: "1987", gender: "War"},
  {title: "The Shining", year: "1980", gender: "Thriller" },
  {title: "Barry Lyndon", year: "1975", gender: "Historic" },
  {title: "A Clockwork Orange", year: "1971", gender: ["Sci-Fi", "Drama"]},
  {title: "2001: A Space Odyssey", year: "1968", gender: ["Sci-Fi", "Epic"]},
  {title: "Dr. Strangelove", year: "1964", gender: "Dark-Comedy" },
  {title: "Lolita", year: "1962", gender: "Drama"},
  {title: "Spartacus", year: "1960", gender: ["Epic", "Drama"]},
  {title: "Paths of Glory", year: "1957", gender: ["War", "Drama"]},
  {title: "The Killing", year: "1956", gender: "Dark-Comedy"},
  {title: "Killer's Kiss", year: "1955", gender: ["Drama", "Dark-Comedy"]},
  {title: "The Seafarers", year: "1953", gender: "Documentary"},
  {title: "Fear and Desire", year: "1953", gender: "War" },
  {title: "Flying Padre", year: "1951", gender: "Documentary" },
  {title: "Day of the Fight", year: "1951", gender: "Documentary" }
];

let directors = [
  {
  name: "Stanley Kubrick",
  yearOfBirth: 1928,
  placeOfBrith: "New York, USA",
  yearOfDeath: 1999,
  placeOfDeath: "London, Great Britain"
}
];

let users = [
  { id: 1,
    name: "Michael",
   surnme: "Corleone",
   dateOfBirth: "19/02/1954",
   placeOfBirth: "Sicilia"
}
];

// API DOCUMENTATION
app.get("/documentation", (req, res) =>{
  res.sendFile("public/documentation.html", {root: __dirname});
});


// EndPoint 1 - Retrieve a list of all movies
app.get("/movies", (req, res) =>{
  res.json(kubrickMovies);
});

// EndPoint 3 - Return data about a gender (description) by name/title (e.g., “Thriller”)
app.get("/movies/gender", (req, res) =>{
  res.send('Title: "Eyes Wide Shut"' + '<br>' + 'Gender: "Thriller"' + '<br> <br>' + 'Title: "The Shining"' + '<br>' + 'Gender: "Thriller"')
});

// EndPoint 2 - Retrieve data about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  res.json(kubrickMovies.find((movie) =>
  {return movie.title === req.params.title}))
});

// EndPoint 4 - Return data about a director (bio, birth year, death year) by name
app.get("/directors/:name", (req, res) =>{
  res.json(directors.find((director) =>
{return director.name === req.params.name}))
});

// EndPoint 5 - Allow new users to register
app.post("/users/add", (req, res) =>{
  res.send("You have added (POST) a new user successfully")
});

// EndPoint 6 - Allow users to update their user info (username)
app.put("/users/id/:name", (req, res) => {
  res.send("Congratz! You have updated (PUT) your user info successfully")
})

// EndPoint 7 - Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post("/movies/favorites/add", (req, res) =>{
  res.send("You have added (POST) a movie successfully")
})

// EndPoint 8 - Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete("/movies/favorites/delete", (req, res) => {
  res.send("You have successfully deleted a movie from your list of favorites movies")
})

// EndPoint 9 - Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete("/users/:id/email/delete", (req, res) =>{
  res.send("You have successfully deregistered your email address")
})


app.listen(8080, () => {
  console.log("The server is running on Port 8080")
});
