// Importing Modules
const express = require("express"),
morgan = require("morgan");

const app = express();

app.use("/", express.static("public"));
app.use(morgan("common"));

app.use((err, req, res, next) =>{
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Top 10 Movies - JSON
let kubrickMovies = [
  {title: "Eyes Wide Shut", year: "1999"},
  {title: "Full Metal Jacket", year: "1987"},
  {title: "The Shining", year: "1980"},
  {title: "Barry Lyndon", year: "1975"},
  {title: "A Clockwork Orange", year: "1971"},
  {title: "2001: A Space Odyssey", year: "1968"},
  {title: "Dr. Strangelove", year: "1964"},
  {title: "Lolita", year: "1962"},
  {title: "Spartacus", year: "1960"},
  {title: "Paths of Glory", year: "1957"},
  {title: "The Killing", year: "1956"},
  {title: "Killer's Kiss", year: "1955"},
  {title: "The Seafarers", year: "1953"},
  {title: "Fear and Desire", year: "1953"},
  {title: "Flying Padre", year: "1951"},
  {title: "Day of the Fight", year: "1951"}
];


app.get("/movies", (req, res) => {
  res.json(kubrickMovies);
});

app.get("/", (req, res) => {
  res.send("Hello there! This is a root file");
})

app.get("/documentation", (req, res) =>{
  res.sendFile("/public/documentation.html", {
    root: __dirname});
})

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
})
