const express = require('express');
const router = express.Router();

// middlewares
const authMiddleware = require('../app/middlewares/authMiddleware');

// controllers
const ticketsCtrl = require('../app/controllers/ticketsController');

// calls
const authM = new authMiddleware();
const tickets = new ticketsCtrl();


router.get('/tickets', authM.auth, function(req, res){ // private
	tickets.index(req, res);
});


router.post('/tickets', authM.auth, function(req, res){ // private
	tickets.create(req, res);
});


module.exports = router;