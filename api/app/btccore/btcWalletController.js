const request = require('request');

const gConf = require('../../config/global');

const host = gConf.btc_rpc_protocol+'://'+gConf.btc_rpc_user+':'+gConf.btc_rpc_password+'@'+gConf.btc_rpc_host+':'+gConf.btc_rpc_port;

class btcWalletController{
	/**
	 * 
	 */
	getwalletinfo(){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "getwalletinfo", "params": []}}, (err, httpResponse, body) => {
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
							'error' : err
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
	walletpassphrase(passphrase, seconds){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "walletpassphrase", "params": [passphrase, seconds]}}, (err, httpResponse, body) => {
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
							'error' : err
						}

						reject(msg);
					}
				}

				resolve(body);
			});
		});
	}
}

module.exports = btcWalletController;