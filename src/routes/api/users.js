const Users = require('../../models/users'); // Import schema
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Add mongoose
const bcrypt = require('bcrypt'); // Encription
const passport = require('passport');
const { ensureAutenticated } = require('../../../config/auth');
const upload = require('../../services/image-upload');

//Login page
router.get('/login', (req, res) => res.render('login'));

//Registration page
router.get('/register', (req, res) => res.render('register'));

// Register user
router.post('/register', (req, res) => {

	const { username, email, password, password2 } = req.body; // Get values from form

	let errors = []; // Initialize errors variable to store errors

	// Check if fields are filled in

	if(!username || !email || !password || !password2 ) {
		errors.push({ msg: 'Passwords do not match' }); // Push error message to errors
	}

	// If the password length is less than 6 push an error

	if(password.length < 6) {
		errors.push({ msg: 'Password should be at least 6 characters'});
	}

	// If errors exsist reload register with user inputted data

	if(errors.length > 0){
		res.render('register', {
			username,
			email,
			password,
			password2,
			errors
		});
	} else { // If no errors check if the email already exists
		Users.findOne({ email: email })
			.then(user => {

				if (user) {

					errors.push({ msg: 'Email is already registered'}); // Push error

					res.render('register', {
						errors,
						username,
						email,
						password,
						password2

					});

				} else { // If no errors and no matching email is found create user

					const newUser = new Users({
						username,
						email,
						password
					});

					// Encript password

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) {
							throw err;
						}

						newUser.password = hash; // Asign password to the encripted value

						// Save new user to the database 
						newUser.save()
							.then(user => {
								res.redirect('/users/login'); // Once created redirect to login page
							})
							.catch(err => console.log(err))
					});
				});
				}
			});
	}
});

// Login request - Check is login credentials are correct then redirect to dashboard else back to login

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

// Logout using passport functionallity then redirect to login

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/users/login');
});

router.get('/profile', ensureAutenticated, (req, res, next) => {
	res.render('profile');
});

module.exports = router;