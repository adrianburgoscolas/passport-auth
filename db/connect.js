const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");

//const User = require("../models/user");

mongoose.set("strictQuery", false);
const db = {
  connect: () => { 
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err) => {
      if(err) {throw err}
      console.log("Connected to DB");
//    User.findOne({name: "pepe"}, (err, user) => {
//      if(err) {throw err}
//      if(!user) {
//        console.log("no test user")
//        const newUser = new User({name: "pepe", password: "", provider: "local"});
//        bcrypt.genSalt(10, (err, salt) => {
//          bcrypt.hash("pp", salt, (err, hashedPassword) => {
//            if(err) {
//              console.log(err);
//              return;
//            }
//            newUser.password = hashedPassword;
//            newUser.save((err, user) => {
//              if(err) {
//                console.log(err)
//                return;
//              }
//              console.log("test user created", user.name);
//              return;
//            });
//          });
//        });
//      } else {
//        console.log("test user: ", user.name);
//      }
//    });
    }); 
  },
}

module.exports = db;
