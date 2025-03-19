const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("Hashing password before saving...");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password hashed:", this.password);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("Comparing passwords:", enteredPassword, "vs", this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
