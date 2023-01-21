require("dotenv").config();
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oidc");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    return done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({name: username}, (err, user) => {
    if(err) {
      console.log(err);
      return done(null, false);
    }
    if(!user) {
      return done(null, false, {message: "Wrong user"});
    }
    bcrypt.compare(password, user.password, (err, matched) => {
      if(err) {
        console.log(err);
        return done(null, false);
      }
      if(!matched) {
        return done(null, false, {message: "Wrong password"});
      }
      return done(null, user);
    });
  });
}));

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile' ]
},(issuer, profile, done) => {
  User.findOne({provider: issuer, name: profile.displayName}, (err, user) => {
    if(err) {
      console.log(err);
      return done(null, false);
    }
    if(user) {
      return done(null, user);
    }
    const newUser = new User({name: profile.displayName, password: "", provider: issuer});
    newUser.save((err, user) => {
      if(err) {
        console.log(err);
        return done(null, false);
      }
      return done(null, user);
    });
  });
}));

router.get("/login", (req, res, next) => {
  res.render("signin");
});

router.post("/login", 
  passport.authenticate("local", {
    failureRedirect: "/login", 
    successRedirect: "/important"
  })
);

router.get('/login/federated/google', passport.authenticate('google'));

router.get("/oauth2/redirect/google", 
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/important"
  })
); 

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/important", authenticate, 
  (req, res, next) =>{
    res.render("important", {user: req.user.name});
  }
);

function authenticate(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/register", (req, res, next) => {
  res.render("signup");
});

router.post("/register", (req, res, next) => {
  User.findOne({name: req.body.username}, (err, user) => {
    if(err) {
      next(err);
    }
    if(user) {
      next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
        const newUser = new User({
          name: req.body.username,
          password: hashedPassword,
          provider: "local"
        });
        newUser.save((err, user) => {
          if(err) {
            next(err);
          }
          next();
        });
      });
    });
  });
}, passport.authenticate("local", 
  {failureRedirect: "/login"}), 
  (req, res, next) => {
    res.redirect("/important");
  }
);

module.exports = router;
