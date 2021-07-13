const express = require('express');
const router = express.Router();

// middlewares
const authMiddleware = require('../app/middlewares/authMiddleware');

// controllers
const authCtrl = require('../app/controllers/authController');

// calls
const auth = new authCtrl();
const authM = new authMiddleware();

router.post('/auth', function(req, res){
	auth.auth(req, res);
});

module.exports = router;