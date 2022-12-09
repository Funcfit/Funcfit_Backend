const express = require('express');
const router = express.Router();

const { signup, signin, searchUser } = require('../controllers/auth');
const { authenticateUser } = require("../middleware/auth.js");

router.post('/signup', signup);
router.post('/signin', signin);
router.route('/users').get(authenticateUser, searchUser);

module.exports = router;