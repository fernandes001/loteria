const gConf = require('../../config/global');
const helpers = require("../helpers/helpers");
const jwt = require('jsonwebtoken');

// models
const Users = require('../models/Users');


class authController{
	constructor(users){
		this.users = new Users();
	}


	/**
	 *
	 */
	auth(req, res){
		let email = req.body.email;
		let password = req.body.password;

		let fields = [];
		if(email === undefined || email === ""){
			fields.push('email');
		}
		if(password === undefined || password === ""){
			fields.push('password');
		}

		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(", ")+": is required",
				"data" : null
			}
			return res.send(msg);
		}

		let data = {
			"email" : req.body.email,
			"password" : helpers.cryptoSha256(req.body.password)
		}

		this.users.auth(data).then(
			(result) => {
				// check if specific user exists
				if(result.length <= 0){
					let msg = {
						"msgType" : 0,
						"response" : "Incorrect username or password",
						"data" : null
					};

					return res.status(400).send(msg);
				}

				// JWT create token
				const token = jwt.sign(
					{ 
						"id" : result[0].id, 
						"level" : result[0].level 
					},
					gConf.appSecret, 
					{ 
						expiresIn : 1200 
					}
				);

				let msg = {
					"msgType" : 2,
					"response" : null,
					"data" : {
						"data" : result[0],
						"token" : token
					}
					
				}

				return res.send(msg);
				
			} ,

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - AUTH:ERR001",
					"data" : null
				}

				res.status(400).send(msg);
			}
		);
	}
}

module.exports = authController;