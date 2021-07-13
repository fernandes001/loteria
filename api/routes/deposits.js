const express = require('express');
const router = express.Router();

// middlewares
const authMiddleware = require('../app/middlewares/authMiddleware');

// controllers
const depositsCtrl = require('../app/controllers/depositsController');

// calls
const authM = new authMiddleware();
const deposits = new depositsCtrl();

router.get('/deposits', authM.auth, function(req, res){ // private
	deposits.index(req, res);
});

router.get('/deposits/:id', function(req, res){ // private

});

router.post('/deposits', authM.auth, function(req, res){ // private
	deposits.create(req, res);
});

router.post('/deposits/status', authM.auth, function(req, res){ // private
	deposits.depositStatus(req, res);
});

router.put('/deposits/:id', authM.auth, function(req, res){ // private
	deposits.update(req, res);
});

module.exports = router;