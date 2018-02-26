const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');

// load User model
require('../models/User');
const User = mongoose.model('users'); 

// login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

// Register route
router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/register', (req, res) => {
		let username = req.body.username;
		let email = req.body.email;
		let password = req.body.password;
		let password2 = req.body.password2;

		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('email', 'Email ID is required').notEmpty();
		req.checkBody('email', 'Email ID is not valid').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Confirm your password').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

		let errors = req.validationErrors();
		if(errors) {
			res.render('users/register', {
				error: errors[0]
			});
		}	else {
			User.findOne({
				email: email
			}).then((user) => {
				if(user) {
					req.flash('err_msg', 'Email is already registered.');
					res.redirect('/users/register');
				} else {
					const newUser = {
						username: username,
						email: email,
						password: password
					};

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if(err) throw err;
							newUser.password = hash;
							new User(newUser).save().then((user) => {
								req.flash('success_msg', 'You have successfully registered your account.');
								res.redirect('/users/login');
							}).catch((err) => {
								console.log(err);
								return;
							});
						});
					});
				}
			});
		}
});

module.exports = router;