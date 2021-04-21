const passport = require("passport"),
localStrategy = require("passport-local").Strategy,
models = require("./models.js"),
passportJWT = require("passport-jwt");

let Users = models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

// Basic HTTP Authenitication
passport.use(new LocalStrategy({
  usernameField: "Username",
  passwordField: "Password"
}, (username, password, callback) => {
  console.log(username + " " + password);
  // Check if username is found in DB
  Users.findOne({Username: username}, (error, user) =>{
  // Callback error message
    if(error){
      console.log(error);
      return callback(error);
    }
    if(!user){
      console.log("Incorrect username");
      return callback(null, false, {message: "Incorrect username or password"});
    }
    console.log("Finished");
    return callback(null, user);
  });
}));

// JWT Authentication
passport.use(new JWTStrategy({
  // Bearer Token
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // SecretKey
  secretOrKey: "your_jwt_secret"
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
  .then((user) => {
    return callback(null, user);
  })
  .catch((error) => {
    return callback(error)
  });
}));
