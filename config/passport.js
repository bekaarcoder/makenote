const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = mongoose.model('users');

module.exports = function(passport) {
	passport.use(new LocalStrategy({
		usernameField: 'email'
	}, (email, password, done) => {
		User.findOne({
			email: email
		}).then((user) => {
			if(!user) {
				console.log('no user');
				return done(null, false, {message: 'No user found'});
			}
			// Match password
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if(err) throw err;
				if(isMatch) {
					return done(null, user);
				} else {
					console.log('pass incorrect');
					return done(null, false, {message: 'Password is incorrect.'});
				}
			})
		});
	}));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});
	
}