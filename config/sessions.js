require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const sessionConfig = {
  name: "server.id",
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 259200000,
    secure: process.env.NODE_ENV === "production"?true:false
  },
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
    databaseName: "test"
  },(err) => {
    if(err) {
      console.log(err);
    }
  })
}

module.exports = sessionConfig;
