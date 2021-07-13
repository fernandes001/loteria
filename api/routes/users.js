const express = require('express');
const request = require('request');
const router = express.Router();

// middlewares
const authMiddleware = require('../app/middlewares/authMiddleware');

// controllers
const usersCtrl = require('../app/controllers/usersController');
const btcTransactionCtrl = require('../app/btccore/btcTransactionController');
const btcAddressCtrl = require('../app/btccore/btcAddressController');
const btcUtilCtrl = require('../app/btccore/btcUtilController');

// calls
const users = new usersCtrl();
const btcTransaction = new btcTransactionCtrl();
const btcAddress = new btcAddressCtrl();
const btcUtil = new btcUtilCtrl();
const authM = new authMiddleware();


/**
 * @param url - [?page=1&limit=10]
 * @param header - [Bearer token]
 */
router.get('/users', authM.auth, function(req, res){ // private
	users.list(req, res);
});


router.get('/users/balance/:id', authM.auth, function(req, res){ // private
	users.balance(req, res);
});


router.get('/users/:id', authM.auth, function(req, res){ // private
	users.get(req, res);
});


router.post('/users', function(req, res){
	users.create(req, res);
});


router.put('/users/:id', authM.auth, function(req, res){ // private
	users.update(req, res);
});


router.get('/users/confirm/:token', function(req, res){
	users.confirm(req, res);
});


router.post('/users/resetpassword', function(req, res){ // public
	users.resetPassword(req, res);
});


router.post('/users/sendtoken', function(req, res){
	//console.log('send token...');
});


router.delete('/users/:id', authM.auth, function(req, res){ // private
	users.delete(req, res);
});


module.exports = router;