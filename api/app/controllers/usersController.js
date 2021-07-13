const helpers = require("../helpers/helpers");

// models
const Users = require("../models/Users");

const gConf = require('../../config/global');

class usersController{
	constructor(users){
		this.users = new Users();
	}


	/**
	 * List all users
	 */
	list(req, res){
		// validate access level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		if(userLoggedLevel === 1){
			let msg = {
				"msgType" : 1,
				"response" : "You not have permission for this",
				"data" : null
			}

			return res.status(400).send(msg);
		}

		let page = req.query.page;
		let limit = req.query.limit;
		let search = req.query.search;

		//
		let fields = [];
		if(page === undefined || page === ""){
			fields.push('page');
		}

		if(limit === undefined || limit === ""){
			fields.push('limit');
		}

		if(search === undefined){
			fields.push("search");
		}

		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(", ")+": is required",
				"data" : null
			}
			return res.send(msg);
		}

		//		
		let fieldsNumber = [];
		if(page !== undefined && page !== ""){
			if(isNaN(parseInt(page)) || parseInt(page) < 0){
				fieldsNumber.push('page');
			}
		}

		if(limit !== undefined && limit !== ""){
			if(isNaN(parseInt(limit)) || parseInt(limit) <= 0){
				fieldsNumber.push('limit');
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fieldsNumber.join(', ')+": this field(s) is not a number or smaller than permitted",
				"data" : null
			}
			return res.send(msg);
		}

		// filters
		let filters = new Object();

		let filter_blocked = req.query.blocked;
		let filter_deleted = req.query.deleted;

		if(filter_blocked === 'true'){
			filters.blocked = 1;
		} else if(filter_blocked === 'false') {
			filters.blocked = 0;
		}

		if(filter_deleted === 'true'){
			filters.deleted = 1;
		} else if(filter_deleted === 'false') {
			filters.deleted = 0;
		}

		this.users.list(parseInt(page), parseInt(limit), search, filters).then(
			(result) => {
				let msg = {
					"msgType" : 2,
					"response" : null,
					"data" : result
				}
				res.send(msg);
			} , 

			(err) => {
				console.log(err);
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - LIST:ERR001",
					"data" : null
				}

				res.status(400).send(msg);
			}
		);
	}


	/**
	 * Create a new user
	 */
	create(req, res){
		var email = req.body.email;
		var password = req.body.password;
		var timestamp = helpers.timestamp();
		var token = helpers.cryptoMd5(email+String(timestamp));

		var fields = [];
		if(email === undefined || email === ""){
			fields.push("email");
		}
		if(password === undefined || password === ""){
			fields.push("password");
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
			"email" : email,
			"password" : helpers.cryptoSha256(password),
			"token" : token,
			"dt_token_expiration" : timestamp + 3600, // seconds
			"dt_created" : timestamp
		};

		this.users.search('email', data.email, new Array("id")).then((result) => { // Check if email exist
			if(result.length === 1){
				let msg = {
					"msgType" : 1,
					"response" : "E-mail exists",
					"data" : {
						"field" : 'email'
					}
				}

				res.send(msg);
				return false;
			} else {
				return true;
			}
		}, (err) => {
			let msg = {
				"msgType" : 0,
				"response" : "An error occurred - CREATE:ERR001",
				"data" : null
			}

			res.status(400).send(msg);
			return false;
		}).then((result) => {

			if(result === false){ // stop script
				return false;
			}

			var emailSend = data.email; // TODO ADD INTO TO MAIL

			this.users.create(data).then(
				(result) => { // Send data for create a new user
					var insertId = result.insertId;

					let text = "Your verification token: "+token;

					let data = {
						"to" : "uelssonrodrigues@gmail.com",
						"subject" : "Confirmação de cadastro",
						"text" : text,	
					}

					// send confirmation email
					helpers.sendEmail(data).then(
						(result) => {
							let msg = {
								"msgType" : 2,
								"response" : "User created",
								"data" : {
									"insertId" : insertId,
									"messageId" : result.messageId
								}
							}

							res.send(msg);
						} , 

						(err) => {
							console.log("CREATE:ERR002: ", err); //console log error, TODO .log file errors
								
							let msg = {
								"msgType" : 0,
								"response" : "An error occurred - CREATE:ERR002",
								"data" : null
							}

							res.status(400).send(msg);
							return false;
						}
					);
				} , 

				(err) => {
					console.log("CREATE:ERR003: ", err); //console log error, TODO .log file errors
						
					let msg = {
						"msgType" : 0,
						"response" : "An error occurred - CREATE:ERR003",
						"data" : null
					}

					res.status(400).send(msg);
					return false;
				}
			); 

		});
	}


	/**
	 * Get a specific user
	 */
	get(req, res){
		// Check user permission level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);
		let userId = parseInt(req.params.id);

		if(userLoggedLevel === 1 && userLoggedId !== userId){
			let msg = {
				"msgType" : 0,
				"response" : "You not have permission for this",
				"data" : null
			}
			return res.status(401).send(msg);
		}

		if(userId <= 0){
			let msg = {
				"msgType" : 1,
				"response" : "User id invalid",
				"data" : null
			}
			return res.send(msg);
		} 
		
		if(isNaN(userId)) {
			let msg = {
				"msgType" : 1,
				"response" : "User id is not a number",
				"data" : null
			}
			return res.send(msg);
		} 

		this.users.get(userId).then(
			(result) => {
				console.log(result);

				if(result[0] === undefined){
					let msg = {
						"msgType" : 1,
						"response" : "User not found",
						"data" : null
					}
					return res.send(msg);
				}
				let msg = {
					"msgType" : 2,
					"response" : null,
					"data" : result[0]
				}
				res.send(msg);
				
			} ,

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error ocured - GET:ERR001",
					"data" : null
				}
				res.status(400).send(msg);
			} 
		);
	}


	/**
	 * Update a specific user
	 */
	update(req, res){
		// Check user permission level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);
		let userId = parseInt(req.params.id);

		if(userLoggedLevel === 1 && userLoggedId !== userId){
			let msg = {
				"msgType" : 0,
				"response" : "You not have permission for this",
				"data" : null
			}
			return res.status(401).send(msg);
		}

		// fields
		let id = req.params.id;
		let email = req.body.email;
		let user_name = req.body.user_name;
		let password = req.body.password;
		let twofa_status = req.body.twofa_status;
		let level = req.body.level;
		let blocked = req.body.blocked;
		let account_checked = req.body.account_checked;
		let twofa_code = req.body.twofa_code;
		let dt_token_expiration = req.body.dt_token_expiration;
		
		let data = {};
		
		//
		let fields = [];
		if(id === undefined || id === ""){
			fields.push('id');
		}

		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(", ")+": is required",
				"data" : null
			}
			return res.send(msg);
		}

		//
		let fieldsNumber = [];
		if(isNaN(parseInt(id)) || parseInt(id) <= 0){ // default
			fieldsNumber.push('id');
		} else {
			data.id = parseInt(id);
		}

		if(twofa_status !== undefined && twofa_status !== ""){ // optional
			if(isNaN(parseInt(twofa_status)) || parseInt(twofa_status) < 0 || parseInt(twofa_status) > 1){
				fieldsNumber.push('twofa_status');
			} else {
				data.twofa_status = parseInt(twofa_status);
			}
		}

		if(level !== undefined && level !== ""){ // optional
			if(isNaN(parseInt(level)) || parseInt(level) < 1 || parseInt(level) > 2){
				fieldsNumber.push('level');
			} else {
				data.level = parseInt(level);
			}
		}
		
		if(blocked !== undefined && blocked !== ""){ // optional
			if(isNaN(parseInt(blocked)) || parseInt(blocked) < 0 || parseInt(blocked) > 1){
				fieldsNumber.push('blocked');
			} else {
				data.blocked = parseInt(blocked);
			}
		}

		if(account_checked !== undefined && account_checked !== ""){ // optional
			if(isNaN(parseInt(account_checked)) || parseInt(account_checked) < 0 || parseInt(account_checked) > 1){
				fieldsNumber.push('account_checked');
			} else {
				data.account_checked = parseInt(account_checked);
			}
		}

		if(dt_token_expiration !== undefined && dt_token_expiration !== ""){
			if(isNaN(parseInt(dt_token_expiration)) || parseInt(dt_token_expiration) < 0){
				fieldsNumber.push('dt_token_expiration');
			} else {
				data.dt_token_expiration = parseInt(dt_token_expiration);
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fieldsNumber.join(', ')+": this field(s) is not a number or smaller/bigger than permitted",
				"data" : null
			}
			return res.send(msg);
		}
		
		if(email !== undefined && email !== ""){ // optional
			data.email = email;
		}

		if(user_name !== undefined && user_name !== ""){ // optional
			data.user_name = user_name;
		}

		if(password !== undefined && twofa_status !== ""){ // optional
			data.password = helpers.cryptoSha256(password);
		}

		if(twofa_code !== undefined && twofa_code !== ""){ // opational
			data.twofa_code = twofa_code;
		}
		
		// needs one or more optional fields plus the default fields
		if(Object.keys(data).length <= 1){
			let msg = {
				"msgType" : 1,
				"response" : "Needs one or more fields for submit",
				"data" : null
			}
			return res.send(msg);
		}

		this.users.search('id', data.id, new Array('id')).then(
			(result) => {
				if(result.length === 0){
					let msg = {
						"msgType" : 1,
						"response" : "User not found",
						"data" : null
					}
					res.send(msg);
					return false;
				} else {
					return true;
				}
			},

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - UPDATE:ERR001",
					"data" : null
				}
				res.status(400).send(msg);
				return false;
			}
		).then((result) => {
			if(result === false){
				return false;
			}

			// check if email exists and belongs to the user
			this.users.search('email', data.email, new Array('id')).then(
				(result) => {
					if(result.length === 1 && result[0].id !== parseInt(data.id)){
						let msg = {
							"msgType" : 1,
							"response" : "E-mail exists",
							"data" : {
								"field" : 'email'
							}
						}
						res.send(msg);
						return false;
					} else {
						return true;
					}
				
				}, 

				(err) => {
					let msg = {
						"msgType" : 0,
						"response" : "An error occurred - UPDATE:ERR002",
						"data" : null
					}
					res.status(400).send(msg);
					return false;
				}
			).then((result) => {
				if(result === false){
					return false;
				}

				// update data
				this.users.update(data).then(
					(result) => {
						
						if(result.changedRows === 1){
							let msg = {
								"msgType" : 2,
								"response" : "User updated",
								"data" : null
							}
							res.send(msg);
						} else {
							let msg = {
								"msgType" : 1,
								"response" : "No changes for this user",
								"data" : null
							}
							res.send(msg);
						}
						
					}, 

					(err) => {
						let msg = {
							"msgType" : 0,
							"response" : "An error occurred UPDATE:ERR003",
							"data" : null
						}
						res.status(400).send(msg);	
					}
				);
			});
		});
	}


	/**
	 * Delete a specific user
	 */
	delete(req, res){
		// validate access level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		if(userLoggedLevel === 1){
			let msg = {
				"msgType" : 1,
				"response" : "You not have permission for this",
				"data" : null
			}

			return res.status(400).send(msg);
		}

		var id = parseInt(req.params.id);

		if(id <= 0){
			let msg = {
				"msgType" : 1,
				"response" : "User id invalid",
				"data" : null
			}
			return res.send(msg);
		}
		if(isNaN(id)) {	
			let msg = {
				"msgType" : 1,
				"response" : "User id is not a number",
				"data" : null
			}
			return res.send(msg);
		}

		// check if user exists
		this.users.search("id", id, new Array("id")).then(
			(result) => {
				if(result.length === 0){
					let msg = {
						"msgType" : 1,
						"response" : "User not found",
						"data" : null
					}
					res.send(msg);
					return false;
				} else {
					return true;
				}
			}, 

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - DELETE:ERR001",
					"data" : null
				}
				res.status(400).send(msg);
				return false;
			}
		).then((result) => {
			if(result === false){
				return false;
			}

			this.users.softdelete(id).then(
				(result) => {
					if(result.affectedRows === 1){
						let msg = {
							"msgType" : 2,
							"response" : "User deleted",
							"data" : null
						}
						return res.send(msg);
					} else {
						let msg = {
							"msgType" : 1,
							"response" : "User has gone",
							"data" : null
						}
						return res.send(msg);
					}
				} , 

				(err) => {
					let msg = {
						"msgType" : 0,
						"response" : "An error occurred - DELETE:ERR002",
						"data" : null
					}
					res.status(400).send(msg);
				}
			);
		});
	}


	/**
	 * Confirm an account of specific user
	 */
	confirm(req, res){
		let token = req.params.token;
		
		this.f_token_expiration(token).then(
			(response) => {
				if(response.error === null){
					return response.result;
				} else {
					res.send(response);
					return false;	
				}
			},
			(exception) => {
				res.send(exception);
				return false;
			}
		).then((response) => {
			if(response === false){
				return false;
			}
			
			let id = response;
			let data = {
				"token" : token,
				"account_checked" : 1
			}

			this.f_update(data, true).then(
				(response) => {
					if(response.error === null){
						return response;
					} else {
						res.send(response);
						return false;	
					}
				},
				(exception) => {
					res.send(exception);
					return false;
				}
			).then((response) => {				
				if(response === false){
					return false;
				}

				let data = {
					"id" : id,
					"token" : null,
					"dt_token_expiration" : null
				}

				this.f_update(data).then(
					(response) => {
						res.send(response);
					},
					(exception) => {
						res.send(exception);
					}
				);
			});
		});
	}


	/**
	 *
	 */
	resetPassword(req, res){
		let email = req.body.email;

		let fields = [];
		if(email === undefined || email === ''){
			fields.push('email');
		}

		if(fields.length > 0){
			let msg = {
				"msgType" : 1,
				"response" : fields.join(", ")+": is required",
				"data" : null
			}
			return res.send(msg);
		}

		this.users.search('email', email, new Array('id')).then(
			(response) => {
				if(response.length > 0){
					return response[0].id;
				} else {
					let msg = {
						'result' : null,
						'error' : {
							'message' : 'E-mail not found',
							'code' : 1
						}
					}

					res.send(msg);
					return false;
				}
			},

			(exception) => {
				res.send(exception);
				return false;
			}
		).then((response) => {
			if(response === false){
				return false;
			}

			let id = response;
			let new_password = helpers.randomstring(gConf.password_restore_generate_length); 
			let password_generated = helpers.cryptoSha256(new_password);

			let data = {
				'id' : id,
				'password' : password_generated
			}

			this.f_update(data).then(
				(response) => {

					if(response.error === null){
						return new_password;
					} else {
						res.send(response);
						return false;
					}
				},
				(exception) => {
					res.send(exception);
					return false;
				}
			).then((response) => {
				if(response === false){
					return false;
				}

				let new_password = response;
				let text = "Your new password: "+new_password;

				let data = {
					"to" : "uelssonrodrigues@gmail.com",
					"subject" : "Password reset",
					"text" : text,	
				}

				helpers.sendEmail(data).then(
					(response) => {
						let msg = {
							'result' : 'E-mail sent',
							'error' : null
						}
						res.send(msg);
					},
					(exception) => {
						let msg = {
							'result' : null,
							'error' : {
								'message' : 'ERROR OCURRED',
								'code' : 0
							}
						}
						res.send(msg);
					}
				);
			});
		});
	}


	/**
	 *
	 */
	internBalance(user_id){
		return new Promise((resolve, reject) => {
			this.users.balance(user_id).then(
				(result) => {
					if(result.length !== 0){
						let resultData = result[0];
						let deposits = 0;
						let withdrawal = 0;
						let tickets = 0;
						let balance = 0;

						if(resultData.deposits_sum !== null){
							deposits = resultData.deposits_sum;
						}
						if(resultData.withdrawal_sum !== null){
							withdrawal = resultData.withdrawal_sum;
						}
						if(resultData.tickets_sum !== null){
							tickets = resultData.tickets_sum;
						}

						balance = ((deposits - withdrawal) - tickets);
						
						let msg = {
							'result' : balance,
							'error' : null
						};

						resolve(msg);
					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : '0',
								'message' : 'User balance not found'
							}
						};

						resolve(msg);
					}
				},
				(err) => {
					let msg = {
						'result' : null,
						'error' : {
							'code' : 'INTERBALANCE:ERR001',
							'message' : 'An error occurred'
						}
					};

					reject(msg);
				}
			);
		});
		
	}

	balance(req, res){
		// Check user permission level
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);
		let userId = parseInt(req.params.id);

		if(userLoggedLevel === 1 && userLoggedId !== userId){
			let msg = {
				"msgType" : 0,
				"response" : "You not have permission for this",
				"data" : null
			}
			return res.status(401).send(msg);
		}

		if(userId <= 0){
			let msg = {
				"msgType" : 1,
				"response" : "User id invalid",
				"data" : null
			}
			return res.send(msg);
		} 
		
		if(isNaN(userId)) {
			let msg = {
				"msgType" : 1,
				"response" : "User id is not a number",
				"data" : null
			}
			return res.send(msg);
		}

		this.users.balance(userId).then(
			(result) => {
				if(result.length !== 0){
					let resultData = result[0];
					let deposits = 0;
					let withdrawal = 0;
					let tickets = 0;
					let balance = 0;

					if(resultData.deposits_sum !== null){
						deposits = resultData.deposits_sum;
					}
					if(resultData.withdrawal_sum !== null){
						withdrawal = resultData.withdrawal_sum;
					}
					if(resultData.tickets_sum !== null){
						tickets = resultData.tickets_sum;
					}

					balance = ((deposits - withdrawal) - tickets);
					
					let msg = {
						"msgType" : 2,
						"response" : null,
						"data" : {
							"balance" : balance
						}
					}
					return res.send(msg);
				} else {
					let msg = {
						"msgType" : 1,
						"response" : "User balance not found",
						"data" : null
					}
					return res.send(msg);
				}
			},
			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - BALANCE:ERR001",
					"data" : null
				}
				return res.status(400).send(msg);
			}
		);
	}



	//=======================================#=======================================//
	f_update(data, token = false, personalized = false){

		return new Promise((resolve, reject) => {
			this.users.update(data, token).then(
				(response) => {
					if(response.changedRows === 1){

						let msg = {
							'result' : personalized === false ? 'Changes has been applied' : personalized,
							'error' : null
						};

						resolve(msg);
					} else {
						// No changes for this user
						let msg = {
							'result' : null,
							'error' : {
								'message' : 'No changes for this user',
								'code' : 1
							}
						};

						resolve(msg);
					}
				} ,

				(exception) => {
					// exception
					let msg = {
					'result' : null,
						'error' : {
							'message' : 'Exception on: f_update',
							'code' : 0
						}
					};

					reject(msg);
				}
			);
		});
	}

	f_token_expiration(token){
		return new Promise((resolve, reject) => {
			this.users.getTokenExpiration(token).then(
				(result) => {
					if(result.length === 0){
						// invalid token
						let msg = {
							'result' : null,
							'error' : {
								'message' : 'Token was already used',
								'code' : 1
							}
						};

						resolve(msg);
					} else {
						let token_timestamp = result[0].dt_token_expiration;
						let current_timestamp = helpers.timestamp();

						// check token expiration
						if(token_timestamp > current_timestamp){
							// result[0].id;
							let msg = {
								'result' : result[0].id,
								'error' : null
							};

							resolve(msg);
						} else {
							// token deadline is over
							let msg = {
							'result' : null,
								'error' : {
									'message' : 'Token deadline is over',
									'code' : 1
								}
							};

							resolve(msg);
						}
					}
				}, 

				(err) => {
					// ocorreu um pepino
					let msg = {
					'result' : null,
						'error' : {
							'message' : 'exeption on: f_token_expiration',
							'code' : 0
						}
					};

					reject(msg);
				}
			);
		});
	}
}

module.exports = usersController;