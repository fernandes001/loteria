const helpers = require("../helpers/helpers");

// models
const Deposits = require('../models/Deposits');

// controllers
const btcAddressCtrl = require('../btccore/btcAddressController');
const btcTransactionCtrl = require('../btccore/btcTransactionController');

class depositsController{
	constructor(){
		this.deposits = new Deposits();
		this.btcAddress = new btcAddressCtrl();
		this.btcTransaction = new btcTransactionCtrl();
	}


	/**
	 * List deposits for an specic user
	 */
	index(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let page = parseInt(req.query.page);
		let limit = parseInt(req.query.limit);

		if(!isNaN(page)){
			if(page < 0){
				let msg = {
					"msgType" : 1,
					"response" : "page: value needs greater than zero",
					"data" : null
				}
				return res.send(msg);
			}
		} else {
			let msg = {
				"msgType" : 1,
				"response" : "page: is not a number",
				"data" : null
			}
			return res.send(msg);
		}

		if(!isNaN(limit)){
			if(limit <= 0){
				let msg = {
					"msgType" : 1,
					"response" : "limit: value needs greater and equal than zero",
					"data" : null
				}
				return res.send(msg);
			}
		} else {
			let msg = {
				"msgType" : 1,
				"response" : "limit: is not a number",
				"data" : null
			}
			return res.send(msg);
		}

		this.deposits.list(page, limit, userLoggedId).then(
			(result) => {
				let msg = {
					"msgType" : 2,
					"response" : null,
					"data" : result
				}
				return res.send(msg);
			} , 

			(err) => {

				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - INDEX:ERR001",
					"data" : null
				}

				return res.status(400).send(msg);
			}
		);
	}


	/**
	 * Generate new deposit address
	 */
	create(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);
		var timestamp = helpers.timestamp();

		// check if exists address unused
		this.deposits.getUnusedAddress(userLoggedId).then(
			(result) => {
				if(result.length === 1){
					let msg = {
						"msgType" : 2,
						"response" : null,
						"data" : {
							"address" : result[0].address
						}
					}

					return res.send(msg);
				} else { 
					// generate a new address and save this address into database
					this.btcAddress.getnewaddress().then(
						(result) => {
							let data = {
								'user_id' : userLoggedId,
								'address' : result,
								'dt_created' : timestamp
							}
							this.deposits.create(data).then(
								(result) => {
									if(result.affectedRows === 1){
										let msg = {
											"msgType" : 2,
											"response" : null,
											"data" : {
												"address" : data.address
											}
										}

										return res.send(msg);
									} else {
										let msg = {
											"msgType" : 1,
											"response" : 'Address generated, but not saved into database, please try again',
											"data" : null
										}

										return res.send(msg);
									}
								},
								(err) => {
									let msg = {
										"msgType" : 0,
										"response" : "An error occurred - CREATE:ERR002",
										"data" : null
									}

									return res.status(400).send(msg);
								}
							);
						},
						(err) => {
							let msg = {
								"msgType" : 0,
								"response" : "An error occurred - CREATE:ERR003",
								"data" : null
							}

							return res.status(400).send(msg);
						}
					);
				}
			}, 

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - CREATE:ERR001",
					"data" : null
				}

				return res.status(400).send(msg);
			}
		);
	}


	update(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);
		
		// put and query field		
		let id = parseInt(req.params.id);
		let amount = req.body.amount;
		let txid = req.body.txid;
		let status = req.body.status;
		let data = {'id' : id, 'userLoggedId' : userLoggedId}; // default field

		// default field
		if(isNaN(id)){
			let msg = {
				"msgType" : 1,
				"response" : "id: is not a number",
				"data" : null
			}
			return res.send(msg);
		}
		if(id <= 0){
			let msg = {
				"msgType" : 1,
				"response" : "id: value needs greater than zero",
				"data" : null
			}
			return res.send(msg);
		}
		
		// optional field
		if(amount !== undefined && amount !== ""){
			if(amount.toString().length > 11){
				let msg = {
					"msgType" : 1,
					"response" : "amount: value is much long, limit is 11 characters",
					"data" : null
				}
				return res.send(msg);
			}

			if(isNaN(amount)){
				let msg = {
					"msgType" : 1,
					"response" : "id: is not a number",
					"data" : null
				}
				return res.send(msg);
			}

			data.amount = amount; // add value to data
		}

		// optional field
		if(txid !== undefined && txid !== ""){
			if(txid.length > 74){
				let msg = {
					"msgType" : 1,
					"response" : "txid: value is much long, limit is 74 characters",
					"data" : null
				}
				return res.send(msg);
			}

			data.txid = txid; // add value to data
		}

		// optional field
		if(status !== undefined && status !== ""){
			if(status.length > 20){
				let msg = {
					"msgType" : 1,
					"response" : "status: value is much long, limit is 20 characters",
					"data" : null
				}
				return res.send(msg);
			}

			if(status !== 'canceled' || status !== 'unconfirmed' || status !== 'progress' || status !== 'completed'){
				let msg = {
					"msgType" : 1,
					"response" : "status: values permitted(canceled, unconfirmed, progress, completed)",
					"data" : null
				}
				return res.send(msg);
			}

			data.status = status; // add value to data
		}

		// needs one or more optional fields plus the default fields
		if(Object.keys(data).length <= 2){
			let msg = {
				"msgType" : 1,
				"response" : "Needs one or more fields for submit",
				"data" : null
			}
			return res.send(msg);
		}

		this.deposits.update(data).then(
			(result) => {
				console.log('data', data);
			},

			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - UPDATE:ERR001",
					"data" : null
				}

				return res.status(400).send(msg);
			}
		);
	}


	/**
	 * Check deposit status
	 */
	depositStatus(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let id = parseInt(req.body.id);

		// default field
		if(isNaN(id)){
			let msg = {
				"msgType" : 1,
				"response" : "id: is not a number",
				"data" : null
			}
			return res.send(msg);
		}
		if(id <= 0){
			let msg = {
				"msgType" : 1,
				"response" : "id: value needs greater than zero",
				"data" : null
			}
			return res.send(msg);
		}
		// get deposits
		this.deposits.get(id).then(
			(result) => {
				if(result.length > 0){
					// check access level
					if(userLoggedLevel === 1 && (userLoggedId !== result[0].user_id)){
						let msg = {
							"msgType" : 0,
							"response" : "You not have permission for this",
							"data" : null
						}
						return res.status(401).send(msg);
					}

					// check status is completed
					if(result[0].status === 'completed'){
						let msg = {
							"msgType" : 1,
							"response" : "The deposit has more than 6 confirmations",
							"data" : null
						}
						return res.send(msg);
					}

					let address = result[0].address;

					if(result[0].txid === null){
						// get txid by address
						this.btcTransaction.gettxid(address, 0, 1000).then(
							(result) => {
								if(result.length > 0){
									let txid = result[0].txid;
									let amount = (result[0].amount * 1e8).toFixed();
									let status = '';
									
									if(result[0].confirmations === 0){
										status = 'unconfirmed';
									} else if(result[0].confirmations >= 1 && result[0].confirmations <= 5){
										status = 'progress';
									} else if(result[0].confirmations > 5){
										status = 'completed';
									}

									let update = {
										'id' : id,
										'txid' : txid,
										'amount' : amount,
										'status' : status
									}

									// update txid, amount, status
									this.deposits.update(update).then(
										(result) => {
											if(result.changedRows === 1){
												let msg = {
													"msgType" : 2,
													"response" : "Deposit updated",
													"data" : null
												}

												return res.send(msg);
											} else {
												let msg = {
													"msgType" : 1,
													"response" : "No changes for this deposit",
													"data" : null
												}

												return res.send(msg);
											}
										},
										(err) => {
											let msg = {
												"msgType" : 0,
												"response" : "An error occurred - DEPOSITSTATUS:ERR001",
												"data" : null
											}

											return res.status(400).send(msg);
										}
									);
								} else {
									let msg = {
										"msgType" : 1,
										"response" : "No transactions for this deposit",
										"data" : null
									}
									return res.send(msg);
								}
							},
							(err) => {
								let msg = {
									"msgType" : 0,
									"response" : "An error occurred - DEPOSITSTATUS:ERR002",
									"data" : null
								}

								return res.status(400).send(msg);
							}
						);
					} else {
						let txid = result[0].txid;

						// get transaction by txid
						this.btcTransaction.gettransaction(txid).then(
							(result) => {
								let status = '';

								if(result.confirmations >= 0 && result.confirmations <= 5){
									status = 'progress';
								} else if(result.confirmations > 5){
									status = 'completed';
								}

								let update = {
									'id' : id,
									'status' : status
								}

								// update only status
								this.deposits.update(update).then(
									(result) => {
										if(result.changedRows === 1){
											let msg = {
												"msgType" : 2,
												"response" : "Deposit updated",
												"data" : null
											}

											return res.send(msg);
										} else {
											let msg = {
												"msgType" : 1,
												"response" : "No changes for this deposit",
												"data" : null
											}

											return res.send(msg);
										}
									},
									(err) => {
										let msg = {
											"msgType" : 0,
											"response" : "An error occurred - DEPOSITSTATUS:ERR003",
											"data" : null
										}

										return res.status(400).send(msg);
									}
								);
							},
							(err) => {
								let msg = {
									"msgType" : 0,
									"response" : "An error occurred - DEPOSITSTATUS:ERR004",
									"data" : null
								}

								return res.status(400).send(msg);
							}
						);
					}
				} else {
					let msg = {
						"msgType" : 1,
						"response" : "No deposits found",
						"data" : null
					}
					return res.send(msg);
				}
			},
			(err) => {
				let msg = {
					"msgType" : 0,
					"response" : "An error occurred - DEPOSITSTATUS:ERR005",
					"data" : null
				}

				return res.status(400).send(msg);
			}
		);
	}
}

module.exports = depositsController;