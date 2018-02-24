const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// login route
router.get('/login', (req, res) => {
	res.send('Login');
});

// Register route
router.get('/register', (req, res) => {
	res.send('Register');
});

module.exports = router;