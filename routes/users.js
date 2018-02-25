const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
			console.log('No');
			return false;
		}
});

module.exports = router;