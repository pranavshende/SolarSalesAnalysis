const express = require('express');
const passport = require('passport');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', passport.authenticate('local', { session: false }), login);

module.exports = router;
