const connection = require("../../config/connection");
const table = 'deposits';

class Deposits{
	constructor(){
		this.db = new connection();
	}


	list(page, limit, user_id, filters = null){
		// ex: (1 * 10) - 10 = 0 // offset start
		var offset = (page * limit) - limit;
		if(offset < 0){
			offset = 0;
		}

		// get results
		var p1 = new Promise((resolve, reject) => {
			let sql = 
					`
						SELECT 
							id,
							user_id,
							amount,
							address,
							txid,
							status,
							DATE_FORMAT(FROM_UNIXTIME(dt_created), '%d/%m/%Y %H:%i:%s') as dt_created
						FROM ?? 
						WHERE user_id = ? 
						ORDER BY id 
						DESC LIMIT ?,?
					`;
			
			var fields = [
				table,
				user_id,
				offset,
				limit
			];

			sql = this.db.connect().format(sql, fields);

			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});

		// count all results in database
		var p2 = new Promise((resolve, reject) => {
			var sql = 'SELECT COUNT(id) as total FROM ?? WHERE user_id = ?';

			var fields = [
				table,
				user_id
			];

			sql = this.db.connect().format(sql, fields);

			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}

				var numbersOfPage = 0;
				var current = page;

				// count number of pages
				if(result[0].total % limit === 0){
					numbersOfPage = result[0].total / limit;
				} else {
					numbersOfPage = Math.floor((result[0].total / limit)) + 1;
				}

				var data = {
					"current" : current,
					"numbersOfPage" : numbersOfPage,
					"total" : result[0].total,
				}
				resolve(data);
			});
		});


		return Promise.all([p1, p2]);
	}

	/**
	 * Get results by id
	 */
	get(id){
		var sql = 'SELECT * FROM ?? WHERE id = ?';

		var params = [
			table,
			id
		];

		sql = this.db.connect().format(sql, params);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});
	}

	/**
	 * get unused address, this function permit the user generate one address per time
	 */
	getUnusedAddress(user_id){
		var sql = "SELECT id, address, user_id FROM ?? WHERE status = 'unconfirmed' AND user_id = ?";

		var params = [
			table,
			user_id
		];

		sql = this.db.connect().format(sql, params);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			})
		});
	}

	/**
	 * Create a new deposit
	 */	
	create(data){
		let values = [
			data.user_id,
			data.address,
			data.dt_created
		];

		var sql = 'INSERT INTO ?? (user_id, address, dt_created) VALUES (?)';

		var params = [
			table,
			values
		];

		sql = this.db.connect().format(sql, params);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});
	}

	/**
	 * Update deposit data
	 */
	update(data){
		let params = [
			table
		];
		let fields = [];
		let where = "";

		if(data.amount !== undefined && data.amount !== ""){
			params.push(data.amount);
			fields.push('amount = ?');
		}
		if(data.txid !== undefined && data.txid !== ""){
			params.push(data.txid);
			fields.push('txid = ?');
		}
		if(data.status !== undefined && data.status !== ""){
			params.push(data.status);
			fields.push('status = ?');
		}
		params.push(data.id);

		let sql = 'UPDATE ?? SET '+fields.join(', ')+' WHERE id = ? LIMIT 1';

		sql = this.db.connect().format(sql, params);

		return new Promise((resolve, reject) => {
			this.db.connect().query(sql, function(err, result){
				if(err){
					reject(err);
				}
				resolve(result);
			});
		});
	}
}

module.exports = Deposits;