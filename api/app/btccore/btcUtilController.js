const request = require('request');

const gConf = require('../../config/global');

const host = gConf.btc_rpc_protocol+'://'+gConf.btc_rpc_user+':'+gConf.btc_rpc_password+'@'+gConf.btc_rpc_host+':'+gConf.btc_rpc_port;

class btcUtilController{
	/**
	 * 
	 */
	validateaddress(address){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "validateaddress", "params": [address]}}, (err, httpResponse, body) => {
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
								'code' : '103-01',
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
}

module.exports = btcUtilController;