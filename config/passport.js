const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Donor = mongoose.model("Donor");

passport.use(new localStrategy({
		usernameField: "email",
		passwordField: "password"
	}, function (email, password, done) {
		Donor
		.findOne({email: email})
		.then(function (user) {
			if(!user || !user.validatePassword(password)) {
				return done(null, false, {errors: {"email o contraseña": "No coinciden"}});
			}
			return done(null, user);
		})
		.catch(done);
}));