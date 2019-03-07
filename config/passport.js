const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const DeviceInfo = mongoose.model("devicesinfos");
const keys = require("../config/keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    if(!jwt_payload.deviceID){
      User.findById(jwt_payload._id)
        .then(user => {
          if(user){
            return done(null,user);
          }

          return done(null,false);
        })
        .catch(err => console.log(err));
    } 
    else {
      console.log(jwt_payload._id);
      DeviceInfo.findById(jwt_payload._id)
      .then(dev => {
        if(dev){
          return done(null,dev);
        }

        return done(null,false);
      })
      .catch(err => console.log(err));
   }
   
    
  }));
}