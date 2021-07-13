const helpers = require("../helpers/helpers");

//models
const Withdrawal = require('../models/Withdrawal');

//controllers
const btcTransactionCtrl = require('../btccore/btcTransactionController');
const btcWalletCtrl = require('../btccore/btcWalletController');
const btcAddressCtrl = require('../btccore/btcAddressController');
const btcUtilCtrl = require('../btccore/btcUtilController');
const usersCtrl = require('./usersController');

const gConf = require('../../config/global');

class withdrawalController {
	constructor(){
		this.withdrawal = new Withdrawal();
		this.btcTransaction = new btcTransactionCtrl();
		this.btcWallet = new btcWalletCtrl();
		this.btcAddress = new btcAddressCtrl();
		this.btcUtil = new btcUtilCtrl();
		this.users = new usersCtrl();
	}


	/**
	 * List tickets for a specific user
	 */
	index(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let page = req.query.page;
		let limit = req.query.limit;

		let fields = [];
		if(page === undefined || page === ''){
			fields.push('page');
		}

		if(limit === undefined || limit === ''){
			fields.push('limit');
		}

		if(fields.length > 0){
			let msg = {
				'result' : null,
				'error' : {
					'code' : '0',
					'message' :  fields.join(', ')+': is required'
				}
			}
			return res.send(msg);
		}

		let fieldsNumber = [];
		if(page !== ""){
			if(isNaN(parseInt((page * 1e8).toFixed())) || parseInt((page * 1e8).toFixed()) < 0){
				fieldsNumber.push("page");
			} else {
				page = parseInt(page);
			}
		}

		if(limit !== ""){
			if(isNaN(parseInt((limit * 1e8).toFixed())) || parseInt((limit * 1e8).toFixed()) <= 0){
				fieldsNumber.push("limit");
			} else {
				limit = parseInt(limit);
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				'result' : null,
				'error' : {
					'code' : '0',
					'message' :  fieldsNumber.join(', ')+': this field(s) is not a number or smaller than permitted'
				}
			}
			return res.send(msg);
		}

		this.withdrawal.list(page, limit, userLoggedId).then(
			(result) => {
				let msg = {
					'result' : result,
					'error' : null
				};

				return res.send(msg);
			}, 

			(err) => {
				console.log(err);
			}
		);
	}


	/**
	 *
	 */
	getFee(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let amount = (req.body.amount * 1e8).toFixed();
		let to = req.body.to;

		this.createTransaction(amount, to).then(
			(result) => {
				let dataResult = result[0];
				
				if(dataResult.error === null){
					let msg = {
						'result' : {
							'fee' : dataResult.result.fee
						},
						'error' : null
					};

					return res.send(msg);
				} else {
					let msg = {
						'result' : null,
						'error' : dataResult.err
					};

					return res.send(msg);
				}
			},

			(err) => {
				let msg = {
					'result' : null,
					'error' : {
						'code' : '000-1',
						'message' : 'An error ocurred'
					}
				};

				return res.send(msg);
			}
		);
	}


	/**
	 *
	 */
	create(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let fee = req.body.fee; // required - int
		let amount = req.body.amount; // required - int
		let memo = req.body.memo; // optional
		let to_address = req.body.to_address; // required

		var timestamp = helpers.timestamp();

		let fields = [];
		if(fee === undefined || fee === ''){
			fields.push('fee');
		}

		if(amount === undefined || amount === ''){
			fields.push('amount');
		}

		if(to_address === undefined || to_address === ''){
			fields.push('to_address');
		}

		if(fields.length > 0){
			let msg = {
				'result' : null,
				'error' : {
					'code' : '0',
					'message' :  fields.join(', ')+': is required'
				}
			}
			return res.send(msg);
		}

		let fieldsNumber = [];
		if(amount !== ""){
			if(isNaN(parseInt((amount * 1e8).toFixed())) || parseInt((amount * 1e8).toFixed()) === 0){
				fieldsNumber.push("amount");
			}
		}

		if(fee !== ""){
			if(isNaN(parseInt((fee * 1e8).toFixed())) || parseInt((fee * 1e8).toFixed()) === 0){
				fieldsNumber.push("fee");
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				'result' : null,
				'error' : {
					'code' : '0',
					'message' :  fieldsNumber.join(', ')+': this field(s) is not a number or smaller than permitted'
				}
			}
			return res.send(msg);
		}

		fee = parseInt((fee * 1e8).toFixed());
		amount = parseInt((amount * 1e8).toFixed());

		let data = {
			'user_id' : userLoggedId,
			'fee' : fee,
			'amount' : amount,
			'memo' : memo,
			'to_address' : to_address,
			'dt_created' : timestamp
		}

		this.users.internBalance(userLoggedId).then(
			(response) => {
				if(response.error === null){
					if((fee+amount) < response.result){

						this.withdrawal.create(data).then(
							(response) => {
								if(response.affectedRows === 1){
									let msg = {
										'result' : 'Withdrawal order created',
										'error' : null
									}
									return res.send(msg);
								} else {
									let msg = {
										'result' : null,
										'error' : {
											'code' : '1',
											'message' :  'Withdrawal not created'
										}
									}
									return res.send(msg);
								}
							},

							(err) => {
								let msg = {
									'result' : null,
									'error' : {
										'code' : '0',
										'message' :  'error'
									}
								}
								return res.send(msg);
							}
						);

					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : '1',
								'message' :  'Insuficient balance'
							}
						}
						return res.send(msg);

					}
				}
			},
			(err) => {
				console.log(err);
			}
		);
	}


	/**
	 * Intern function
	 */
	generateFinalRaw(to_address, amount){
		let fields = [];
		if(amount === ''){
			fields.push('amount');
		}

		if(to_address === ''){
			fields.push('to_address');
		}

		if(fields.length > 0){
			let msg = {
				'result' : null,
				'error' : {
					'code' : '0',
					'message' :  fields.join(', ')+': is required'
				}
			}
			return res.send(msg);
		}

		let fieldsNumber = [];
		if(amount !== ""){
			if(isNaN(parseInt((amount * 1e8).toFixed())) || parseInt((amount * 1e8).toFixed()) <= 0){
				fieldsNumber.push("amount");
			}
		}

		if(fieldsNumber.length > 0){
			let msg = {
				'result' : null,
				'error' : {
					'code' : '0',
					'message' :  fieldsNumber.join(', ')+': this field(s) is not a number or smaller than permitted'
				}
			}
			return res.send(msg);
		}

		return new Promise((resolve, reject) => {
			this.createTransaction(amount, to_address).then(
				(result) => {
					let dataResult = result[0];
					
					if(dataResult.error === null){
						let hex =  dataResult.result.hex;
						resolve(hex);
					} else {
						resolve(result);
					}
				},

				(err) => {
					resolve(err);
				}
			);
		});
	}


	/**
	 * Intern function
	 */
	getRecords(limit){
		this.withdrawal.getRecords(limit).then( // get records
			(result) => {
				if(result.length === 0){
					return false;
				}

				for(let i = 0; i < result.length; i++){
					let to_address = result[i].to_address;
					let amount = result[i].amount;
					let id = result[i].id;

					this.generateFinalRaw(to_address, amount).then( // generate raw for record
						(response) => {
							let hex = response;

							this.btcTransaction.sendrawtransaction(hex).then(
								(response) => {
									let txid = response.result;
									
									if(response.error === null){
										let data = {
											'id' : id,
											'raw' : hex,
											'txid' : txid,
											'status' : 'completed'
										};

										this.withdrawal.update(data).then(
											(response) => {
												console.log(response);
											},

											(err) => {
												console.log(err);
											}
										);
									} else {
										console.log(response);
									}

									
								},
								(err) => {
									console.log(err);
								}
							);

						},
						(err) => {
							console.log(err);
						}
					);
				}
			},
			(err) => {
				console.log(err);
			}
		);
	}


	/**
	 *  
	 */
	validateAddress(req, res){
		let userLoggedId = parseInt(req.userId);
		let userLoggedLevel = parseInt(req.userLevel);

		let address = req.params.address;

		this.btcUtil.validateaddress(address).then(
			(result) => {
				if(result.error === null){
					let msg = {
						'result' : {
							'isvalid' : result.result.isvalid
						},
						'error' : null
					};
					return res.send(msg);
				} else {
					return res.send(result);
				}
			},

			(err) => {
				return res.send(err);
			}
		);
	}

	/**
	 *
	 */
	createTransaction(amount, address){
		// amount format: 0.00000000
		amount = (amount / 1e8).toFixed(8);

		let data = new Promise((resolve, reject) => {
			this.btcAddress.listUnspentByAddress(gConf.btc_address).then(
				(result) => {
					let dataResult = result.result[0];
					
					let txid = dataResult.txid;
					let vout = dataResult.vout;
					let changeAddress = dataResult.address;
					let walletAmount = dataResult.amount;
					let toAddress = address;
					let amountSend = amount;

					// validate with passphrase
					this.btcWallet.walletpassphrase(gConf.btc_wallet_passphrase, gConf.btc_wallet_time_unlock).then(
						(response) => {
							if(response.error === null){
								
								this.btcTransaction.createTransaction(txid, vout, toAddress, changeAddress, amountSend, walletAmount).then(
									(result) => {
										return resolve(result[0]);
									},

									(err) => {
										return reject(err);
									}
								);

							} else {
								console.log(response);
							}
						},
						(err) => {
							console.log(err);
						}
					);
				},

				(err) => {
					return reject(err);
				}
			);
		});
		
		return Promise.all([data]);
	}
}

module.exports = withdrawalController;