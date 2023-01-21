const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: String,
  password: String,
  provider: String
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
