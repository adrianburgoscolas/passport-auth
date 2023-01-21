require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

const sessionConfig = session({
  name: "server.id",
  secret: "asdfa1234ljkasdfl1234",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 259200000
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
})

module.exports = sessionConfig;
