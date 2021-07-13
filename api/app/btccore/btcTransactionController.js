const request = require('request');

const gConf = require('../../config/global');

const host = gConf.btc_rpc_protocol+'://'+gConf.btc_rpc_user+':'+gConf.btc_rpc_password+'@'+gConf.btc_rpc_host+':'+gConf.btc_rpc_port;


class btcTransactionController{
	/**
	 * 
	 */
	gettxid(address, minimumConfirmations, maximumConfirmations){
		return new Promise((resolve, reject) => {
			request.post(host, {json:{"jsonrpc": "1.0", "method": "listunspent", "params": [minimumConfirmations, maximumConfirmations, [address]]}}, (err, httpResponse, body) => {
				if(err){
					reject(err);
				}
				resolve(body.result);	
			});
		});
		
	}

	/**
	 * 
	 */
	gettransaction(txid){
		return new Promise((resolve, reject) => {
			request.post(host, {json:{"jsonrpc": "1.0", "method": "gettransaction", "params": [txid]}}, (err, httpResponse, body) => {
				if(err){
					reject(err);
				}
				resolve(body.result);	
			});
		});
	}

	/**
	 * 
	 */
	getfee(blocks){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "estimatesmartfee", "params": [blocks]}}, (err, httpResponse, body) => {
				if(err){
					if(err.code === 'ESOCKETTIMEDOUT'){
						let msg = {
							'result' : null,
							'error' : {
								'code' : '102-01',
								'message' : 'ESOCKETTIMEDOUT'
							}
						}

						reject(msg);
					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : 0,
								'message' : err
							}
						}

						reject(msg);
					}
				}

				resolve(body);
			});
		});
	}

	/**
	 *
	 */
	createrawtransaction(txid, from){
		let data = [
			[{"txid" : txid, "vout" : 0}],
			JSON.parse(from)
		];

		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "createrawtransaction", "params": data}}, (err, httpResponse, body) => {
				if(err){
					if(err.code === 'ESOCKETTIMEDOUT'){
						let msg = {
							'result' : null,
							'error' : {
								'code' : '102-01',
								'message' : 'ESOCKETTIMEDOUT'
							}
						}

						reject(msg);
					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : 0,
								'message' : err
							}
						}

						reject(msg);
					}
				}

				resolve(body);
			});
		});
	}

	/**
	 *
	 */
	sendrawtransaction(hex){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "sendrawtransaction", "params": [hex]}}, (err, httpResponse, body) => {
				if(err){
					if(err.code === 'ESOCKETTIMEDOUT'){
						let msg = {
							'result' : null,
							'error' : {
								'code' : '102-01',
								'message' : 'ESOCKETTIMEDOUT'
							}
						}

						reject(msg);
					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : 0,
								'message' : err
							}
						}

						reject(msg);
					}
				}

				resolve(body);
			});
		});
	}

	/**
	 *
	 */
	fundrawtransaction(hexRawTransaction, fee, changeAddress){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "fundrawtransaction", "params": [hexRawTransaction, {"feeRate" : fee, "changeAddress" : changeAddress, "changePosition" : 0}]}}, (err, httpResponse, body) => {
				if(err){
					if(err.code === 'ESOCKETTIMEDOUT'){
						let msg = {
							'result' : null,
							'error' : {
								'code' : '102-01',
								'message' : 'ESOCKETTIMEDOUT'
							}
						}

						reject(msg);
					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : 0,
								'message' : err
							}
						}

						reject(msg);
					}
				}

				resolve(body);
			});
		});
	}

	/**
	 *
	 */
	signrawtransactionwithwallet(hexFundRawTransaction, txid, vout, walletAmount){
		let data = [
			hexFundRawTransaction,
			[{
				"txid" : txid, 
				"vout" : vout, 
				"scriptPubKey" : gConf.btc_address_script_pub_key, 
				"redeemScript" : gConf.btc_address_redeem_script, 
				"amount" : walletAmount
			}]
		];
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "signrawtransactionwithwallet", "params": data}}, (err, httpResponse, body) => {
				if(err){
					if(err.code === 'ESOCKETTIMEDOUT'){
						let msg = {
							'result' : null,
							'error' : {
								'code' : '102-01',
								'message' : 'ESOCKETTIMEDOUT'
							}
						}

						reject(msg);
					} else {
						let msg = {
							'result' : null,
							'error' : {
								'code' : 0,
								'message' : err
							}
						}

						reject(msg);
					}
				}

				resolve(body);
			});
		});
	}

	/*==============================================Mounted===============================================*/

	/**
	 *
	 */
	createTransaction(txid, vout, toAddress, changeAddress, amountSend, walletAmount){
		let data = new Promise((resolve, reject) => {
			this.createrawtransaction(txid, '{'+'"'+toAddress+'"'+' : '+amountSend+'}').then(
				(result) => {

					if(result.error === null){
						
						let hex = result.result;

						this.getfee(2).then(
							(result) => {

								if(result.error === null){

									let fee = result.result.feerate;

									this.fundrawtransaction(hex, fee, changeAddress).then(
										(result) => {
											
											if(result.error === null){

												let feeForTransaction = result.result.fee;

												this.signrawtransactionwithwallet(result.result.hex, txid, vout, walletAmount).then(
													(result) => {

														if(result.error === null){
															let data = {
																"hex" : result.result.hex,
																"fee" : feeForTransaction
															}
													
															let msg = {
																'result' : data,
																'error' : null
															}

															resolve(msg);
														} else {
															reject(result);
														}

													},
													(err) => {
														reject(err);
													}
												);

											} else {
												reject(result);
											}

										},
										(err) => {
											reject(err);
										}
									);

								} else {
									reject(result);
								}

							}, 
							(err) => {
								reject(err);
							}
						);

					} else {
						reject(result);
					}

				},
				(err) => {
					reject(err);
				}
			);			
		});

		return Promise.all([data]);	
	}
}

module.exports = btcTransactionController;