const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Donor = mongoose.model("Donor");
const Receiver = mongoose.model("Receiver");

passport.use("local-donor", new LocalStrategy({
		usernameField: "email",
		passwordField: "password"
	}, function (email, password, done) {
		Donor.findOne({email: email})
			.then(function (user) {
				if(!user || !user.validatePassword(password)) {
					return done(null, false, {errors: {"email o contraseña": "No coinciden"}});
				}
				return done(null, user);
			})
			.catch(done);
	}
));

passport.use("local-receiver", new LocalStrategy({
		usernameField: "email",
		passwordField: "password"
	}, function (email, password, done) {
		Receiver.findOne({email: email})
			.then(function (user) {
				if(!user || !user.validatePassword(password)) {
					return done(null, false, {errors: {"email o contraseña": "No coinciden"}});
				}
				return done(null, user);
			})
			.catch(done);
	}
));