const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let moviesSchema = mongoose.Schema({
  title: {
    type: String,
    Required: (true, "You haven't added a title name for the movie")
  },
  description: String,
  genre : {
    name: String,
    description: String
  },
  director: {
    name: String,
    bio: String,
    placeOfBirth: String,
    birthDate: Date,
    directorImg: String
  },
  imageURL: String,
  featured: Boolean
 });

let usersSchema = mongoose.Schema({
  userName: {
    type: String,
    Required: (true, "You haven't added a username")
  },
  password: {
    type: String,
    Required: (true, "You haven't added a password")
  },
  email: {
    type: String,
    Required: (true, "You haven't added a email")
  },
  birthDate: Date,
  favoriteMovies:  [{type: mongoose.Schema.Types.ObjectId, ref:'Movie'}]
});


usersSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

usersSchema.methods.validatePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}


let movie = mongoose.model("Movie", moviesSchema);
let user = mongoose.model("User", usersSchema);



module.exports.Movie = movie;
module.exports.User = user;
