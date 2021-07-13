const request = require('request');
const gConf = require('../../config/global');

const host = gConf.btc_rpc_protocol+'://'+gConf.btc_rpc_user+':'+gConf.btc_rpc_password+'@'+gConf.btc_rpc_host+':'+gConf.btc_rpc_port;

class btcAddressController{
	/**
	 * 
	 */
	getnewaddress(){
		return new Promise((resolve, reject) => {
			request.post(host, {json:{"jsonrpc": "1.0", "method": "getnewaddress", "params": []}}, (err, httpResponse, body) => {
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
	listUnspentByAddress(address){
		return new Promise((resolve, reject) => {
			request({method: 'POST', timeout : 15000, uri : host, json:{"jsonrpc": "1.0", "method": "listunspent", "params": [0, 9999999, [address]]}}, (err, httpResponse, body) => {
				if(err){
					if(err.code === 'ESOCKETTIMEDOUT'){
						let msg = {
							'result' : null,
							'response' : {
								'code' : '001-02',
								'message' : 'ESOCKETTIMEDOUT'
							}
						}
						reject(msg);
					} else {
						let msg = {
							'result' : null,
							'response' : {
								'code' : '001-01',
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

module.exports = btcAddressController;