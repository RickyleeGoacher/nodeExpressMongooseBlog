const LocalStrategy = require('passport-local').Strategy; // Local passport
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // data encription

const User = require('../src/models/users'); // User schema

// Check if email is already regestered 

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({usernameField: 'email' }, (email, password, done ) => {
			User.findOne({ email: email})
				.then(user => {
					if(!user) {
						return done(null, false, { message: 'That user is not registered'})
					}

					// Check if inputted password matches the encripted version

					bcrypt.compare(password, user.password, (err, isMatch) => {
						if(err) throw err;
						if(isMatch) {
							return done(null, user);
						} else {
							return done(null, false, {message: 'Password incorrect'})
						}
					});
				})
				.catch(err => console.log(err));
	}) 
	);
	passport.serializeUser((user, done) => {
  		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
	  User.findById(id, function(err, user) {
    	done(err, user);
  		});
	});
}