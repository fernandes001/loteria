const express = require('express');
const router = express.Router();

// middlewares
const authMiddleware = require('../app/middlewares/authMiddleware');

// controllers
const lotteriesCtrl = require('../app/controllers/lotteriesController');

// calls
const lotteries = new lotteriesCtrl();
const authM = new authMiddleware();


/**
 * @param url - [?page=1&limit=10]
 * @param header - [Bearer token]
 */
router.get('/lotteries/public', function(req, res){ // public
	lotteries.index(req, res, 'public');
});


/**
 *
 */
router.get('/lotteries/public/:id', function(req, res){ // public
	lotteries.get(req, res, 'public');
});


/**
 * @param url - [?page=1&limit=10]
 * @param header - [Bearer token]
 */
router.get('/lotteries/private', authM.auth, function(req, res){ // private
	lotteries.index(req, res, 'private');
});


/**
 *
 */
router.get('/lotteries/private/:id', authM.auth, function(req, res){ // private
	lotteries.get(req, res, 'private');
});


/**
 *
 */
router.post('/lotteries', authM.auth, function(req, res){ // private
	lotteries.create(req, res);
});


/**
 *
 */
router.put('/lotteries/:id', authM.auth, function(req, res){ // private
	lotteries.update(req, res);
});


/**
 *
 */
router.delete('/lotteries/:id', authM.auth, function(req, res){ // private
	lotteries.delete(req, res);
});

module.exports = router;