const gConf = require('../../config/global');
const jwt = require("jsonwebtoken");


class authMiddleware{
	auth(req, res, next){
		const authHeader = req.headers.authorization;

		if(!authHeader){
			let msg = {
				"msgType" : 1,
				"response" : "Token is empty",
				"data" : null
			}

			return res.status(401).send(msg);
		}

		// Separete the token in two parts.
		const partsToken = authHeader.split(' ');

		if(!partsToken.length === 2){
			let msg = {
				"msgType" : 0,
				"response" : "Invalid token length",
				"data" : null
			}

			return res.status(401).send(msg);
		}

		const  [ scheme, token ] = partsToken;

		if(!/^Bearer$/i.test(scheme)){
			let msg = {
				"msgType" : 0,
				"response" : "Invalid token format",
				"data" : null
			}

			return res.status(401).send(msg);
		}

		// check if token is genuine
		jwt.verify(token, gConf.appSecret, (err, dataDecoded) => {
			if(err){
				let msg = {
					"msgType" : 0,
					"response" : "Invalid token",
					"data" : null
				}

				return res.status(401).send(msg);
			}

			req.userId = dataDecoded.id;
			req.userLevel = dataDecoded.level;
			return next();
		});
	}
}

module.exports = authMiddleware;

