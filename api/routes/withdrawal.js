const express = require('express');
const router = express.Router();

// middlewares
const authMiddleware = require('../app/middlewares/authMiddleware');

// controllers
const withdrawalCtrl = require('../app/controllers/withdrawalController');

// calls
const authM = new authMiddleware();
const withdrawal = new withdrawalCtrl();


router.get('/withdrawal', authM.auth, function(req, res){
	withdrawal.index(req, res);
});


router.post('/withdrawal', authM.auth, function(req, res){
	withdrawal.create(req, res);
});


router.get('/withdrawal/:address', authM.auth, function(req, res){
	withdrawal.validateAddress(req, res);
});


router.post('/withdrawal/getfee', authM.auth, function(req, res){
	withdrawal.getFee(req, res);
});


module.exports = router;