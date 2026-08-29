const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Main fix: .default fallback add kiya gaya hai

const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");
const userSchema = new Schema({

email: {
type: String,
required: true
}
});

// Plugin attach karne ka tarika:

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);